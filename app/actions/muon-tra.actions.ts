"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { approveBorrowRequest, createBorrowRequest, returnBorrowDevice } from "@/lib/muon-tra";

const BORROW_PAGE_PATH = "/dashboard/muon-tra";

export async function taoPhieuMuon(data: unknown) {
  const session = await auth();
  const phieu = await createBorrowRequest(session?.user, data);

  revalidatePath(BORROW_PAGE_PATH);
  return phieu;
}

export async function duyetPhieuMuon(phieuId: string, approved: boolean, ghiChu?: string) {
  const session = await auth();
  const phieu = await approveBorrowRequest(session?.user, phieuId, approved, ghiChu);

  revalidatePath(BORROW_PAGE_PATH);
  return phieu;
}

export async function traThietBi(phieuId: string, tinhTrangTra: string, ghiChu?: string) {
  const session = await auth();
  const phieu = await returnBorrowDevice(session?.user, phieuId, tinhTrangTra, ghiChu);

  revalidatePath(BORROW_PAGE_PATH);
  return phieu;
}
