import { z } from "zod";

export const thietBiSchema = z.object({
  maThietBi: z.string().min(1),
  tenThietBi: z.string().min(1),
  moTa: z.string().optional(),
  thongSoKyThuat: z.string().optional(),
  serialNumber: z.string().optional(),
  namNhap: z.coerce.number().int().min(2000).max(2100),
  giaTriBanDau: z.coerce.number().positive(),
  baoHanhDen: z.string().datetime().optional().or(z.literal("")),
  danhMucId: z.string().min(1),
  nhaCungCapId: z.string().optional(),
  khoaId: z.string().optional(),
  phongId: z.string().optional(),
});

export const importThietBiRowSchema = z.object({
  maThietBi: z.string().min(1),
  tenThietBi: z.string().min(1),
  namNhap: z.coerce.number().int(),
  giaTriBanDau: z.coerce.number().positive(),
  danhMucId: z.string().min(1),
});
