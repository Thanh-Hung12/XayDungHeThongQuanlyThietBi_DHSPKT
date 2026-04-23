import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

const roleRoutes: Record<string, string[]> = {
  "/dashboard/quan-tri": ["ADMIN"],
  "/dashboard/bao-cao": ["ADMIN", "TRUONG_KHOA"],
  "/dashboard/kiem-ke": ["ADMIN", "THU_KHO"],
  "/dashboard/thiet-bi": ["ADMIN", "TRUONG_KHOA", "THU_KHO", "GIANG_VIEN"],
  "/dashboard/muon-tra": ["ADMIN", "TRUONG_KHOA", "THU_KHO", "GIANG_VIEN", "SINH_VIEN"],
};

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const session = request.auth;

  if (!session && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  for (const [route, roles] of Object.entries(roleRoutes)) {
    if (pathname.startsWith(route) && !roles.includes(session?.user?.role ?? "")) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/api/((?!auth).*)"],
};
