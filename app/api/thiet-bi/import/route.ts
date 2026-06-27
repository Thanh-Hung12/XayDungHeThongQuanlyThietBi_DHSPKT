import { NextRequest } from "next/server";
import * as XLSX from "xlsx";

import { recordAuditLog } from "@/lib/audit";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { importThietBiRowSchema } from "@/lib/validations/thiet-bi";

const allowedRoles = ["ADMIN", "THU_KHO"] as const;
const REQUIRED_COLUMNS = ["maThietBi", "tenThietBi", "namNhap", "giaTriBanDau", "danhMucId"] as const;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const session = await auth();
  const user = session?.user;

  if (!user || !allowedRoles.includes(user.role as (typeof allowedRoles)[number])) {
    return Response.json({ error: "Không có quyền truy cập" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "Vui lòng tải lên file Excel" }, { status: 400 });
  }

  if (!file.name.toLowerCase().endsWith(".xlsx")) {
    return Response.json({ error: "Chỉ chấp nhận file .xlsx theo mẫu quy định" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return Response.json({ error: "File vượt quá dung lượng cho phép 5MB" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: "" });

    if (rows.length === 0) {
      return Response.json({ error: "File Excel không có dữ liệu" }, { status: 400 });
    }

    // --- Normalize headers: support both Vietnamese and camelCase ---
    const HEADER_MAP: Record<string, string> = {
      mathietbi: "maThietBi",
      ten: "tenThietBi",
      tenthietbi: "tenThietBi",
      namnhap: "namNhap",
      namsudung: "namNhap",
      giatri: "giaTriBanDau",
      giatribandau: "giaTriBanDau",
      danhmuc: "danhMucId",
      danhmucid: "danhMucId",
      madm: "danhMucId",
      madanhmuc: "danhMucId",
    };

    function normalizeHeaderKey(key: string): string {
      const normalized = key
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();
      return HEADER_MAP[normalized] ?? key;
    }

    const rawHeaders = Object.keys(rows[0] ?? {});
    const headerMapping: Record<string, string> = {};
    for (const raw of rawHeaders) {
      headerMapping[raw] = normalizeHeaderKey(raw);
    }

    // Remap row keys to camelCase
    const remappedRows = rows.map((row) => {
      const remapped: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(row)) {
        remapped[headerMapping[key] ?? key] = value;
      }
      return remapped;
    });

    const headers = Object.keys(remappedRows[0] ?? {});
    const missingColumns = REQUIRED_COLUMNS.filter((column) => !headers.includes(column));
    if (missingColumns.length > 0) {
      return Response.json(
        { error: `Thiếu cột bắt buộc: ${missingColumns.join(", ")}` },
        { status: 400 },
      );
    }

    const errors: Array<{ row: number; message: string }> = [];
    const validRows: Array<{
      maThietBi: string;
      tenThietBi: string;
      namNhap: number;
      giaTriBanDau: number;
      danhMucId: string;
    }> = [];

    remappedRows.forEach((row, index) => {
      const parsed = importThietBiRowSchema.safeParse(row);
      if (!parsed.success) {
        errors.push({
          row: index + 2,
          message: parsed.error.issues.map((issue) => issue.message).join(", "),
        });
        return;
      }

      validRows.push(parsed.data);
    });

    const duplicateCodesInFile = validRows
      .map((row) => row.maThietBi)
      .filter((code, index, arr) => arr.indexOf(code) !== index);

    if (duplicateCodesInFile.length > 0) {
      duplicateCodesInFile.forEach((code) => {
        errors.push({ row: 0, message: `Trùng mã thiết bị trong file: ${code}` });
      });
    }

    const existingCodes = new Set(
      (
        await prisma.thietBi.findMany({
          where: { maThietBi: { in: validRows.map((row) => row.maThietBi) } },
          select: { maThietBi: true },
        })
      ).map((item) => item.maThietBi),
    );

    const categoryIds = new Set(
      (
        await prisma.danhMucThietBi.findMany({
          where: { id: { in: validRows.map((row) => row.danhMucId) } },
          select: { id: true },
        })
      ).map((item) => item.id),
    );

    // Also resolve categories by maDM (category code)
    const maDmEntries = validRows.filter((r) => !categoryIds.has(r.danhMucId));
    if (maDmEntries.length > 0) {
      const maDmCodes = [...new Set(maDmEntries.map((r) => r.danhMucId))];
      const foundByMaDM = await prisma.danhMucThietBi.findMany({
        where: { maDM: { in: maDmCodes } },
        select: { id: true, maDM: true },
      });
      const maDmToId = new Map(foundByMaDM.map((c) => [c.maDM, c.id]));
      for (const c of maDmCodes) {
        if (maDmToId.has(c)) categoryIds.add(maDmToId.get(c)!);
      }
      // Remap danhMucId from maDM → actual id for rows that matched
      for (const row of validRows) {
        if (maDmToId.has(row.danhMucId)) {
          row.danhMucId = maDmToId.get(row.danhMucId)!;
        }
      }
    }

    const rowsToCreate = validRows.filter((row, index) => {
      const sheetRow = index + 2;
      let isValid = true;

      if (existingCodes.has(row.maThietBi)) {
        errors.push({ row: sheetRow, message: `Mã thiết bị đã tồn tại: ${row.maThietBi}` });
        isValid = false;
      }

      if (!categoryIds.has(row.danhMucId)) {
        errors.push({ row: sheetRow, message: `Danh mục không tồn tại: ${row.danhMucId}` });
        isValid = false;
      }

      return isValid;
    });

    if (rowsToCreate.length > 0) {
      await prisma.thietBi.createMany({
        data: rowsToCreate.map((row) => ({
          ...row,
          trangThai: "TOT",
          hinhAnh: [],
        })),
      });
    }

    await recordAuditLog(prisma, {
      userId: user.id,
      action: "IMPORT_EXCEL",
      entity: "ThietBi",
      detail: `Tổng dòng hợp lệ: ${rowsToCreate.length}; Tổng lỗi: ${errors.length}`,
    });

    return Response.json({
      success: true,
      importedCount: rowsToCreate.length,
      errorCount: errors.length,
      errors,
      templateColumns: REQUIRED_COLUMNS,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Không thể import file Excel" },
      { status: 400 },
    );
  }
}
