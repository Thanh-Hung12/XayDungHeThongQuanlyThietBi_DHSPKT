"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function taoDotKiemKe(tenDot: string, ngayBatDau: string) {
  const session = await auth();
  const user = session?.user;

  if (!user || !["ADMIN", "THU_KHO"].includes(user.role)) {
    throw new Error("Khong co quyen tao dot kiem ke");
  }

  const thietBis = await prisma.thietBi.findMany({
    where: { trangThai: { not: "THANH_LY" } },
    select: { id: true },
  });

  return prisma.dotKiemKe.create({
    data: {
      tenDot,
      ngayBatDau: new Date(ngayBatDau),
      nguoiTao: user.name ?? "System",
      items: {
        create: thietBis.map((item) => ({
          thietBiId: item.id,
        })),
      },
    },
  });
}

export async function xacNhanKiemKe(
  kiemKeItemId: string,
  trangThaiThucTe: string,
  ghiChu?: string,
) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    throw new Error("Chua dang nhap");
  }

  return prisma.kiemKeItem.update({
    where: { id: kiemKeItemId },
    data: {
      trangThaiThucTe,
      ghiChu,
      daXacNhan: true,
      ngayXacNhan: new Date(),
    },
  });
}
