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
  mockEmployees,
  getEmployeesByDepartment,
  type Employee
} from "@/lib/mockData";

function HRISContent() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEmployeeDetailsOpen, setIsEmployeeDetailsOpen] = useState(false);
  const [isNewEmployeeOpen, setIsNewEmployeeOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    phone: "",
    salary: ""
  });

  if (!user) return null;

  const filteredEmployees = mockEmployees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const departments = Array.from(new Set(mockEmployees.map(emp => emp.department)));

  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'destructive';
      case 'On Leave': return 'secondary';
      default: return 'outline';
    }
  };

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEmployeeDetailsOpen(true);
  };

  const handleAddEmployee = () => {
    // In a real app, this would make an API call
    console.log('Adding new employee:', newEmployee);
    setIsNewEmployeeOpen(false);
    setNewEmployee({
      name: "",
      email: "",
      department: "",
      position: "",
      phone: "",
      salary: ""
    });
    alert('Employee added successfully!');
  };

  const getHRStats = () => {
    return {
      totalEmployees: mockEmployees.length,
      activeEmployees: mockEmployees.filter(emp => emp.status === 'Active').length,
      onLeaveEmployees: mockEmployees.filter(emp => emp.status === 'On Leave').length,
      inactiveEmployees: mockEmployees.filter(emp => emp.status === 'Inactive').length,
      averageSalary: Math.round(mockEmployees.reduce((sum, emp) => sum + emp.salary, 0) / mockEmployees.length)
    };
  };

  const stats = getHRStats();

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(salary);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Human Resource Information System</h1>
          <p className="text-gray-600 mt-2">
            Manage staff records, processes, and human resource operations
          </p>
        </div>
        <Dialog open={isNewEmployeeOpen} onOpenChange={setIsNewEmployeeOpen}>
          <DialogTrigger asChild>
            <Button>Add Employee</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Enter the details for the new employee.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={newEmployee.department} onValueChange={(value) => setNewEmployee({...newEmployee, department: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administration">Administration</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                  placeholder="Enter position/title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  type="number"
                  value={newEmployee.salary}
                  onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
                  placeholder="Enter annual salary"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsNewEmployeeOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEmployee}>
                Add Employee
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="employees">Employee Records</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search by name, email, ID, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Employee Table */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Directory</CardTitle>
              <CardDescription>
                Complete list of all employees and their information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Hire Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.employeeId}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(employee.status)}>
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(employee.hireDate)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEmployeeClick(employee)}
                          >
                            View
                          </Button>
                          <Button size="sm" variant="outline">Edit</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredEmployees.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No employees found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Payroll</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatSalary(mockEmployees.reduce((sum, emp) => sum + emp.salary, 0))}
                </div>
                <p className="text-xs text-gray-500">Annual total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Average Salary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatSalary(stats.averageSalary)}</div>
                <p className="text-xs text-gray-500">Per employee</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeEmployees}</div>
                <p className="text-xs text-gray-500">Currently employed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">On Leave</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.onLeaveEmployees}</div>
                <p className="text-xs text-gray-500">Temporary absence</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payroll Management</CardTitle>
              <CardDescription>Manage employee compensation and benefits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-20 flex-col">
                  <span className="font-semibold">Process Payroll</span>
                  <span className="text-sm text-gray-500">Generate monthly payroll</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <span className="font-semibold">Tax Reports</span>
                  <span className="text-sm text-gray-500">Generate tax documents</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <span className="font-semibold">Benefits Management</span>
                  <span className="text-sm text-gray-500">Manage employee benefits</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <span className="font-semibold">Salary Reviews</span>
                  <span className="text-sm text-gray-500">Annual salary adjustments</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Management</CardTitle>
              <CardDescription>Track and manage employee performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  Performance management features would include employee evaluations, 
                  goal setting and tracking, performance reviews, and development plans. 
                  This system would integrate with the learning management system for 
                  professional development tracking.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Reviews</CardTitle>
                <CardDescription>Upcoming and completed reviews</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">Schedule Review</Button>
                <Button className="w-full justify-start" variant="outline">View Completed Reviews</Button>
                <Button className="w-full justify-start" variant="outline">Performance Reports</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Goal Management</CardTitle>
                <CardDescription>Employee goals and objectives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">Set Goals</Button>
                <Button className="w-full justify-start" variant="outline">Track Progress</Button>
                <Button className="w-full justify-start" variant="outline">Goal Reports</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* HR Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEmployees}</div>
                <p className="text-xs text-gray-500">All employees</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.activeEmployees}</div>
                <p className="text-xs text-gray-500">Currently working</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">On Leave</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.onLeaveEmployees}</div>
                <p className="text-xs text-gray-500">Temporary absence</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Inactive</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.inactiveEmployees}</div>
                <p className="text-xs text-gray-500">No longer employed</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
                <CardDescription>Employee count by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {departments.map(dept => {
                    const deptEmployees = getEmployeesByDepartment(dept);
                    const percentage = Math.round((deptEmployees.length / mockEmployees.length) * 100);
                    return (
                      <div key={dept} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{dept}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">{deptEmployees.length}</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 w-8">{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>HR Reports</CardTitle>
                <CardDescription>Generate comprehensive HR reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">Employee Report</Button>
                <Button className="w-full justify-start" variant="outline">Payroll Report</Button>
                <Button className="w-full justify-start" variant="outline">Attendance Report</Button>
                <Button className="w-full justify-start" variant="outline">Performance Report</Button>
                <Button className="w-full justify-start" variant="outline">Custom Report</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Employee Details Dialog */}
      <Dialog open={isEmployeeDetailsOpen} onOpenChange={setIsEmployeeDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedEmployee?.name}</DialogTitle>
            <DialogDescription>{selectedEmployee?.position} - {selectedEmployee?.department}</DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="font-medium">Employee ID:</Label>
                  <p>{selectedEmployee.employeeId}</p>
                </div>
                <div>
                  <Label className="font-medium">Email:</Label>
                  <p>{selectedEmployee.email}</p>
                </div>
                <div>
                  <Label className="font-medium">Phone:</Label>
                  <p>{selectedEmployee.phone}</p>
                </div>
                <div>
                  <Label className="font-medium">Department:</Label>
                  <p>{selectedEmployee.department}</p>
                </div>
                <div>
                  <Label className="font-medium">Position:</Label>
                  <p>{selectedEmployee.position}</p>
                </div>
                <div>
                  <Label className="font-medium">Hire Date:</Label>
                  <p>{formatDate(selectedEmployee.hireDate)}</p>
                </div>
                <div>
                  <Label className="font-medium">Salary:</Label>
                  <p>{formatSalary(selectedEmployee.salary)}</p>
                </div>
                <div>
                  <Label className="font-medium">Status:</Label>
                  <Badge variant={getStatusColor(selectedEmployee.status)}>
                    {selectedEmployee.status}
                  </Badge>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button className="flex-1">Edit Employee</Button>
                <Button variant="outline">View Performance</Button>
                <Button variant="outline" onClick={() => setIsEmployeeDetailsOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function HRISPage() {
  return (
    <RoleBasedRoute allowedRoles={["Administrator", "Dean"]}>
      <HRISContent />
    </RoleBasedRoute>
  );
}
