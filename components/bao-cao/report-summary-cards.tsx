"use client";

import { useEffect, useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type SummaryPayload = {
  khoaCount: number;
  totalDevices: number;
  goodDevices: number;
  percentGood: number;
  chiPhi: number;
  range: { from: string | null; to: string | null };
};

export function ReportSummaryCards() {
  const [data, setData] = useState<SummaryPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/bao-cao/summary", { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json()) as SummaryPayload & { error?: string };
        if (!response.ok) {
          throw new Error(payload.error ?? "Khong the lay bao cao");
        }

        if (!cancelled) {
          setData(payload);
        }
      })
      .catch((fetchError) => {
        if (!cancelled) {
          setError(fetchError instanceof Error ? fetchError.message : "Loi khong xac dinh");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const reports = useMemo(() => {
    const khoaCount = data?.khoaCount ?? 0;
    const percentGood = data?.percentGood ?? 0;
    const chiPhi = data?.chiPhi ?? 0;

    return [
      { title: "Theo khoa", value: `${khoaCount} khoa dang su dung thiet bi` },
      { title: "Theo trang thai", value: `${percentGood}% thiet bi hoat dong tot` },
      { title: "Chi phi bao tri", value: `${formatCurrency(chiPhi)} / he thong` },
    ];
  }, [data]);

  if (loading) {
    return (
      <main className="grid gap-6 p-6 md:grid-cols-3">
        {["Theo khoa", "Theo trang thai", "Chi phi bao tri"].map((title) => (
          <Card key={title} className="p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{title}</p>
            <div className="mt-4 h-6 w-3/4 rounded-lg bg-slate-100" />
          </Card>
        ))}
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <Card className="p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Bao cao</p>
          <p className="mt-4 text-sm text-rose-600">{error}</p>
        </Card>
      </main>
    );
  }

  return (
    <main className="grid gap-6 p-6 md:grid-cols-3">
      {reports.map((item) => (
        <Card key={item.title} className="p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{item.title}</p>
          <p className="mt-4 text-xl font-semibold text-slate-950">{item.value}</p>
        </Card>
      ))}
    </main>
  );
}
