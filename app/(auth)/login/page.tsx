import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

import { auth, signIn } from "@/lib/auth";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  const { error } = await searchParams;
  const errorMsg =
    error === "CredentialsSignin" || error === "credentials"
      ? "Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại."
      : error === "INVALID_TOTP"
        ? "Mã xác thực 2FA không đúng hoặc đã hết hạn."
        : error
          ? "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại."
          : null;

  async function handleLogin(formData: FormData) {
    "use server";
    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        totpCode: formData.get("totpCode"),
        redirectTo: "/dashboard",
      });
    } catch (err) {
      if (err instanceof AuthError) {
        const code = err.type === "CredentialsSignin" ? "credentials" : err.type;
        redirect(`/login?error=${code}`);
      }
      throw err; // re-throw redirect errors from Next.js
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-6 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-2xl lg:grid-cols-[1fr_420px]">
        <section className="bg-[linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#0369a1_100%)] p-10 text-white">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">QLTHIETBI</p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight">
            Đăng nhập để quản lý tài sản, kho và quy trình nghiệp vụ.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
            Tài khoản demo sau khi seed:
          </p>
          <div className="mt-3 space-y-1 rounded-xl bg-white/10 p-4 font-mono text-xs text-slate-200">
            <p>admin@dhspkt.edu.vn / Admin@123456</p>
            <p>thukho@dhspkt.edu.vn / User@123456</p>
            <p>sinhvien@dhspkt.edu.vn / User@123456</p>
          </div>
        </section>

        <section className="p-8">
          <div className="max-w-sm">
            <h2 className="text-2xl font-semibold text-slate-950">Đăng nhập hệ thống</h2>

            {errorMsg ? (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMsg}
              </div>
            ) : null}

            <form className="mt-6 space-y-4" action={handleLogin}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Mật khẩu</label>
                <input
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
                <div className="flex justify-end pt-1">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-teal-600 transition-colors hover:text-teal-700"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>
              <button
                type="submit"
                className="h-11 w-full rounded-xl bg-slate-950 font-medium text-white transition-colors hover:bg-slate-800"
              >
                Đăng nhập
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
