import { Topbar } from "@/components/layout/topbar";
import { PasswordChangeForm } from "@/components/cai-dat/password-change-form";
import { Card } from "@/components/ui/card";
import { ShieldCheck, User } from "lucide-react";

import { auth } from "@/lib/auth";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <>
      <Topbar
        title="Cài đặt cá nhân"
        description="Quản lý tùy chọn hệ thống và bảo mật tài khoản."
      />
      
      <main className="grid gap-6 p-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Thông tin tài khoản</h3>
                <p className="text-sm text-slate-500">Tài khoản được đồng bộ từ hệ thống.</p>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Tên hiển thị</p>
                <p className="font-medium text-slate-900 mt-1">{session?.user?.name || "--"}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Email</p>
                <p className="font-medium text-slate-900 mt-1">{session?.user?.email || "--"}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Đổi mật khẩu</h3>
                <p className="text-sm text-slate-500">Cập nhật mật khẩu để bảo vệ tài khoản tốt hơn.</p>
              </div>
            </div>
            
            <div className="mt-6">
              <PasswordChangeForm />
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
