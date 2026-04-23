"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Boxes, ClipboardList, LayoutDashboard, LogOut, ShieldCheck, Wrench, Settings } from "lucide-react";

import { logout } from "@/app/actions/auth.actions";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Tong quan", icon: LayoutDashboard },
  { href: "/dashboard/thiet-bi", label: "Thiet bi", icon: Boxes },
  { href: "/dashboard/muon-tra", label: "Muon tra", icon: ClipboardList },
  { href: "/dashboard/bao-tri", label: "Bao tri", icon: Wrench },
  { href: "/dashboard/kiem-ke", label: "Kiem ke", icon: ShieldCheck },
  { href: "/dashboard/bao-cao", label: "Bao cao", icon: BarChart3 },
  { href: "/dashboard/cai-dat", label: "Cai dat", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="fixed inset-0 h-[100dvh] w-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="mx-auto grid h-full w-full max-w-full grid-cols-1 gap-6 px-4 py-4 lg:grid-cols-[260px_1fr]">
        <aside className="flex flex-col rounded-2xl bg-white p-5 text-slate-800 shadow-md">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-600">QLTHIETBI</p>
            <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-900">DHSPKT Asset Hub</h1>
            <p className="mt-2 text-sm text-slate-500">Quan ly thiet bi, kho va quy trinh muon tra.</p>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out",
                    active
                      ? "bg-teal-50 text-teal-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  <Icon className={cn("h-5 w-5 transition-colors", active ? "text-teal-600" : "text-slate-400 group-hover:text-slate-600")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-slate-100 pt-4">
            <form action={logout}>
              <button
                type="submit"
                className={cn(
                  "group flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  "text-slate-600 hover:bg-rose-50 hover:text-rose-600",
                )}
              >
                <LogOut className="h-5 w-5 text-slate-400 transition-colors group-hover:text-rose-500" />
                <span>Dang xuat</span>
              </button>
            </form>
          </div>
        </aside>
        <main className="flex h-full flex-col overflow-y-auto rounded-2xl bg-white shadow-md">
          {children}
        </main>
      </div>
    </div>
  );
}
