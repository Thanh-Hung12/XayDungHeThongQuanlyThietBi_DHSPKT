import { Topbar } from "@/components/layout/topbar";
import { MaintenanceManagementPanel } from "@/components/bao-tri/maintenance-management-panel";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function MaintenancePage() {
  const [items, devices, technicians] = await Promise.all([
    prisma.baoTri.findMany({
      include: {
        thietBi: {
          select: { id: true, maThietBi: true, tenThietBi: true, trangThai: true },
        },
        kyThuatVien: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.thietBi.findMany({
      select: { id: true, maThietBi: true, tenThietBi: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.user.findMany({
      where: { role: { in: ["ADMIN", "TRUONG_KHOA", "THU_KHO", "GIANG_VIEN"] } },
      select: { id: true, name: true, email: true, role: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const rows = items.map((item) => ({
    id: item.id,
    loaiBaoTri: item.loaiBaoTri,
    moTaVanDe: item.moTaVanDe,
    ketQua: item.ketQua,
    chiPhi: item.chiPhi ? Number(item.chiPhi) : null,
    ngayBatDau: item.ngayBatDau.toISOString(),
    ngayHoanThanh: item.ngayHoanThanh?.toISOString() ?? null,
    thietBi: {
      id: item.thietBi.id,
      maThietBi: item.thietBi.maThietBi,
      tenThietBi: item.thietBi.tenThietBi,
      trangThai: item.thietBi.trangThai,
    },
    kyThuatVien: item.kyThuatVien
      ? {
          id: item.kyThuatVien.id,
          name: item.kyThuatVien.name,
          email: item.kyThuatVien.email,
          role: item.kyThuatVien.role,
        }
      : null,
  }));

  const summary = [
    {
      title: "Tong phieu",
      value: rows.length.toString(),
      note: "Toi da 50 phieu gan nhat tren dashboard.",
    },
    {
      title: "Dang xu ly",
      value: rows.filter((item) => !item.ngayHoanThanh).length.toString(),
      note: "Phieu chua co ngay hoan thanh.",
    },
    {
      title: "Hoan thanh",
      value: rows.filter((item) => item.ngayHoanThanh).length.toString(),
      note: "Phieu da co ngay hoan thanh.",
    },
    {
      title: "Cap nhat",
      value: formatDate(new Date()),
      note: "Thoi gian render server.",
    },
  ];

  const deviceOptions = devices.map((device) => ({
    id: device.id,
    label: `${device.maThietBi} - ${device.tenThietBi}`,
  }));

  const technicianOptions = technicians.map((tech) => ({
    id: tech.id,
    label: `${tech.name} (${tech.role})`,
  }));

  return (
    <>
      <Topbar
        title="Bao tri"
        description="Module danh cho tien trinh bao tri, sua chua va nang cap thiet bi."
      />
      <main className="space-y-6 p-6">
        <Card className="p-4">
          <MaintenanceManagementPanel
            items={rows}
            devices={deviceOptions}
            technicians={technicianOptions}
            summary={summary}
          />
        </Card>
      </main>
    </>
  );
}
