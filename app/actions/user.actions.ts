"use server";

import bcrypt from "bcryptjs";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createUserSchema } from "@/lib/validations/user";

export async function createUser(data: unknown) {
  const session = await auth();
  const user = session?.user;

  if (!user || user.role !== "ADMIN") {
    throw new Error("Khong co quyen");
  }

  const parsed = createUserSchema.parse(data);
  const hashedPassword = await bcrypt.hash(parsed.password, 12);

  return prisma.user.create({
    data: {
      ...parsed,
      password: hashedPassword,
    },
  });
}

export async function updateUserRole(userId: string, role: string) {
  const session = await auth();
  const user = session?.user;

  if (!user || user.role !== "ADMIN") {
    throw new Error("Khong co quyen");
  }

  return prisma.user.update({
    where: { id: userId },
    data: { role: role as never },
  });
}

export async function toggleUserStatus(userId: string) {
  const session = await auth();
  const currentUser = session?.user;

  if (!currentUser || currentUser.role !== "ADMIN") {
    throw new Error("Khong co quyen");
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { isActive: true },
  });

  if (!targetUser) {
    throw new Error("Khong tim thay nguoi dung");
  }

  return prisma.user.update({
    where: { id: userId },
    data: { isActive: !targetUser.isActive },
  });
}
