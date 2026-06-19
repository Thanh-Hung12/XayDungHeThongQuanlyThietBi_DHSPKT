import { NextRequest } from "next/server";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recordAuditLog } from "@/lib/audit";

export async function GET() {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    return Response.json({ error: "Không được xác thực" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { twoFactorEnabled: true, twoFactorSecret: true, email: true, name: true },
  });

  if (!dbUser) {
    return Response.json({ error: "Không tìm thấy tài khoản" }, { status: 404 });
  }

  if (dbUser.twoFactorEnabled) {
    return Response.json({ enabled: true });
  }

  const secret = speakeasy.generateSecret({
    name: `QLTHIETBI (${dbUser.email})`,
    length: 20,
  });

  const qrImageUrl = await QRCode.toDataURL(secret.otpauth_url ?? "");

  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorSecret: secret.base32 },
  });

  return Response.json({
    enabled: false,
    secret: secret.base32,
    qrCode: qrImageUrl,
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    return Response.json({ error: "Không được xác thực" }, { status: 401 });
  }

  const { totpCode } = (await request.json()) as { totpCode?: string };
  if (!totpCode) {
    return Response.json({ error: "Vui lòng nhập mã TOTP" }, { status: 400 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { twoFactorSecret: true },
  });

  if (!dbUser?.twoFactorSecret) {
    return Response.json({ error: "Chưa có secret 2FA. Vui lòng bắt đầu lại." }, { status: 400 });
  }

  const verified = speakeasy.totp.verify({
    secret: dbUser.twoFactorSecret,
    encoding: "base32",
    token: totpCode,
    window: 1,
  });

  if (!verified) {
    return Response.json({ error: "Mã TOTP không chính xác hoặc đã hết hạn" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorEnabled: true },
  });

  await recordAuditLog(prisma, {
    userId: user.id,
    action: "ENABLE_2FA",
    entity: "User",
    entityId: user.id,
  });

  return Response.json({ success: true, message: "Bảo mật 2FA đã được kích hoạt thành công!" });
}

export async function DELETE() {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    return Response.json({ error: "Không được xác thực" }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorEnabled: false, twoFactorSecret: null },
  });

  await recordAuditLog(prisma, {
    userId: user.id,
    action: "DISABLE_2FA",
    entity: "User",
    entityId: user.id,
  });

  return Response.json({ success: true, message: "Đã tắt bảo mật 2FA." });
}
