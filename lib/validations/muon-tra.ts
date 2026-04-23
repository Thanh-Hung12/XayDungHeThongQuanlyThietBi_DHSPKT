import { z } from "zod";

export const muonSchema = z.object({
  thietBiId: z.string().min(1, { message: "Vui lòng chọn thiết bị." }),
  mucDich: z.string().min(5, { message: "Mục đích phải dài ít nhất 5 ký tự." }),
  ngayMuon: z.string().datetime({ message: "Ngày mượn không hợp lệ." }),
  ngayTraDuKien: z.string().datetime({ message: "Ngày trả không hợp lệ." }),
});
