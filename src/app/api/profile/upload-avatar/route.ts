import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("avatar") as File;

  if (!file || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = file.name.split(".").pop();
  const filename = `${uuid()}.${extension}`;
  const avatarPath = path.join(process.cwd(), "public", "avatars", filename);

  await writeFile(avatarPath, buffer);

  const imageUrl = `/avatars/${filename}`;

  await prisma.user.update({
    where: { email: session.user.email },
    data: { image: imageUrl },
  });

  return NextResponse.json({ image: imageUrl });
}
