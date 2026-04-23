import { NextRequest } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { thietBiSchema } from "@/lib/validations/thiet-bi";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const user = session?.user;

  if (!user || !["ADMIN", "THU_KHO"].includes(user.role)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = thietBiSchema.parse(body);

  const existing = await prisma.thietBi.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return Response.json({ error: "Khong tim thay thiet bi" }, { status: 404 });
  }

  const updated = await prisma.thietBi.update({
    where: { id },
    data: {
      ...parsed,
      baoHanhDen: parsed.baoHanhDen ? new Date(parsed.baoHanhDen) : null,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "UPDATE",
      entity: "ThietBi",
      entityId: updated.id,
    },
  });

  return Response.json(updated);
}
