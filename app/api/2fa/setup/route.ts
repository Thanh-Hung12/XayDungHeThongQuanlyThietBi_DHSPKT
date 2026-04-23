import QRCode from "qrcode";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const speakeasy = await import("speakeasy");
  const secret = speakeasy.generateSecret({
    name: `QLTHIETBI (${user.email})`,
  });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      twoFactorSecret: secret.base32,
    },
  });

  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url ?? "");
  return Response.json({ qrCodeUrl, secret: secret.base32 });
}

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token } = (await request.json()) as { token: string };
  const speakeasy = await import("speakeasy");
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { twoFactorSecret: true },
  });

  if (!dbUser?.twoFactorSecret) {
    return Response.json({ error: "2FA secret missing" }, { status: 400 });
  }

  const verified = speakeasy.totp.verify({
    secret: dbUser.twoFactorSecret,
    encoding: "base32",
    token,
  });

  if (!verified) {
    return Response.json({ error: "Ma khong hop le" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorEnabled: true },
  });

  return Response.json({ success: true });
}
