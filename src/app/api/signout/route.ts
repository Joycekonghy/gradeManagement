// src/app/api/auth/signout/route.ts

import { NextResponse } from "next/server";
import { signOut } from "next-auth/react";

export async function GET() {
  await signOut({ callbackUrl: '/login' }); // Redirect to the login page after signout
  return NextResponse.redirect('/login'); // Redirect after logout
}
