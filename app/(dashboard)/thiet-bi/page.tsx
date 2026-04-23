import { Topbar } from "@/components/layout/topbar";
import { DeviceManagementPanel } from "@/components/thiet-bi/device-management-panel";
import { prisma } from "@/lib/prisma";

export default async function DevicesPage() {
  const [devices, danhMucs, phongs, khoas, nhaCungCaps] = await Promise.all([
    prisma.thietBi.findMany({
      include: {
        danhMuc: true,
        phong: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),
    prisma.danhMucThietBi.findMany({ orderBy: { tenDM: "asc" } }),
    prisma.phong.findMany({ orderBy: { tenPhong: "asc" } }),
    prisma.khoa.findMany({ orderBy: { tenKhoa: "asc" } }),
    prisma.nhaCungCap.findMany({ orderBy: { tenNCC: "asc" } }),
  ]);

  const deviceRows = devices.map((device) => ({
    id: device.id,
    maThietBi: device.maThietBi,
    tenThietBi: device.tenThietBi,
    moTa: device.moTa,
    thongSoKyThuat: device.thongSoKyThuat,
    serialNumber: device.serialNumber,
    namNhap: device.namNhap,
    giaTriBanDau: Number(device.giaTriBanDau),
    baoHanhDen: device.baoHanhDen?.toISOString() ?? null,
    trangThai: device.trangThai,
    danhMucId: device.danhMucId,
    nhaCungCapId: device.nhaCungCapId,
    khoaId: device.khoaId,
    phongId: device.phongId,
    danhMuc: { tenDM: device.danhMuc.tenDM },
    phong: device.phong ? { tenPhong: device.phong.tenPhong } : null,
  }));

  return (
    <>
      <Topbar
        title="Quan ly thiet bi"
        description="Danh sach thiet bi, thong tin co ban, trang thai va cac thao tac quan ly."
      />
      <main className="space-y-6 p-6">
        <DeviceManagementPanel
          devices={deviceRows}
          danhMucs={danhMucs.map((item) => ({ id: item.id, label: item.tenDM }))}
          phongs={phongs.map((item) => ({ id: item.id, label: item.tenPhong }))}
          khoas={khoas.map((item) => ({ id: item.id, label: item.tenKhoa }))}
          nhaCungCaps={nhaCungCaps.map((item) => ({ id: item.id, label: item.tenNCC }))}
        />

      </main>
    </>
  );
}
