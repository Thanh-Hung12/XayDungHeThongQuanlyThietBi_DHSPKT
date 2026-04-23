import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: string;
      khoaId?: string | null;
    };
  }

  interface User {
    role: string;
    khoaId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    khoaId?: string | null;
  }
}
