import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").slice(-1)[0]; // Extract the `id` from the URL

  if (!id) {
    return NextResponse.json({ error: "Missing class ID" }, { status: 400 });
  }

  try {
    const deletedClass = await prisma.class.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, deletedClass });
  } catch (error) {
    console.error("DELETE /class failed:", error);
    return NextResponse.json(
      { error: "Class not found or could not be deleted" },
      { status: 404 }
    );
  }
  
}