import { NextRequest } from "next/server";

import { auth } from "@/lib/auth";
import { createBorrowRequest, listBorrowRequests } from "@/lib/muon-tra";

export async function GET(request: NextRequest) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const data = await listBorrowRequests(user, {
    search: searchParams.get("search") ?? undefined,
    trangThai: searchParams.get("trangThai") ?? undefined,
  });

  return Response.json({ data });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const phieu = await createBorrowRequest(user, body);

    return Response.json(phieu, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Khong the tao phieu muon" },
      { status: 400 },
    );
  }
}
