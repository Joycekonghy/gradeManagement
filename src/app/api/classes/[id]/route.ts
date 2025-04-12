import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'TEACHER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // First delete related studentClass records
  await prisma.studentClass.deleteMany({ where: { classId: params.id } });

  await prisma.class.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ message: 'Class deleted successfully' });
}
