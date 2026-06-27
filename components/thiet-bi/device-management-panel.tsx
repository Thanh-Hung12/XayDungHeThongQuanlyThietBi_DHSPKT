"use client";

import { type FormEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Upload } from "lucide-react";
import * as XLSX from "xlsx";

import { DeviceTable } from "@/components/thiet-bi/device-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { thietBiSchema } from "@/lib/validations/thiet-bi";

type Option = {
  id: string;
  label: string;
  code?: string;
};

type FormValues = {
  maThietBi: string;
  tenThietBi: string;
  moTa: string;
  thongSoKyThuat: string;
  serialNumber: string;
  namNhap: number;
  giaTriBanDau: number;
  baoHanhDen: string;
  trangThai: string;
  danhMucId: string;
  nhaCungCapId: string;
  khoaId: string;
  phongId: string;
};

type DeviceItem = {
  id: string;
  maThietBi: string;
  tenThietBi: string;
  moTa: string | null;
  thongSoKyThuat: string | null;
  serialNumber: string | null;
  namNhap: number;
  giaTriBanDau: number;
  baoHanhDen: string | null;
  trangThai: string;
  danhMucId: string;
  nhaCungCapId: string | null;
  khoaId: string | null;
  phongId: string | null;
  danhMuc: { tenDM: string };
  phong: { tenPhong: string } | null;
};

const trangThaiOptions = [
  { value: "TOT", label: "Tốt" },
  { value: "HONG", label: "Hỏng" },
  { value: "BAO_TRI", label: "Bảo trì" },
  { value: "CHO_THANH_LY", label: "Chờ thanh lý" },
];

const emptyForm: FormValues = {
  maThietBi: "",
  tenThietBi: "",
  moTa: "",
  thongSoKyThuat: "",
  serialNumber: "",
  namNhap: new Date().getFullYear(),
  giaTriBanDau: 0,
  baoHanhDen: "",
  trangThai: "TOT",
  danhMucId: "",
  nhaCungCapId: "",
  khoaId: "",
  phongId: "",
};

function toInputDate(value: string | null) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

function toFormValues(device: DeviceItem): FormValues {
  return {
    maThietBi: device.maThietBi,
    tenThietBi: device.tenThietBi,
    moTa: device.moTa ?? "",
    thongSoKyThuat: device.thongSoKyThuat ?? "",
    serialNumber: device.serialNumber ?? "",
    namNhap: device.namNhap,
    giaTriBanDau: device.giaTriBanDau,
    baoHanhDen: toInputDate(device.baoHanhDen),
    trangThai: device.trangThai,
    danhMucId: device.danhMucId,
    nhaCungCapId: device.nhaCungCapId ?? "",
    khoaId: device.khoaId ?? "",
    phongId: device.phongId ?? "",
  };
}

export function DeviceManagementPanel({
  devices,
  danhMucs,
  phongs,
  khoas,
  nhaCungCaps,
}: {
  devices: DeviceItem[];
  danhMucs: Option[];
  phongs: Option[];
  khoas: Option[];
  nhaCungCaps: Option[];
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<FormValues>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: number;
    failed: number;
    errors: { row: number; message: string }[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedDevice = useMemo(
    () => devices.find((device) => device.id === selectedId) ?? null,
    [devices, selectedId],
  );

  const heading = selectedDevice ? "Cap nhat thiet bi" : "Them thiet bi moi";
  const submitLabel = selectedDevice ? "Luu thay doi" : "Them thiet bi";

  function handleEdit(id: string) {
    const device = devices.find((item) => item.id === id);

    if (!device) {
      return;
    }

    setSelectedId(id);
    setFormValues(toFormValues(device));
    setError(null);
    setSuccess(null);
  }

  function handleCreateNew() {
    setSelectedId(null);
    setFormValues(emptyForm);
    setError(null);
    setSuccess(null);
  }

  function handleDownloadTemplate() {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      ["maThietBi", "tenThietBi", "namNhap", "giaTriBanDau", "danhMucId"],
      ["TB-001", "May chieu Epson", 2026, 15000000, danhMucs[0]?.code ?? danhMucs[0]?.label ?? ""],
      ["TB-002", "Laptop Dell Latitude 5440", 2026, 28500000, danhMucs[1]?.code ?? danhMucs[1]?.label ?? danhMucs[0]?.code ?? danhMucs[0]?.label ?? ""],
    ]);
    const guideSheet = XLSX.utils.aoa_to_sheet([
      ["HUONG DAN IMPORT"],
      ["1. He thong doc sheet dau tien de import."],
      ['2. Cot "danhMucId" co the nhap maDM, ten danh muc hoac id danh muc.'],
      ['3. Nen uu tien nhap maDM, vi du: "MAYCHIEU", "MAYTINH", "MANG".'],
      ['4. Cac cot bat buoc: maThietBi, tenThietBi, namNhap, giaTriBanDau, danhMucId.'],
      ["5. Ma thiet bi (maThietBi) khong duoc trung voi du lieu da co trong he thong."],
    ]);

    XLSX.utils.book_append_sheet(workbook, worksheet, "ThietBi");
    XLSX.utils.book_append_sheet(workbook, guideSheet, "HuongDan");

    const arrayBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([arrayBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "mau-import-thiet-bi.xlsx";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);
  }

  async function handleImportExcel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setImportResult(null);

    const formData = new FormData(event.currentTarget);
    const file = formData.get("file");

    if (!(file instanceof File)) {
      setError("Vui long chon file Excel.");
      return;
    }

    setIsImporting(true);

    try {
      const uploadData = new FormData();
      uploadData.set("file", file);

      const response = await fetch("/api/thiet-bi/import", {
        method: "POST",
        body: uploadData,
      });

      const payload = (await response.json()) as {
        error?: string;
        importedCount?: number;
        errorCount?: number;
        errors?: { row: number; message: string }[];
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Khong the import Excel");
      }

      const result = {
        success: payload.importedCount ?? 0,
        failed: payload.errorCount ?? 0,
        errors: payload.errors ?? [],
      };

      setImportResult(result);
      setSuccess(`Da import ${result.success} thiet bi.`);
      event.currentTarget.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      router.replace("/dashboard/thiet-bi");
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : "Loi khong xac dinh");
    } finally {
      setIsImporting(false);
    }
  }

  function updateField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setFormValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const parsed = thietBiSchema.parse({
        ...formValues,
        serialNumber: formValues.serialNumber || undefined,
        moTa: formValues.moTa || undefined,
        thongSoKyThuat: formValues.thongSoKyThuat || undefined,
        baoHanhDen: formValues.baoHanhDen ? new Date(formValues.baoHanhDen).toISOString() : "",
        trangThai: formValues.trangThai || undefined,
        nhaCungCapId: formValues.nhaCungCapId || undefined,
        khoaId: formValues.khoaId || undefined,
        phongId: formValues.phongId || undefined,
      });

      const response = await fetch(
        selectedDevice ? `/api/thiet-bi/${selectedDevice.id}` : "/api/thiet-bi",
        {
          method: selectedDevice ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsed),
        },
      );

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Khong the luu thiet bi");
      }

      setSuccess(selectedDevice ? "Da cap nhat thiet bi." : "Da them thiet bi moi.");
      if (!selectedDevice) {
        setFormValues(emptyForm);
      }
      setSelectedId(null);
      router.replace("/dashboard/thiet-bi");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Loi khong xac dinh");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="space-y-5 sm:space-y-6">
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-5 lg:p-6">
          <div className="flex flex-col gap-4 md:gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl space-y-2">
              <p className="text-sm font-semibold text-slate-900 sm:text-base lg:text-lg">
                Nhap lieu hang loat qua Excel
              </p>
              <p className="max-w-xl text-sm leading-6 text-slate-500 sm:text-[0.95rem]">
                Tai file .xlsx theo mau, he thong se doc cac cot Ma thiet bi, Ten thiet bi, Nam
                nhap, Gia tri va Danh muc de tao nhanh nhieu thiet bi cung luc.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:shrink-0">
              <Button
                type="button"
                variant="secondary"
                onClick={handleDownloadTemplate}
                className="w-full sm:w-auto"
              >
                <Download className="h-4 w-4" />
                Tai mau Excel
              </Button>
            </div>
          </div>

          <form
            className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
            onSubmit={handleImportExcel}
          >
            <div className="min-w-0 space-y-2">
              <label className="text-sm font-medium text-slate-700">File Excel</label>
              <Input
                ref={fileInputRef}
                type="file"
                name="file"
                accept=".xlsx,.xls"
                className="h-11 cursor-pointer px-3 py-2 text-sm sm:h-12 sm:text-base"
              />
            </div>
            <div className="md:pb-[1px]">
              <Button type="submit" disabled={isImporting} className="w-full sm:w-auto">
                <Upload className="h-4 w-4" />
                {isImporting ? "Dang import..." : "Import Excel"}
              </Button>
            </div>
          </form>

          {importResult ? (
            <div className="mt-4 rounded-2xl bg-white p-4 text-sm text-slate-700 ring-1 ring-slate-100 sm:p-5">
              <p className="font-medium text-slate-900 sm:text-base">
                Ket qua: {importResult.success} thanh cong, {importResult.failed} that bai
              </p>
              {importResult.errors.length > 0 ? (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-rose-600 sm:pl-6">
                  {importResult.errors.slice(0, 5).map((item, idx) => (
                    <li key={idx}>
                      {item.row > 0 ? `Dong ${item.row}: ` : ""}
                      {item.message}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </div>

        <DeviceTable
          data={devices}
          onView={(id) => router.push(`/dashboard/thiet-bi/${id}`)}
          onEdit={handleEdit}
        />
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">{heading}</h3>
            <p className="mt-2 text-sm text-slate-500">
              Tao moi hoac chinh sua thiet bi truc tiep tu module quan ly.
            </p>
          </div>
          {selectedDevice ? (
            <Button variant="secondary" onClick={handleCreateNew}>
              Tao moi
            </Button>
          ) : null}
        </div>

        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Ma thiet bi</label>
            <Input
              value={formValues.maThietBi}
              onChange={(event) => updateField("maThietBi", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Ten thiet bi</label>
            <Input
              value={formValues.tenThietBi}
              onChange={(event) => updateField("tenThietBi", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">So serial</label>
            <Input
              value={formValues.serialNumber}
              onChange={(event) => updateField("serialNumber", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Bao hanh den</label>
            <Input
              type="date"
              value={formValues.baoHanhDen}
              onChange={(event) => updateField("baoHanhDen", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Trang thai</label>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:shadow-sm"
              value={formValues.trangThai}
              onChange={(event) => updateField("trangThai", event.target.value)}
            >
              {trangThaiOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Nam nhap</label>
            <Input
              type="number"
              value={formValues.namNhap}
              onChange={(event) => updateField("namNhap", Number(event.target.value))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Gia tri ban dau</label>
            <Input
              type="number"
              value={formValues.giaTriBanDau}
              onChange={(event) => updateField("giaTriBanDau", Number(event.target.value))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Danh muc</label>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:shadow-sm"
              value={formValues.danhMucId}
              onChange={(event) => updateField("danhMucId", event.target.value)}
            >
              <option value="">Chon danh muc</option>
              {danhMucs.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Phong</label>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:shadow-sm"
              value={formValues.phongId}
              onChange={(event) => updateField("phongId", event.target.value)}
            >
              <option value="">Chon phong</option>
              {phongs.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Khoa</label>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:shadow-sm"
              value={formValues.khoaId}
              onChange={(event) => updateField("khoaId", event.target.value)}
            >
              <option value="">Chon khoa</option>
              {khoas.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Nha cung cap</label>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:shadow-sm"
              value={formValues.nhaCungCapId}
              onChange={(event) => updateField("nhaCungCapId", event.target.value)}
            >
              <option value="">Chon nha cung cap</option>
              {nhaCungCaps.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Mo ta</label>
            <textarea
              className="min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:shadow-sm"
              value={formValues.moTa}
              onChange={(event) => updateField("moTa", event.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Thong so ky thuat</label>
            <textarea
              className="min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:shadow-sm"
              value={formValues.thongSoKyThuat}
              onChange={(event) => updateField("thongSoKyThuat", event.target.value)}
            />
          </div>
          {/* {error ? <p className="md:col-span-2 text-sm text-rose-600">{error}</p> : null}
          {success ? <p className="md:col-span-2 text-sm text-emerald-600">{success}</p> : null} */}
          <div className="md:col-span-2">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Dang luu..." : submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
