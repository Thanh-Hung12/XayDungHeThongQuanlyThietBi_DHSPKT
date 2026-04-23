import type { Role, TrangThaiPhieu, TrangThaiThietBi } from "@prisma/client";

import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { muonSchema } from "@/lib/validations/muon-tra";

type SessionUser = {
  id: string;
  role: string;
  khoaId?: string | null;
};

type BorrowFilters = {
  search?: string;
  trangThai?: string;
};

const ACTIVE_BORROW_STATUSES: TrangThaiPhieu[] = ["CHO_DUYET", "DA_DUYET", "DANG_MUON", "QUA_HAN"];
const MANAGER_ROLES: Role[] = ["ADMIN", "THU_KHO"];

function canManageBorrow(user: SessionUser) {
  return MANAGER_ROLES.includes(user.role as Role);
}

function ensureAuthenticated(user: SessionUser | null | undefined): asserts user is SessionUser {
  if (!user) {
    throw new Error("Chua dang nhap");
  }
}

function ensureManager(user: SessionUser | null | undefined): asserts user is SessionUser {
  ensureAuthenticated(user);

  if (!canManageBorrow(user)) {
    throw new Error("Khong co quyen thuc hien thao tac nay");
  }
}

function validateBorrowDates(ngayMuon: Date, ngayTraDuKien: Date) {
  if (ngayTraDuKien <= ngayMuon) {
    throw new Error("Han tra phai sau ngay muon");
  }
}

export async function getBorrowDashboardData(user: SessionUser | null | undefined) {
  ensureAuthenticated(user);

  const where: Record<string, unknown> = canManageBorrow(user) ? {} : { nguoiMuonId: user.id };

  const [borrowRequests, availableDevices] = await Promise.all([
    prisma.phieuMuon.findMany({
      where,
      include: {
        nguoiMuon: true,
        thietBi: {
          include: {
            phong: true,
            khoa: true,
          },
        },
      },
      orderBy: [{ updatedAt: "desc" }, { ngayMuon: "desc" }],
    }),
    prisma.thietBi.findMany({
      where: {
        trangThai: "TOT",
        ...(user.khoaId ? { khoaId: user.khoaId } : {}),
        phieuMuon: {
          none: {
            trangThai: {
              in: ACTIVE_BORROW_STATUSES,
            },
          },
        },
      },
      include: {
        phong: true,
        khoa: true,
      },
      orderBy: [{ tenThietBi: "asc" }],
    }),
  ]);

  return {
    borrowRequests,
    availableDevices,
    canManage: canManageBorrow(user),
  };
}

export async function listBorrowRequests(
  user: SessionUser | null | undefined,
  filters: BorrowFilters = {},
) {
  ensureAuthenticated(user);

  const where: Record<string, unknown> = canManageBorrow(user) ? {} : { nguoiMuonId: user.id };

  if (filters.trangThai) {
    where.trangThai = filters.trangThai;
  }

  if (filters.search) {
    where.OR = [
      { maPhieu: { contains: filters.search, mode: "insensitive" } },
      { mucDich: { contains: filters.search, mode: "insensitive" } },
      { nguoiMuon: { name: { contains: filters.search, mode: "insensitive" } } },
      { thietBi: { tenThietBi: { contains: filters.search, mode: "insensitive" } } },
    ];
  }

  return prisma.phieuMuon.findMany({
    where,
    include: {
      nguoiMuon: true,
      thietBi: {
        include: {
          phong: true,
          khoa: true,
        },
      },
    },
    orderBy: [{ updatedAt: "desc" }, { ngayMuon: "desc" }],
  });
}

export async function createBorrowRequest(user: SessionUser | null | undefined, data: unknown) {
  ensureAuthenticated(user);

  const parsed = muonSchema.parse(data);
  const ngayMuon = new Date(parsed.ngayMuon);
  const ngayTraDuKien = new Date(parsed.ngayTraDuKien);

  validateBorrowDates(ngayMuon, ngayTraDuKien);

  const thietBi = await prisma.thietBi.findUnique({
    where: { id: parsed.thietBiId },
  });

  if (!thietBi || thietBi.trangThai !== "TOT") {
    throw new Error("Thiet bi khong kha dung de muon");
  }

  if (user.khoaId && thietBi.khoaId && thietBi.khoaId !== user.khoaId) {
    throw new Error("Ban khong duoc muon thiet bi ngoai khoa");
  }

  const dangMuon = await prisma.phieuMuon.findFirst({
    where: {
      thietBiId: parsed.thietBiId,
      trangThai: { in: ACTIVE_BORROW_STATUSES },
    },
  });

  if (dangMuon) {
    throw new Error("Thiet bi dang co phieu muon hoat dong");
  }

  const phieu = await prisma.phieuMuon.create({
    data: {
      thietBiId: parsed.thietBiId,
      nguoiMuonId: user.id,
      mucDich: parsed.mucDich,
      ngayMuon,
      ngayTraDuKien,
      trangThai: "CHO_DUYET",
    },
    include: {
      nguoiMuon: true,
      thietBi: true,
    },
  });

  const admins = await prisma.user.findMany({
    where: {
      role: { in: MANAGER_ROLES },
      isActive: true,
    },
  });

  await Promise.all(
    admins.map((admin) =>
      sendEmail({
        to: admin.email,
        subject: "[QLTHIETBI] Yeu cau muon thiet bi moi",
        body: `${phieu.nguoiMuon.name} yeu cau muon "${phieu.thietBi.tenThietBi}".`,
      }),
    ),
  );

  return phieu;
}

export async function approveBorrowRequest(
  user: SessionUser | null | undefined,
  phieuId: string,
  approved: boolean,
  ghiChu?: string,
) {
  ensureManager(user);

  const phieu = await prisma.phieuMuon.findUnique({
    where: { id: phieuId },
    include: {
      nguoiMuon: true,
      thietBi: true,
    },
  });

  if (!phieu) {
    throw new Error("Khong tim thay phieu muon");
  }

  if (phieu.trangThai !== "CHO_DUYET") {
    throw new Error("Chi co the duyet phieu dang cho duyet");
  }

  if (approved) {
    if (phieu.thietBi.trangThai !== "TOT") {
      throw new Error("Thiet bi khong o trang thai kha dung");
    }

    const conflictingRequest = await prisma.phieuMuon.findFirst({
      where: {
        id: { not: phieuId },
        thietBiId: phieu.thietBiId,
        trangThai: { in: ["DANG_MUON", "QUA_HAN", "DA_DUYET"] },
      },
      select: { id: true },
    });

    if (conflictingRequest) {
      throw new Error("Thiet bi dang duoc giu boi mot phieu khac");
    }
  }

  const updated = await prisma.phieuMuon.update({
    where: { id: phieuId },
    data: {
      trangThai: approved ? "DANG_MUON" : "TU_CHOI",
      ghiChu,
    },
    include: {
      nguoiMuon: true,
      thietBi: true,
    },
  });

  await sendEmail({
    to: updated.nguoiMuon.email,
    subject: `[QLTHIETBI] Phieu muon ${approved ? "da duoc duyet" : "bi tu choi"}`,
    body: approved
      ? `Yeu cau muon "${updated.thietBi.tenThietBi}" da duoc duyet.`
      : `Yeu cau muon "${updated.thietBi.tenThietBi}" bi tu choi. Ly do: ${ghiChu ?? "--"}`,
  });

  return updated;
}

export async function returnBorrowDevice(
  user: SessionUser | null | undefined,
  phieuId: string,
  tinhTrangTra: string,
  ghiChu?: string,
) {
  ensureManager(user);

  const phieu = await prisma.phieuMuon.findUnique({
    where: { id: phieuId },
    include: {
      thietBi: true,
    },
  });

  if (!phieu) {
    throw new Error("Khong tim thay phieu muon");
  }

  if (!["DANG_MUON", "QUA_HAN"].includes(phieu.trangThai)) {
    throw new Error("Chi co the xac nhan tra voi phieu dang muon hoac qua han");
  }

  const now = new Date();
  const isOverdue = now > phieu.ngayTraDuKien;
  const overdueDays = isOverdue
    ? Math.ceil((now.getTime() - phieu.ngayTraDuKien.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const phiPhat = overdueDays * 50000;
  const trangThaiThietBi: TrangThaiThietBi = tinhTrangTra === "HONG" ? "HONG" : "TOT";

  const [updated] = await prisma.$transaction([
    prisma.phieuMuon.update({
      where: { id: phieuId },
      data: {
        trangThai: "DA_TRA",
        ngayTraThucTe: now,
        tinhTrangTra,
        phiQhanHan: phiPhat,
        ghiChu,
      },
      include: {
        nguoiMuon: true,
        thietBi: true,
      },
    }),
    prisma.thietBi.update({
      where: { id: phieu.thietBiId },
      data: {
        trangThai: trangThaiThietBi,
      },
    }),
  ]);

  return updated;
}
