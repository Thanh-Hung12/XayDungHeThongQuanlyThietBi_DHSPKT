import { Topbar } from "@/components/layout/topbar";
import { InventoryManagementPanel } from "@/components/kiem-ke/inventory-management-panel";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function InventoryPage() {
  const roundsData = await prisma.dotKiemKe.findMany({
    include: {
      items: {
        select: {
          daXacNhan: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 12,
  });

  const currentRoundData =
    (await prisma.dotKiemKe.findFirst({
      where: { trangThai: "DANG_THUC_HIEN" },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            thietBi: {
              select: {
                id: true,
                maThietBi: true,
                tenThietBi: true,
                trangThai: true,
                phong: { select: { tenPhong: true } },
              },
            },
          },
          orderBy: { thietBi: { maThietBi: "asc" } },
        },
      },
    })) ??
    (roundsData.length > 0
      ? await prisma.dotKiemKe.findUnique({
        where: { id: roundsData[0].id },
        include: {
          items: {
            include: {
              thietBi: {
                select: {
                  id: true,
                  maThietBi: true,
                  tenThietBi: true,
                  trangThai: true,
                  phong: { select: { tenPhong: true } },
                },
              },
            },
            orderBy: { thietBi: { maThietBi: "asc" } },
          },
        },
      })
      : null);

  const inventoryRounds = roundsData.map((round) => {
    const tong = round.items.length;
    const daXacNhan = round.items.filter((item) => item.daXacNhan).length;
    const percent = tong > 0 ? (daXacNhan / tong) * 100 : 0;

    let trangThaiDisplay = round.trangThai;
    if (round.trangThai === "DANG_THUC_HIEN") trangThaiDisplay = "Đang thực hiện";
    if (round.trangThai === "HOAN_THANH") trangThaiDisplay = "Đã hoàn thành";

    return {
      id: round.id,
      tenDot: round.tenDot,
      trangThai: trangThaiDisplay,
      tong,
      daXacNhan,
      percent,
    };
  });

  const currentRound = currentRoundData
    ? {
      id: currentRoundData.id,
      tenDot: currentRoundData.tenDot,
      trangThai: currentRoundData.trangThai,
      ngayBatDau: currentRoundData.ngayBatDau.toISOString(),
      ngayKetThuc: currentRoundData.ngayKetThuc?.toISOString() ?? null,
      items: currentRoundData.items.map((item) => ({
        id: item.id,
        thietBi: {
          id: item.thietBi.id,
          maThietBi: item.thietBi.maThietBi,
          tenThietBi: item.thietBi.tenThietBi,
          trangThai: item.thietBi.trangThai,
          phong: item.thietBi.phong ? { tenPhong: item.thietBi.phong.tenPhong } : null,
        },
        trangThaiThucTe: item.trangThaiThucTe,
        ghiChu: item.ghiChu,
        daXacNhan: item.daXacNhan,
        ngayXacNhan: item.ngayXacNhan?.toISOString() ?? null,
      })),
    }
    : null;

  return (
    <>
      <Topbar
        title="Kiem ke"
        description="Khoi tao dot kiem ke, doi chieu thiet bi va xu ly chenhlech."
      />
      <main className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr]">


        <Card className="p-4 lg:col-span-2">
          <InventoryManagementPanel rounds={inventoryRounds} currentRound={currentRound} />
        </Card>
      </main>
    </>
  );
}
