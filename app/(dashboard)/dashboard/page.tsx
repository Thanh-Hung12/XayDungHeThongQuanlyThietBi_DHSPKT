import { Card } from "@/components/ui/card";
import { Topbar } from "@/components/layout/topbar";
import { dashboardStats, reports } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <>
      <Topbar
        title="Tong quan he thong"
        description="Theo doi tinh trang thiet bi, phieu muon va muc do san sang cua kho."
      />
      <main className="space-y-6 p-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((item) => (
            <Card key={item.label} className="p-5">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{item.value}</p>
              <p className="mt-2 text-sm text-slate-500">{item.note}</p>
            </Card>
          ))}
        </section>
        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-950">Trang thai trien khai</h3>
            <div className="mt-6 grid gap-4">
              {[
                "Prisma schema + seed da duoc scaffold",
                "Auth.js credentials + middleware da duoc them",
                "API route cho thiet bi, 2FA, cron da co san",
                "Dashboard module cho thiet bi, muon tra, kiem ke, bao cao",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-950">Bao cao nhanh</h3>
            <div className="mt-6 space-y-3">
              {reports.map((item) => (
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
