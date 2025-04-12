import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { title, description, studentId } = await req.json();

  // ✅ Make sure we have a teacher ID from the session
  const teacherId = session?.user?.id;

  if (!session || session.user.role !== 'TEACHER' || !teacherId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  if (!title || !description || !studentId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: new Date(),
        assignedBy: { connect: { id: teacherId } },
        assignedTo: { connect: { id: studentId } },
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("❌ Error assigning task:", error);
    return NextResponse.json({ error: 'Failed to assign task' }, { status: 500 });
  }
}
