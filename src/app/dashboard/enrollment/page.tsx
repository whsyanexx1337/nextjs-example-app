"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { RoleBasedRoute } from "@/components/RoleBasedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  mockEnrollmentApplications,
  mockCourses,
  type EnrollmentApplication
} from "@/lib/mockData";

function EnrollmentContent() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isNewApplicationOpen, setIsNewApplicationOpen] = useState(false);
  const [newApplication, setNewApplication] = useState({
    studentName: "",
    email: "",
    phone: "",
    program: "",
    semester: "Fall 2024"
  });

  if (!user) return null;

  const filteredApplications = mockEnrollmentApplications.filter(app => {
    const matchesSearch = app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.program.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: EnrollmentApplication['status']) => {
    switch (status) {
      case 'Approved': return 'default';
      case 'Pending': return 'secondary';
      case 'Rejected': return 'destructive';
      case 'Waitlisted': return 'outline';
      default: return 'secondary';
    }
  };

  const handleSubmitApplication = () => {
    // In a real app, this would submit to an API
    console.log('New application submitted:', newApplication);
    setIsNewApplicationOpen(false);
    setNewApplication({
      studentName: "",
      email: "",
      phone: "",
      program: "",
      semester: "Fall 2024"
    });
  };

  const getStatusCounts = () => {
    return {
      total: mockEnrollmentApplications.length,
      pending: mockEnrollmentApplications.filter(app => app.status === 'Pending').length,
      approved: mockEnrollmentApplications.filter(app => app.status === 'Approved').length,
      rejected: mockEnrollmentApplications.filter(app => app.status === 'Rejected').length,
      waitlisted: mockEnrollmentApplications.filter(app => app.status === 'Waitlisted').length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enrollment System</h1>
          <p className="text-gray-600 mt-2">
            Handle student registration, admissions, and enrollment processes
          </p>
        </div>
        <Dialog open={isNewApplicationOpen} onOpenChange={setIsNewApplicationOpen}>
          <DialogTrigger asChild>
            <Button>New Application</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New Enrollment Application</DialogTitle>
              <DialogDescription>
                Submit a new student enrollment application.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name</Label>
                <Input
                  id="studentName"
                  value={newApplication.studentName}
                  onChange={(e) => setNewApplication({...newApplication, studentName: e.target.value})}
                  placeholder="Enter student name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newApplication.email}
                  onChange={(e) => setNewApplication({...newApplication, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newApplication.phone}
                  onChange={(e) => setNewApplication({...newApplication, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="program">Program</Label>
                <Select value={newApplication.program} onValueChange={(value) => setNewApplication({...newApplication, program: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="English Literature">English Literature</SelectItem>
                    <SelectItem value="Business Administration">Business Administration</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Select value={newApplication.semester} onValueChange={(value) => setNewApplication({...newApplication, semester: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                    <SelectItem value="Spring 2025">Spring 2025</SelectItem>
                    <SelectItem value="Summer 2025">Summer 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsNewApplicationOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitApplication}>
                Submit Application
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="applications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="courses">Course Enrollment</TabsTrigger>
          {(user.role === "Administrator" || user.role === "Dean") && (
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="applications" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search by name, email, or program..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Waitlisted">Waitlisted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Applications Table */}
          <Card>
            <CardHeader>
              <CardTitle>Enrollment Applications</CardTitle>
              <CardDescription>
                Manage and review student enrollment applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">{application.studentName}</TableCell>
                      <TableCell>{application.email}</TableCell>
                      <TableCell>{application.program}</TableCell>
                      <TableCell>{application.semester}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(application.status)}>
                          {application.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(application.submissionDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">View</Button>
                          {application.status === 'Pending' && (user.role === "Administrator" || user.role === "Dean") && (
                            <>
                              <Button size="sm" variant="default">Approve</Button>
                              <Button size="sm" variant="destructive">Reject</Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredApplications.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No applications found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCourses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{course.name}</CardTitle>
                  <CardDescription>{course.code} - {course.department}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Instructor:</span>
                      <span className="font-medium">{course.instructor}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Credits:</span>
                      <span>{course.credits}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Enrollment:</span>
                      <span>{course.enrolledStudents}/{course.maxStudents}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Schedule:</span>
                      <span>{course.schedule}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">Enroll Students</Button>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {(user.role === "Administrator" || user.role === "Dean") && (
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statusCounts.total}</div>
                  <p className="text-xs text-gray-500">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
                  <p className="text-xs text-gray-500">Awaiting review</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{statusCounts.approved}</div>
                  <p className="text-xs text-gray-500">Accepted</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Waitlisted</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{statusCounts.waitlisted}</div>
                  <p className="text-xs text-gray-500">On waiting list</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
                  <p className="text-xs text-gray-500">Not accepted</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Application Trends</CardTitle>
                <CardDescription>Recent enrollment application activity</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertDescription>
                    Analytics dashboard would show detailed charts and trends here. 
                    This could include application volumes over time, program popularity, 
                    acceptance rates, and demographic breakdowns.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

export default function EnrollmentPage() {
  return (
    <RoleBasedRoute allowedRoles={["Administrator", "Dean", "Teacher"]}>
      <EnrollmentContent />
    </RoleBasedRoute>
  );
}
