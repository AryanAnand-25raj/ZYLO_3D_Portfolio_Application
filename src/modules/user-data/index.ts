import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

export interface UserProfileDto {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: UserRole;
  createdAt: Date;
}

export async function getUserById(userId: string): Promise<UserProfileDto | null> {
  return db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function getUserByEmail(email: string): Promise<UserProfileDto | null> {
  return db.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    },
  });
}
