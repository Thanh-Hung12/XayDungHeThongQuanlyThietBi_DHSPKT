import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Ten qua ngan"),
  email: z.string().email("Email khong hop le"),
  password: z.string().min(8, "Mat khau toi thieu 8 ky tu"),
  role: z.enum(["ADMIN", "TRUONG_KHOA", "GIANG_VIEN", "THU_KHO", "SINH_VIEN"]),
  khoaId: z.string().optional(),
  maSoNV: z.string().optional(),
});
