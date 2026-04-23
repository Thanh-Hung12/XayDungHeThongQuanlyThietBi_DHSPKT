import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <main className="grid min-h-screen place-items-center px-6 py-12 bg-slate-50/50">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 mb-5 shadow-sm ring-1 ring-teal-100/50">
            <KeyRound className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Khôi phục mật khẩu</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Nhập địa chỉ email liên kết với tài khoản của bạn, hệ thống sẽ gửi một liên kết bảo mật để đặt lại mật khẩu an toàn.
          </p>
        </div>

        <form 
          className="mt-8 space-y-5" 
          action={async (formData) => {
            "use server";
            // TODO: Implement server action for password reset email sending
            console.log("Send password reset link to: ", formData.get("email"));
          }}
        >
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Email xác thực</label>
            <input
              name="email"
              type="email"
              required
              placeholder="VD: admin@hcmute.edu.vn"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:shadow-sm"
            />
          </div>
          
          <button 
            type="submit" 
            className="flex h-11 w-full items-center justify-center rounded-xl bg-teal-600 font-medium tracking-wide text-white shadow-sm transition-all duration-200 active:scale-[0.98] hover:bg-teal-700 hover:shadow-md"
          >
            Gửi liên kết khôi phục
          </button>
        </form>

        <div className="mt-8 flex justify-center border-t border-slate-100 pt-6">
          <Link 
            href="/login" 
            className="group flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-teal-600"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Quay lại trang đăng nhập
          </Link>
        </div>
      </div>
    </main>
  );
}
