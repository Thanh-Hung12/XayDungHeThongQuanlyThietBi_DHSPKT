"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/utils";

type BorrowRequestItem = {
  id: string;
  maPhieu: string;
  mucDich: string;
  ngayMuon: string;
  ngayTraDuKien: string;
  ngayTraThucTe: string | null;
  trangThai: string;
  ghiChu: string | null;
  phiQhanHan: number | null;
  tinhTrangTra: string | null;
  nguoiMuon: {
    name: string;
    email: string;
  };
  thietBi: {
    tenThietBi: string;
    maThietBi: string;
    phong: {
      tenPhong: string;
    } | null;
    khoa: {
      tenKhoa: string;
    } | null;
  };
};

type AvailableDevice = {
  id: string;
  tenThietBi: string;
  maThietBi: string;
  phong: {
    tenPhong: string;
  } | null;
  khoa: {
    tenKhoa: string;
  } | null;
};

type SummaryCard = {
  title: string;
  value: string;
  note: string;
};

const emptyCreateForm = {
  thietBiId: "",
  mucDich: "",
  ngayMuon: "",
  ngayTraDuKien: "",
};

export function BorrowManagementPanel({
  borrowRequests,
  availableDevices,
  canManage,
  summary,
}: {
  borrowRequests: BorrowRequestItem[];
  availableDevices: AvailableDevice[];
  canManage: boolean;
  summary: SummaryCard[];
}) {
  const router = useRouter();
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const pendingCount = useMemo(
    () => borrowRequests.filter((item) => item.trangThai === "CHO_DUYET").length,
    [borrowRequests],
  );

  function updateCreateField<K extends keyof typeof emptyCreateForm>(
    key: K,
    value: (typeof emptyCreateForm)[K],
  ) {
    setCreateForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function refreshPage(message: string) {
    setSuccess(message);
    setError(null);
    startTransition(() => {
      router.refresh();
    });
  }

  async function handleCreateBorrow(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/muon-tra", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...createForm,
          ngayMuon: new Date(createForm.ngayMuon).toISOString(),
          ngayTraDuKien: new Date(createForm.ngayTraDuKien).toISOString(),
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Khong the tao phieu muon");
      }

      setCreateForm(emptyCreateForm);
      refreshPage("Da tao phieu muon moi.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Loi khong xac dinh");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleApprove(phieuId: string, approved: boolean) {
    setBusyId(phieuId);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/muon-tra/${phieuId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "approve",
          approved,
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Khong the cap nhat phieu muon");
      }

      refreshPage(approved ? "Da duyet phieu muon." : "Da tu choi phieu muon.");
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Loi khong xac dinh");
    } finally {
      setBusyId(null);
    }
  }

  async function handleReturn(phieuId: string, tinhTrangTra: "TOT" | "HONG") {
    setBusyId(phieuId);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/muon-tra/${phieuId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "return",
          tinhTrangTra,
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Khong the xac nhan tra thiet bi");
      }

      refreshPage(
        tinhTrangTra === "HONG"
          ? "Da xac nhan tra va danh dau thiet bi hong."
          : "Da xac nhan tra thiet bi.",
      );
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Loi khong xac dinh");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{item.title}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{item.value}</p>
            <p className="mt-2 text-sm text-slate-500">{item.note}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 ">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Danh sach phieu muon</h3>
              <p className="mt-1 text-sm text-slate-500">
                {canManage
                  ? `Dang theo doi ${borrowRequests.length} phieu, ${pendingCount} phieu cho duyet.`
                  : `Ban dang co ${borrowRequests.length} phieu muon trong he thong.`}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Phieu</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Nguoi muon</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Thiet bi</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Ngay</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Trang thai</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Xu ly</th>
                </tr>
              </thead>
              <tbody>
                {borrowRequests.map((item) => {
                  const isBusy = busyId === item.id;
                  const canApprove = canManage && item.trangThai === "CHO_DUYET";
                  const canReturn = canManage && ["DANG_MUON", "QUA_HAN"].includes(item.trangThai);

                  return (
                    <tr key={item.id} className="border-t border-slate-100 align-top">
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-900">{item.maPhieu}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.mucDich}</p>
                        {item.ghiChu ? <p className="mt-1 text-xs text-slate-500">{item.ghiChu}</p> : null}
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-900">{item.nguoiMuon.name}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.nguoiMuon.email}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-900">{item.thietBi.tenThietBi}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.thietBi.maThietBi}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.thietBi.phong?.tenPhong ?? "Chua gan phong"}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        <p>Muon: {formatDate(item.ngayMuon)}</p>
                        <p className="mt-1">Han tra: {formatDate(item.ngayTraDuKien)}</p>
                        <p className="mt-1">
                          Tra thuc te: {item.ngayTraThucTe ? formatDate(item.ngayTraThucTe) : "--"}
                        </p>
                        {item.phiQhanHan ? (
                          <p className="mt-1 text-rose-600">Phat: {formatCurrency(item.phiQhanHan)}</p>
                        ) : null}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={item.trangThai} />
                        {item.tinhTrangTra ? (
                          <p className="mt-2 text-xs text-slate-500">Tinh trang tra: {item.tinhTrangTra}</p>
                        ) : null}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          {canApprove ? (
                            <>
                              <Button
                                size="sm"
                                disabled={isBusy}
                                onClick={() => void handleApprove(item.id, true)}
                              >
                                Duyet
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                disabled={isBusy}
                                onClick={() => void handleApprove(item.id, false)}
                              >
                                Tu choi
                              </Button>
                            </>
                          ) : null}
                          {canReturn ? (
                            <>
                              <Button
                                size="sm"
                                variant="secondary"
                                disabled={isBusy}
                                onClick={() => void handleReturn(item.id, "TOT")}
                              >
                                Xac nhan tra
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                disabled={isBusy}
                                onClick={() => void handleReturn(item.id, "HONG")}
                              >
                                Trả hỏng
                              </Button>
                            </>
                          ) : null}
                          {!canApprove && !canReturn ? (
                            <span className="text-xs text-slate-400">Khong co thao tac</span>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {borrowRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                      Chua co phieu muon nao.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Tao phieu muon</h3>
              <p className="mt-2 text-sm text-slate-500">
                Gui yeu cau muon thiet bi va theo doi phe duyet ngay trong module nay.
              </p>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {availableDevices.length} thiet bi san sang
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleCreateBorrow}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Thiet bi</label>
              <select
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900"
                value={createForm.thietBiId}
                onChange={(event) => updateCreateField("thietBiId", event.target.value)}
              >
                <option value="">Chon thiet bi</option>
                {availableDevices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.maThietBi} - {device.tenThietBi}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Muc dich su dung</label>
              <textarea
                className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none"
                value={createForm.mucDich}
                onChange={(event) => updateCreateField("mucDich", event.target.value)}
                placeholder="Nhap ly do muon, lop hoc hoac cong viec can su dung thiet bi"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Ngay muon</label>
                <Input
                  type="date"
                  value={createForm.ngayMuon}
                  onChange={(event) => updateCreateField("ngayMuon", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Han tra</label>
                <Input
                  type="date"
                  value={createForm.ngayTraDuKien}
                  onChange={(event) => updateCreateField("ngayTraDuKien", event.target.value)}
                />
              </div>
            </div>

            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

            <Button type="submit" disabled={isSubmitting || availableDevices.length === 0}>
              {isSubmitting ? "Dang gui..." : "Tao phieu muon"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
