import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    select: { id: true, email: true, name: true },
  });

  return NextResponse.json({ students });
}
