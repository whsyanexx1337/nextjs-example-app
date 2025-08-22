"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const navigationItems = [
  {
    name: "Learning Management",
    href: "/dashboard/lms",
    description: "Academic content and student progress",
    allowedRoles: ["Administrator", "Dean", "Teacher", "Student"]
  },
  {
    name: "Enrollment System",
    href: "/dashboard/enrollment",
    description: "Registration and admissions",
    allowedRoles: ["Administrator", "Dean", "Teacher"]
  },
  {
    name: "Library System",
    href: "/dashboard/library",
    description: "Library resources and catalog",
    allowedRoles: ["Administrator", "Dean", "Teacher", "Student"]
  },
  {
    name: "Human Resources",
    href: "/dashboard/hris",
    description: "Staff records and processes",
    allowedRoles: ["Administrator", "Dean"]
  },
  {
    name: "Material Management",
    href: "/dashboard/mms",
    description: "Assets and inventory",
    allowedRoles: ["Administrator", "Dean", "Teacher"]
  }
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const allowedNavItems = navigationItems.filter(item =>
    item.allowedRoles.includes(user.role)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Academic Management Suite</h1>
              <p className="text-sm text-gray-600">
                Welcome back, {user.name} ({user.role})
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
                {user.department && (
                  <p className="text-xs text-gray-500">{user.department}</p>
                )}
              </div>
              <Button variant="outline" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-6">
            <div className="space-y-2">
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full justify-start">
                  Dashboard Overview
                </Button>
              </Link>
              <Separator className="my-4" />
              {allowedNavItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button variant="ghost" className="w-full justify-start">
                    <div className="text-left">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </Button>
                </Link>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
