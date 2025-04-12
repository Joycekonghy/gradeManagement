import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'TEACHER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ error: 'Class name is required' }, { status: 400 });
  }

  const existing = await prisma.class.findFirst({
    where: { name, teacherId: session.user.id },
  });

  if (existing) {
    return NextResponse.json({ error: 'Class with this name already exists' }, { status: 409 });
  }

  const newClass = await prisma.class.create({
    data: {
      name,
      teacherId: session.user.id,
    },
  });

  return NextResponse.json({ class: newClass }, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'TEACHER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const classes = await prisma.class.findMany({
    where: { teacherId: session.user.id },
    include: {
      students: {
        include: {
          student: {
            select: { name: true, email: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ classes });
}
