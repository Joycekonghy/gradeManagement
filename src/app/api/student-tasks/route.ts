import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const tasks = await prisma.task.findMany({
    where: {
      assignedToId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json({ tasks });
}
