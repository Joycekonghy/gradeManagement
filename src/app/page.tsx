import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions); // Get session server-side

  if (!session) {
    return redirect("/login"); // If no session, redirect to login
  }

  // Redirect based on role
  if (session.user.role === "TEACHER") {
    return redirect("/dashboard/teacher");
  } 
  if (session.user.role === "STUDENT") {
    return redirect("/dashboard/student");
  }
}
