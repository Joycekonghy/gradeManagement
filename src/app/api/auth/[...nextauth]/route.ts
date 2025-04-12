// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // make sure this path matches your file

const handler = NextAuth(authOptions);

// For Next.js App Router, we need to export both GET and POST
export { handler as GET, handler as POST };
