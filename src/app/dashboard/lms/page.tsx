"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { RoleBasedRoute } from "@/components/RoleBasedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  mockCourses, 
  mockStudents, 
  mockAssignments, 
  getCoursesByInstructor,
  getStudentsByCourse,
  getAssignmentsByStudent,
  type Course,
  type Student,
  type Assignment
} from "@/lib/mockData";

function LMSContent() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  if (!user) return null;

  // Filter data based on user role
  const getRelevantCourses = (): Course[] => {
    switch (user.role) {
      case "Teacher":
        return getCoursesByInstructor(user.name);
      case "Student":
        const student = mockStudents.find(s => s.name === user.name);
        return student ? mockCourses.filter(c => student.enrolledCourses.includes(c.id)) : [];
      default:
        return mockCourses;
    }
  };

  const getRelevantAssignments = (): Assignment[] => {
    switch (user.role) {
      case "Student":
        const student = mockStudents.find(s => s.name === user.name);
        return student ? getAssignmentsByStudent(student.id) : [];
      default:
        return mockAssignments;
    }
  };

  const courses = getRelevantCourses();
  const assignments = getRelevantAssignments();
  
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProgressPercentage = (enrolled: number, max: number) => {
    return Math.round((enrolled / max) * 100);
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Learning Management System</h1>
        <p className="text-gray-600 mt-2">
          Manage academic content, courses, assignments, and track student progress
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <Input
          placeholder="Search courses, instructors, or course codes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Button variant="outline">Search</Button>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          {(user.role === "Administrator" || user.role === "Dean") && (
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{course.name}</CardTitle>
                      <CardDescription>{course.code}</CardDescription>
                    </div>
                    <Badge variant={course.status === 'Active' ? 'default' : 'secondary'}>
                      {course.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{course.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Instructor:</span>
                      <span className="font-medium">{course.instructor}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Department:</span>
                      <span>{course.department}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Credits:</span>
                      <span>{course.credits}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Schedule:</span>
                      <span>{course.schedule}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Enrollment:</span>
                      <span>{course.enrolledStudents}/{course.maxStudents}</span>
                    </div>
                    <Progress value={getProgressPercentage(course.enrolledStudents, course.maxStudents)} />
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">View Details</Button>
                    {user.role === "Teacher" && course.instructor === user.name && (
                      <Button size="sm" variant="outline">Manage</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No courses found matching your search criteria.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{assignment.title}</CardTitle>
                  <CardDescription>{assignment.courseName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Due Date:</span>
                      <span className="font-medium">{new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <Badge variant={
                        assignment.status === 'Graded' ? 'default' :
                        assignment.status === 'Submitted' ? 'secondary' : 'outline'
                      }>
                        {assignment.status}
                      </Badge>
                    </div>
                    {assignment.grade !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span>Grade:</span>
                        <span className={`font-medium ${getGradeColor(assignment.grade)}`}>
                          {assignment.grade}/{assignment.maxGrade}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">View Details</Button>
                    {assignment.status === 'Pending' && user.role === "Student" && (
                      <Button size="sm" variant="outline">Submit</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {assignments.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No assignments available.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {(user.role === "Administrator" || user.role === "Dean") && (
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockCourses.length}</div>
                  <p className="text-xs text-gray-500">Active courses</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStudents.length}</div>
                  <p className="text-xs text-gray-500">Enrolled students</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockAssignments.length}</div>
                  <p className="text-xs text-gray-500">Total assignments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Enrollment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(mockCourses.reduce((acc, course) => acc + course.enrolledStudents, 0) / mockCourses.length)}
                  </div>
                  <p className="text-xs text-gray-500">Students per course</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Course Enrollment Overview</CardTitle>
                <CardDescription>Current enrollment status across all courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCourses.map((course) => (
                    <div key={course.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{course.name} ({course.code})</span>
                        <span>{course.enrolledStudents}/{course.maxStudents}</span>
                      </div>
                      <Progress value={getProgressPercentage(course.enrolledStudents, course.maxStudents)} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

export default function LMSPage() {
  return (
    <RoleBasedRoute allowedRoles={["Administrator", "Dean", "Teacher", "Student"]}>
      <LMSContent />
    </RoleBasedRoute>
  );
}
