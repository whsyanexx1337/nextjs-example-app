"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const systemModules = [
  {
    name: "Learning Management System",
    description: "Manage academic content, courses, assignments, and track student progress",
    href: "/dashboard/lms",
    allowedRoles: ["Administrator", "Dean", "Teacher", "Student"],
    features: ["Course Management", "Assignment Tracking", "Grade Management", "Student Progress"]
  },
  {
    name: "Enrollment System",
    description: "Handle student registration, admissions, and enrollment processes",
    href: "/dashboard/enrollment",
    allowedRoles: ["Administrator", "Dean", "Teacher"],
    features: ["Student Registration", "Admission Management", "Course Enrollment", "Application Processing"]
  },
  {
    name: "Library System & OPAC",
    description: "Organize and access library resources through the online catalog",
    href: "/dashboard/library",
    allowedRoles: ["Administrator", "Dean", "Teacher", "Student"],
    features: ["Book Catalog", "Resource Search", "Borrowing Management", "Digital Resources"]
  },
  {
    name: "Human Resource Information System",
    description: "Manage staff records, processes, and human resource operations",
    href: "/dashboard/hris",
    allowedRoles: ["Administrator", "Dean"],
    features: ["Employee Records", "Payroll Management", "Performance Tracking", "Leave Management"]
  },
  {
    name: "Material Management System",
    description: "Track assets, inventory, and promote smarter resource management",
    href: "/dashboard/mms",
    allowedRoles: ["Administrator", "Dean", "Teacher"],
    features: ["Inventory Tracking", "Asset Management", "Resource Allocation", "Maintenance Scheduling"]
  }
];

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  const accessibleModules = systemModules.filter(module =>
    module.allowedRoles.includes(user.role)
  );

  const getRoleSpecificWelcome = () => {
    switch (user.role) {
      case "Administrator":
        return "You have full access to all systems and can manage institutional operations.";
      case "Dean":
        return "You can oversee academic programs and manage departmental resources.";
      case "Teacher":
        return "You can manage your courses, students, and academic content.";
      case "Student":
        return "You can access your courses, library resources, and track your progress.";
      case "Parent":
        return "You can monitor your child's academic progress and school communications.";
      default:
        return "Welcome to the Academic Management Suite.";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Academic Management Suite
        </h2>
        <p className="text-gray-600 mb-4">
          {getRoleSpecificWelcome()}
        </p>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">{user.role}</Badge>
          {user.department && <Badge variant="outline">{user.department}</Badge>}
          {user.employeeId && <Badge variant="outline">ID: {user.employeeId}</Badge>}
          {user.studentId && <Badge variant="outline">ID: {user.studentId}</Badge>}
        </div>
      </div>

      {/* System Overview */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Available Systems</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accessibleModules.map((module) => (
            <Link key={module.href} href={module.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">{module.name}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Key Features:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {module.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Systems</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accessibleModules.length}</div>
            <p className="text-xs text-gray-500">Available to you</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Your Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.role}</div>
            <p className="text-xs text-gray-500">Access level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.department || "N/A"}</div>
            <p className="text-xs text-gray-500">Your department</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-gray-500">System status</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
