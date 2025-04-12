'use client';

import { useState } from "react";
import Link from "next/link";

type HeaderProps = {
  session: {
    user: {
      role: string;
    };
  } | null;
  children?: React.ReactNode; // Pass page content from layout or wrapper
};

export default function Header({ session, children }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!session) return null;

  const isTeacher = session.user.role === "TEACHER";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`
          h-screen bg-gray-900 text-white p-4 pt-8 space-y-4 transition-all duration-300
          ${isOpen ? 'w-64' : 'w-16'}
        `}
      >
        {/* Collapse toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700 w-full"
        >
          {isOpen ? '←' : '→'}
        </button>

        <div className="space-y-2 mt-4">
          {isTeacher ? (
            <>
              <SidebarLink href="/dashboard/teacher" icon="🏠" label="Dashboard" isOpen={isOpen} />
              <SidebarLink href="/dashboard/teacher/classes" icon="📚" label="Classes" isOpen={isOpen} />
            </>
          ) : (
            <SidebarLink href="/dashboard/student" icon="🏠" label="Student Dashboard" isOpen={isOpen} />
          )}
          <SidebarLink href="/profile" icon="👤" label="Profile" isOpen={isOpen} />
          <SidebarLink href="/api/auth/signout" icon="🚪" label="Logout" isOpen={isOpen} />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-black overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  isOpen,
}: {
  href: string;
  icon: string;
  label: string;
  isOpen: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded transition-colors"
    >
      <span>{icon}</span>
      {isOpen && <span>{label}</span>}
    </Link>
  );
}
