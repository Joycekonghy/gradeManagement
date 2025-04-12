"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  // 🚫 Block logged-in users from accessing the login page
  useEffect(() => {
    if (status === "loading") return;

    const role = session?.user?.role;
    if (role === "TEACHER" || role === "STUDENT") {
      router.push("/api/auth/signout");
    }
  }, [session, status, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      // Refetch session
      const updated = await fetch("/api/auth/session").then((res) => res.json());
      const role = updated?.user?.role;

      if (role === "TEACHER") {
        router.push("/dashboard/teacher");
      } else if (role === "STUDENT") {
        router.push("/dashboard/student");
      } else {
        router.push("/dashboard"); // Fallback
      }
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto mt-20 p-4 space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        className="border p-2 w-full"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        className="border p-2 w-full"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Log In
      </button>
    </form>
  );
}
