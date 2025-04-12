// ✅ Corrected dynamic route handler
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params; // ✅ Destructure params correctly
  const { studentId } = await req.json();

  if (!id || !studentId) {
    return NextResponse.json({ error: "Missing class ID or student ID" }, { status: 400 });
  }

  // ✅ Check if student exists
  const studentExists = await prisma.user.findUnique({
    where: { id: studentId },
  });

  if (!studentExists || studentExists.role !== "STUDENT") {
    return NextResponse.json({ error: "Student not found or invalid" }, { status: 404 });
  }

  // ✅ Avoid duplicate entry
  const alreadyExists = await prisma.studentClass.findFirst({
    where: { classId: id, studentId },
  });

  if (alreadyExists) {
    return NextResponse.json({ error: "Student already added to class" }, { status: 409 });
  }

  // ✅ Add student to class
  const added = await prisma.studentClass.create({
    data: {
      classId: id,
      studentId,
    },
  });

  return NextResponse.json({ success: true, added });
}
