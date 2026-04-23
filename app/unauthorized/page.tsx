import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="max-w-md rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-600">
          Unauthorized
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-950">Ban khong co quyen truy cap</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Tai khoan hien tai khong duoc phep mo module nay. Kiem tra lai role hoac dang nhap bang
          tai khoan khac.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white"
        >
          Quay ve dashboard
        </Link>
      </div>
    </main>
  );
}
