import { notFound } from "next/navigation";
import Image from "next/image";
import QRCode from "qrcode";

import { StatusBadge } from "@/components/shared/status-badge";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function DeviceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const device = await prisma.thietBi.findUnique({
    where: { id },
    include: {
      danhMuc: true,
      phong: true,
    },
  });

  if (!device) {
    notFound();
  }

  const qrCodeDataUrl = device.qrCode || await QRCode.toDataURL(
    `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/dashboard/thiet-bi/${device.id}`
  );

  return (
    <>
      <Topbar
        title={device.tenThietBi}
        description="Thong tin chi tiet, trang thai hien tai va du lieu de phuc vu QR lookup."
      />
      <main className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{device.maThietBi}</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">{device.tenThietBi}</h3>
            </div>
            <StatusBadge status={device.trangThai} />
          </div>
          <dl className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <dt className="text-sm text-slate-500">Serial</dt>
              <dd className="mt-1 font-medium text-slate-900">{device.serialNumber}</dd>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <dt className="text-sm text-slate-500">Gia tri</dt>
              <dd className="mt-1 font-medium text-slate-900">{formatCurrency(Number(device.giaTriBanDau))}</dd>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <dt className="text-sm text-slate-500">Danh muc</dt>
              <dd className="mt-1 font-medium text-slate-900">{device.danhMuc?.tenDM || "Không rõ danh mục"}</dd>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <dt className="text-sm text-slate-500">Phong</dt>
              <dd className="mt-1 font-medium text-slate-900">{device.phong?.tenPhong || "Chưa xếp phòng"}</dd>
            </div>
          </dl>
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-4">
            <p className="text-sm text-slate-500">Mo ta</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">{device.moTa}</p>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-950">QR Lookup / Lich su</h3>
          <p className="mt-2 text-sm text-slate-500">
            Route chi tiet nay la dich den ma QR duoc sinh o API `POST /api/thiet-bi`.
          </p>
          <div className="mt-6 rounded-[28px] bg-slate-950 p-8 text-center text-white">
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300">MA QR TRUY XUAT</p>
            <div className="mt-5 inline-flex h-44 w-44 items-center justify-center rounded-3xl bg-white p-2 text-slate-950">
              <Image
                src={qrCodeDataUrl}
                alt={`QR Code ${device.maThietBi}`}
                width={176}
                height={176}
                unoptimized
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </Card>
      </main>
    </>
  );
}
