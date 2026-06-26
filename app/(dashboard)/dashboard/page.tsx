import { Card } from "@/components/ui/card";
import { Topbar } from "@/components/layout/topbar";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

type DashboardStats = {
  totalDevices: number;
  goodDevices: number;
  baoTriCount: number;
  hongCount: number;
  tongGiaTri: number;
  pendingBorrows: number;
  recentBaoTri: Array<{
    id: string;
    loaiBaoTri: string;
    ngayHoanThanh: Date | null;
    thietBi: { tenThietBi: string; maThietBi: string };
  }>;
};

async function fetchDashboardStats(): Promise<DashboardStats> {
  const [totalDevices, goodDevices, baoTriCount, hongCount, tongGiaTriAgg, pendingBorrows, recentBaoTri] =
    await Promise.all([
      prisma.thietBi.count(),
      prisma.thietBi.count({ where: { trangThai: "TOT" } }),
      prisma.thietBi.count({ where: { trangThai: "BAO_TRI" } }),
      prisma.thietBi.count({ where: { trangThai: "HONG" } }),
      prisma.thietBi.aggregate({ _sum: { giaTriBanDau: true } }),
      prisma.phieuMuon.count({ where: { trangThai: "CHO_DUYET" } }),
      prisma.baoTri.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { thietBi: { select: { tenThietBi: true, maThietBi: true } } },
      }),
    ]);

  return {
    totalDevices,
    goodDevices,
    baoTriCount,
    hongCount,
    tongGiaTri: Number(tongGiaTriAgg._sum.giaTriBanDau ?? 0),
    pendingBorrows,
    recentBaoTri: recentBaoTri as DashboardStats["recentBaoTri"],
  };
}

function DashboardError() {
  return (
    <>
      <Topbar
        title="Tổng quan hệ thống"
        description="Không thể tải dữ liệu vì máy chủ cơ sở dữ liệu hiện không phản hồi."
      />
      <main className="p-6">
        <Card className="border-amber-200 bg-amber-50 p-6 text-amber-900">
          <h3 className="text-lg font-semibold">Không thể kết nối cơ sở dữ liệu</h3>
          <p className="mt-2 text-sm leading-7">
            Hệ thống đã được mở an toàn, nhưng số liệu dashboard chưa thể tải do Prisma không
            kết nối được tới database. Kiểm tra biến môi trường `DATABASE_URL`, trạng thái Neon,
            hoặc mạng nội bộ/VPN nếu có.
          </p>
        </Card>
      </main>
    </>
  );
}

function DashboardContent({ stats: s }: { stats: DashboardStats }) {
  const percentGood = s.totalDevices === 0 ? 0 : Math.round((s.goodDevices / s.totalDevices) * 100);

  const stats = [
    {
      label: "Tổng thiết bị",
      value: s.totalDevices.toLocaleString("vi-VN"),
      note: `${s.goodDevices} đang hoạt động tốt`,
    },
    {
      label: "Cần bảo trì",
      value: s.baoTriCount.toString(),
      note: `${s.hongCount} thiết bị hỏng cần xử lý`,
    },
    {
      label: "Phiếu mượn chờ duyệt",
      value: s.pendingBorrows.toString(),
      note: "Chờ phê duyệt từ cán bộ",
    },
    {
      label: "Tổng giá trị tài sản",
      value: formatCurrency(s.tongGiaTri),
      note: `${percentGood}% thiết bị hoạt động tốt`,
    },
  ];

  return (
    <>
      <Topbar
        title="Tổng quan hệ thống"
        description="Theo dõi tình trạng thiết bị, phiếu nghiệp vụ và mức độ sẵn sàng của kho."
      />
      <main className="space-y-6 p-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <Card key={item.label} className="p-5">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{item.value}</p>
              <p className="mt-2 text-sm text-slate-500">{item.note}</p>
            </Card>
          ))}
        </section>
        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-950">Bảo trì gần đây</h3>
            <div className="mt-6 space-y-3">
              {s.recentBaoTri.length === 0 ? (
                <p className="text-sm text-slate-500">Chưa có phiếu bảo trì nào.</p>
              ) : (
                s.recentBaoTri.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between rounded-xl border border-slate-100 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {item.thietBi.tenThietBi}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{item.loaiBaoTri}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.ngayHoanThanh
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {item.ngayHoanThanh ? "Hoàn thành" : "Đang xử lý"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-950">Thống kê nhanh</h3>
            <div className="mt-6 space-y-3">
              {[
                { title: "Thiết bị hoạt động tốt", value: `${percentGood}%` },
                { title: "Tổng thiết bị đang bảo trì", value: `${s.baoTriCount} thiết bị` },
                { title: "Thiết bị hỏng cần xử lý", value: `${s.hongCount} thiết bị` },
                { title: "Tổng giá trị tài sản", value: formatCurrency(s.tongGiaTri) },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">{item.title}</p>
                  <p className="mt-2 text-base font-medium text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </main>
    </>
  );
}

export default async function DashboardPage() {
  const data = await fetchDashboardStats().catch(() => null);

  if (!data) return <DashboardError />;
  return <DashboardContent stats={data} />;
}
