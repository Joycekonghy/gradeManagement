import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ✅ RIGHT


export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").slice(-2)[0]; // Extract the `id` from the URL
  const { studentId } = await req.json();

  if (!id || !studentId) {
    return NextResponse.json({ error: "Missing class ID or student ID" }, { status: 400 });
  }

  const studentExists = await prisma.user.findUnique({
    where: { id: studentId },
  });

  if (!studentExists || studentExists.role !== "STUDENT") {
    return NextResponse.json({ error: "Student not found or invalid" }, { status: 404 });
  }

  const alreadyExists = await prisma.studentClass.findFirst({
    where: { classId: id, studentId },
  });

  if (alreadyExists) {
    return NextResponse.json({ error: "Student already added to class" }, { status: 409 });
  }

  const added = await prisma.studentClass.create({
    data: {
      classId: id,
      studentId,
    },
  });

  return NextResponse.json({ success: true, added });
}