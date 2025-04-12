import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// UPDATE a task
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { title, description, dueDate } = await req.json();
  const { id } = params;

  if (!title || !description || !dueDate) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
      },
    });

    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    console.error('❌ Update failed:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

// DELETE a task
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('❌ Delete failed:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
