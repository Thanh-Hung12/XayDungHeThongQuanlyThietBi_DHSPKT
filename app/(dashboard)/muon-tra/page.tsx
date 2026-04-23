import { auth } from "@/lib/auth";
import { getBorrowDashboardData } from "@/lib/muon-tra";
import { formatDate } from "@/lib/utils";

import { Topbar } from "@/components/layout/topbar";
import { BorrowManagementPanel } from "@/components/muon-tra/borrow-management-panel";
import { Card } from "@/components/ui/card";

export default async function BorrowPage() {
  const session = await auth();
  const { borrowRequests, availableDevices, canManage } = await getBorrowDashboardData(session?.user);

  const summary = [
    {
      title: "Tong phieu",
      value: borrowRequests.length.toString(),
      note: canManage ? "Tat ca phieu trong he thong" : "Tat ca phieu cua ban",
    },
    {
      title: "Cho duyet",
      value: borrowRequests.filter((item) => item.trangThai === "CHO_DUYET").length.toString(),
      note: "Can xu ly som de tranh trung lich muon",
    },
    {
      title: "Dang muon",
      value: borrowRequests
        .filter((item) => ["DANG_MUON", "QUA_HAN"].includes(item.trangThai))
        .length.toString(),
      note: "Bao gom ca cac phieu da qua han",
    },
    {
      title: "Thiet bi san sang",
      value: availableDevices.length.toString(),
      note: `Cap nhat den ${formatDate(new Date())}`,
    },
  ];

  const borrowRows = borrowRequests.map((item) => ({
    id: item.id,
    maPhieu: item.maPhieu,
    mucDich: item.mucDich,
    ngayMuon: item.ngayMuon.toISOString(),
    ngayTraDuKien: item.ngayTraDuKien.toISOString(),
    ngayTraThucTe: item.ngayTraThucTe?.toISOString() ?? null,
    trangThai: item.trangThai,
    ghiChu: item.ghiChu,
    phiQhanHan: item.phiQhanHan ? Number(item.phiQhanHan) : null,
    tinhTrangTra: item.tinhTrangTra,
    nguoiMuon: {
      name: item.nguoiMuon.name,
      email: item.nguoiMuon.email,
    },
    thietBi: {
      tenThietBi: item.thietBi.tenThietBi,
      maThietBi: item.thietBi.maThietBi,
      phong: item.thietBi.phong ? { tenPhong: item.thietBi.phong.tenPhong } : null,
      khoa: item.thietBi.khoa ? { tenKhoa: item.thietBi.khoa.tenKhoa } : null,
    },
  }));

  const deviceOptions = availableDevices.map((device) => ({
    id: device.id,
    tenThietBi: device.tenThietBi,
    maThietBi: device.maThietBi,
    phong: device.phong ? { tenPhong: device.phong.tenPhong } : null,
    khoa: device.khoa ? { tenKhoa: device.khoa.tenKhoa } : null,
  }));

  return (
    <>
      <Topbar
        title="Muon - tra thiet bi"
        description="Theo doi yeu cau muon, duyet phieu va quan ly qua han."
      />
      <main className="space-y-6 p-6">
        <Card className="p-4">
          <BorrowManagementPanel
            borrowRequests={borrowRows}
            availableDevices={deviceOptions}
            canManage={canManage}
            summary={summary}
          />
        </Card>

      </main>
    </>
  );
}
