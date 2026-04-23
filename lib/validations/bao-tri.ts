import { z } from "zod";

const optionalNumber = () =>
  z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.coerce.number().nonnegative().optional(),
  );

export const baoTriCreateSchema = z.object({
  thietBiId: z.string().min(1),
  loaiBaoTri: z.string().min(1),
  moTaVanDe: z.string().min(1),
  kyThuatVienId: z.string().optional().or(z.literal("")),
  ngayBatDau: z.string().datetime(),
  chiPhi: optionalNumber(),
});

export const baoTriUpdateSchema = z.object({
  loaiBaoTri: z.string().min(1).optional(),
  moTaVanDe: z.string().min(1).optional(),
  kyThuatVienId: z.string().optional().or(z.literal("")),
  ketQua: z.string().optional().or(z.literal("")),
  chiPhi: optionalNumber(),
  ngayHoanThanh: z.string().datetime().optional().or(z.literal("")),
});
