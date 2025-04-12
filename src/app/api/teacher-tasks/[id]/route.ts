import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").slice(-1)[0]; // still fine if needed

  if (!id) {
    return NextResponse.json({ error: "Missing task ID" }, { status: 400 });
  }

  try {
    const data = await req.json(); // Parse the request body
    const updatedTask = await prisma.task.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, updatedTask });
  } catch (error) {
    console.error("❌ Update failed:", error);
    return NextResponse.json({ error: "Updates failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").slice(-1)[0]; // Extract the `id` from the URL

  if (!id) {
    return NextResponse.json({ error: "Missing task ID" }, { status: 400 });
  }

  try {
    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    console.error("❌ Delete failed:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}