import { addDays } from "date-fns";

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const tomorrow = addDays(now, 1);

  const sapHan = await prisma.phieuMuon.findMany({
    where: {
      trangThai: "DANG_MUON",
      ngayTraDuKien: {
        gte: now,
        lte: tomorrow,
      },
    },
    include: {
      nguoiMuon: true,
      thietBi: true,
    },
  });

  const quaHan = await prisma.phieuMuon.findMany({
    where: {
      trangThai: "DANG_MUON",
      ngayTraDuKien: { lt: now },
    },
    include: {
      nguoiMuon: true,
      thietBi: true,
    },
  });

  if (quaHan.length > 0) {
    await prisma.phieuMuon.updateMany({
      where: { id: { in: quaHan.map((item) => item.id) } },
      data: { trangThai: "QUA_HAN" },
    });
  }

  await Promise.allSettled([
    ...sapHan.map((item) =>
      sendEmail({
        to: item.nguoiMuon.email,
        subject: "[QLTHIETBI] Nhac nho sap den han tra",
        body: `Thiet bi "${item.thietBi.tenThietBi}" can duoc tra truoc han.`,
      }),
    ),
    ...quaHan.map((item) =>
      sendEmail({
        to: item.nguoiMuon.email,
        subject: "[QLTHIETBI] Canh bao qua han tra",
        body: `Thiet bi "${item.thietBi.tenThietBi}" da qua han.`,
      }),
    ),
  ]);

  return Response.json({
    nhacNho: sapHan.length,
    quaHan: quaHan.length,
  });
}
