-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'TRUONG_KHOA', 'GIANG_VIEN', 'THU_KHO', 'SINH_VIEN');

-- CreateEnum
CREATE TYPE "TrangThaiThietBi" AS ENUM ('TOT', 'HONG', 'BAO_TRI', 'THANH_LY', 'CHO_DUYET');

-- CreateEnum
CREATE TYPE "TrangThaiPhieu" AS ENUM ('CHO_DUYET', 'DA_DUYET', 'TU_CHOI', 'DANG_MUON', 'DA_TRA', 'QUA_HAN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'SINH_VIEN',
    "phone" TEXT,
    "maSoNV" TEXT,
    "khoaId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Khoa" (
    "id" TEXT NOT NULL,
    "tenKhoa" TEXT NOT NULL,
    "maKhoa" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Khoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Phong" (
    "id" TEXT NOT NULL,
    "tenPhong" TEXT NOT NULL,
    "maPhong" TEXT NOT NULL,
    "loaiPhong" TEXT NOT NULL,
    "khoaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Phong_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DanhMucThietBi" (
    "id" TEXT NOT NULL,
    "tenDM" TEXT NOT NULL,
    "maDM" TEXT NOT NULL,
    "moTa" TEXT,

    CONSTRAINT "DanhMucThietBi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NhaCungCap" (
    "id" TEXT NOT NULL,
    "tenNCC" TEXT NOT NULL,
    "diaChi" TEXT,
    "soDienThoai" TEXT,
    "email" TEXT,

    CONSTRAINT "NhaCungCap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThietBi" (
    "id" TEXT NOT NULL,
    "maThietBi" TEXT NOT NULL,
    "tenThietBi" TEXT NOT NULL,
    "moTa" TEXT,
    "thongSoKyThuat" TEXT,
    "serialNumber" TEXT,
    "namNhap" INTEGER NOT NULL,
    "giaTriBanDau" DECIMAL(65,30) NOT NULL,
    "baoHanhDen" TIMESTAMP(3),
    "trangThai" "TrangThaiThietBi" NOT NULL DEFAULT 'TOT',
    "hinhAnh" TEXT[],
    "qrCode" TEXT,
    "danhMucId" TEXT NOT NULL,
    "nhaCungCapId" TEXT,
    "khoaId" TEXT,
    "phongId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ThietBi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LichSuDiChuyen" (
    "id" TEXT NOT NULL,
    "thietBiId" TEXT NOT NULL,
    "tuPhong" TEXT,
    "denPhong" TEXT,
    "lyDo" TEXT,
    "nguoiThucHien" TEXT NOT NULL,
    "ngayDiChuyen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LichSuDiChuyen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhieuMuon" (
    "id" TEXT NOT NULL,
    "maPhieu" TEXT NOT NULL,
    "thietBiId" TEXT NOT NULL,
    "nguoiMuonId" TEXT NOT NULL,
    "mucDich" TEXT NOT NULL,
    "ngayMuon" TIMESTAMP(3) NOT NULL,
    "ngayTraDuKien" TIMESTAMP(3) NOT NULL,
    "ngayTraThucTe" TIMESTAMP(3),
    "trangThai" "TrangThaiPhieu" NOT NULL DEFAULT 'CHO_DUYET',
    "ghiChu" TEXT,
    "tinhTrangTra" TEXT,
    "phiQhanHan" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhieuMuon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BaoTri" (
    "id" TEXT NOT NULL,
    "thietBiId" TEXT NOT NULL,
    "loaiBaoTri" TEXT NOT NULL,
    "moTaVanDe" TEXT NOT NULL,
    "ketQua" TEXT,
    "chiPhi" DECIMAL(65,30),
    "kyThuatVienId" TEXT,
    "ngayBatDau" TIMESTAMP(3) NOT NULL,
    "ngayHoanThanh" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BaoTri_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DotKiemKe" (
    "id" TEXT NOT NULL,
    "tenDot" TEXT NOT NULL,
    "ngayBatDau" TIMESTAMP(3) NOT NULL,
    "ngayKetThuc" TIMESTAMP(3),
    "trangThai" TEXT NOT NULL DEFAULT 'DANG_THUC_HIEN',
    "nguoiTao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DotKiemKe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KiemKeItem" (
    "id" TEXT NOT NULL,
    "dotKiemKeId" TEXT NOT NULL,
    "thietBiId" TEXT NOT NULL,
    "trangThaiThucTe" TEXT,
    "ghiChu" TEXT,
    "daXacNhan" BOOLEAN NOT NULL DEFAULT false,
    "ngayXacNhan" TIMESTAMP(3),

    CONSTRAINT "KiemKeItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "detail" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionToken")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "Authenticator" (
    "credentialID" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "credentialPublicKey" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "transports" TEXT,

    CONSTRAINT "Authenticator_pkey" PRIMARY KEY ("userId","credentialID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_maSoNV_key" ON "User"("maSoNV");

-- CreateIndex
CREATE UNIQUE INDEX "Khoa_maKhoa_key" ON "Khoa"("maKhoa");

-- CreateIndex
CREATE UNIQUE INDEX "Phong_maPhong_key" ON "Phong"("maPhong");

-- CreateIndex
CREATE UNIQUE INDEX "DanhMucThietBi_maDM_key" ON "DanhMucThietBi"("maDM");

-- CreateIndex
CREATE UNIQUE INDEX "ThietBi_maThietBi_key" ON "ThietBi"("maThietBi");

-- CreateIndex
CREATE UNIQUE INDEX "ThietBi_serialNumber_key" ON "ThietBi"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PhieuMuon_maPhieu_key" ON "PhieuMuon"("maPhieu");

-- CreateIndex
CREATE UNIQUE INDEX "KiemKeItem_dotKiemKeId_thietBiId_key" ON "KiemKeItem"("dotKiemKeId", "thietBiId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Authenticator_credentialID_key" ON "Authenticator"("credentialID");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_khoaId_fkey" FOREIGN KEY ("khoaId") REFERENCES "Khoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Phong" ADD CONSTRAINT "Phong_khoaId_fkey" FOREIGN KEY ("khoaId") REFERENCES "Khoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThietBi" ADD CONSTRAINT "ThietBi_danhMucId_fkey" FOREIGN KEY ("danhMucId") REFERENCES "DanhMucThietBi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThietBi" ADD CONSTRAINT "ThietBi_nhaCungCapId_fkey" FOREIGN KEY ("nhaCungCapId") REFERENCES "NhaCungCap"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThietBi" ADD CONSTRAINT "ThietBi_khoaId_fkey" FOREIGN KEY ("khoaId") REFERENCES "Khoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThietBi" ADD CONSTRAINT "ThietBi_phongId_fkey" FOREIGN KEY ("phongId") REFERENCES "Phong"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LichSuDiChuyen" ADD CONSTRAINT "LichSuDiChuyen_thietBiId_fkey" FOREIGN KEY ("thietBiId") REFERENCES "ThietBi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhieuMuon" ADD CONSTRAINT "PhieuMuon_thietBiId_fkey" FOREIGN KEY ("thietBiId") REFERENCES "ThietBi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhieuMuon" ADD CONSTRAINT "PhieuMuon_nguoiMuonId_fkey" FOREIGN KEY ("nguoiMuonId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BaoTri" ADD CONSTRAINT "BaoTri_thietBiId_fkey" FOREIGN KEY ("thietBiId") REFERENCES "ThietBi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BaoTri" ADD CONSTRAINT "BaoTri_kyThuatVienId_fkey" FOREIGN KEY ("kyThuatVienId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KiemKeItem" ADD CONSTRAINT "KiemKeItem_dotKiemKeId_fkey" FOREIGN KEY ("dotKiemKeId") REFERENCES "DotKiemKe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KiemKeItem" ADD CONSTRAINT "KiemKeItem_thietBiId_fkey" FOREIGN KEY ("thietBiId") REFERENCES "ThietBi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authenticator" ADD CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
