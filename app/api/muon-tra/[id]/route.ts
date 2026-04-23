import { NextRequest } from "next/server";

import { auth } from "@/lib/auth";
import { approveBorrowRequest, returnBorrowDevice } from "@/lib/muon-tra";

type ActionBody =
  | {
      action: "approve";
      approved: boolean;
      ghiChu?: string;
    }
  | {
      action: "return";
      tinhTrangTra: string;
      ghiChu?: string;
    };

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = (await request.json()) as ActionBody;

    if (body.action === "approve") {
      const result = await approveBorrowRequest(user, id, body.approved, body.ghiChu);
      return Response.json(result);
    }

    if (body.action === "return") {
      const result = await returnBorrowDevice(user, id, body.tinhTrangTra, body.ghiChu);
      return Response.json(result);
    }

    return Response.json({ error: "Action khong hop le" }, { status: 400 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Khong the cap nhat phieu muon" },
      { status: 400 },
    );
  }
}
