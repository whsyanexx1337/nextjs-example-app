// Mock data for the Academic Management Suite

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  instructor: string;
  department: string;
  credits: number;
  semester: string;
  enrolledStudents: number;
  maxStudents: number;
  schedule: string;
  status: 'Active' | 'Inactive' | 'Completed';
}

export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  year: string;
  gpa: number;
  status: 'Active' | 'Inactive' | 'Graduated';
  enrolledCourses: string[];
}

export interface Assignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  dueDate: string;
  status: 'Pending' | 'Submitted' | 'Graded';
  grade?: number;
  maxGrade: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  year: number;
  copies: number;
  available: number;
  location: string;
  status: 'Available' | 'Checked Out' | 'Reserved';
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  position: string;
  hireDate: string;
  salary: number;
  status: 'Active' | 'Inactive' | 'On Leave';
  phone: string;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
  supplier: string;
  lastUpdated: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  minThreshold: number;
}

export interface EnrollmentApplication {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  program: string;
  semester: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Waitlisted';
  submissionDate: string;
  documents: string[];
}

// Mock Courses Data
export const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Introduction to Computer Science',
    code: 'CS101',
    description: 'Fundamental concepts of computer science and programming',
    instructor: 'Dr. Emily Rodriguez',
    department: 'Computer Science',
    credits: 3,
    semester: 'Fall 2024',
    enrolledStudents: 45,
    maxStudents: 50,
    schedule: 'MWF 10:00-11:00 AM',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Calculus I',
    code: 'MATH101',
    description: 'Differential and integral calculus',
    instructor: 'Prof. Michael Chen',
    department: 'Mathematics',
    credits: 4,
    semester: 'Fall 2024',
    enrolledStudents: 38,
    maxStudents: 40,
    schedule: 'TTh 2:00-3:30 PM',
    status: 'Active'
  },
  {
    id: '3',
    name: 'English Literature',
    code: 'ENG201',
    description: 'Survey of English literature from medieval to modern times',
    instructor: 'Dr. Sarah Johnson',
    department: 'English',
    credits: 3,
    semester: 'Fall 2024',
    enrolledStudents: 25,
    maxStudents: 30,
    schedule: 'MWF 1:00-2:00 PM',
    status: 'Active'
  }
];

// Mock Students Data
export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Alex Thompson',
    email: 'alex.thompson@university.edu',
    studentId: 'STU001',
    department: 'Computer Science',
    year: 'Sophomore',
    gpa: 3.7,
    status: 'Active',
    enrolledCourses: ['1', '2']
  },
  {
    id: '2',
    name: 'Emma Davis',
    email: 'emma.davis@university.edu',
    studentId: 'STU002',
    department: 'Mathematics',
    year: 'Junior',
    gpa: 3.9,
    status: 'Active',
    enrolledCourses: ['2', '3']
  },
  {
    id: '3',
    name: 'James Wilson',
    email: 'james.wilson@university.edu',
    studentId: 'STU003',
    department: 'English',
    year: 'Senior',
    gpa: 3.5,
    status: 'Active',
    enrolledCourses: ['3']
  }
];

// Mock Assignments Data
export const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Programming Project 1',
    courseId: '1',
    courseName: 'Introduction to Computer Science',
    dueDate: '2024-02-15',
    status: 'Pending',
    maxGrade: 100
  },
  {
    id: '2',
    title: 'Calculus Problem Set 3',
    courseId: '2',
    courseName: 'Calculus I',
    dueDate: '2024-02-20',
    status: 'Submitted',
    grade: 85,
    maxGrade: 100
  },
  {
    id: '3',
    title: 'Literature Essay',
    courseId: '3',
    courseName: 'English Literature',
    dueDate: '2024-02-25',
    status: 'Graded',
    grade: 92,
    maxGrade: 100
  }
];

// Mock Books Data
export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    isbn: '978-0262033848',
    category: 'Computer Science',
    publisher: 'MIT Press',
    year: 2009,
    copies: 5,
    available: 3,
    location: 'CS Section - Shelf A1',
    status: 'Available'
  },
  {
    id: '2',
    title: 'Calculus: Early Transcendentals',
    author: 'James Stewart',
    isbn: '978-1285741550',
    category: 'Mathematics',
    publisher: 'Cengage Learning',
    year: 2015,
    copies: 8,
    available: 2,
    location: 'Math Section - Shelf B2',
    status: 'Available'
  },
  {
    id: '3',
    title: 'The Norton Anthology of English Literature',
    author: 'Stephen Greenblatt',
    isbn: '978-0393603040',
    category: 'Literature',
    publisher: 'W. W. Norton & Company',
    year: 2018,
    copies: 6,
    available: 0,
    location: 'Literature Section - Shelf C3',
    status: 'Checked Out'
  }
];

// Mock Employees Data
export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    employeeId: 'EMP001',
    department: 'Administration',
    position: 'Administrator',
    hireDate: '2015-08-15',
    salary: 85000,
    status: 'Active',
    phone: '(555) 123-4567'
  },
  {
    id: '2',
    name: 'Prof. Michael Chen',
    email: 'michael.chen@university.edu',
    employeeId: 'EMP002',
    department: 'Computer Science',
    position: 'Dean',
    hireDate: '2012-01-10',
    salary: 95000,
    status: 'Active',
    phone: '(555) 234-5678'
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@university.edu',
    employeeId: 'EMP003',
    department: 'Mathematics',
    position: 'Professor',
    hireDate: '2018-09-01',
    salary: 75000,
    status: 'Active',
    phone: '(555) 345-6789'
  }
];

// Mock Materials Data
export const mockMaterials: Material[] = [
  {
    id: '1',
    name: 'Whiteboard Markers',
    category: 'Office Supplies',
    quantity: 150,
    unit: 'pieces',
    location: 'Storage Room A',
    supplier: 'Office Depot',
    lastUpdated: '2024-01-15',
    status: 'In Stock',
    minThreshold: 50
  },
  {
    id: '2',
    name: 'Laboratory Equipment Set',
    category: 'Lab Equipment',
    quantity: 5,
    unit: 'sets',
    location: 'Science Lab',
    supplier: 'Scientific Supplies Inc.',
    lastUpdated: '2024-01-20',
    status: 'Low Stock',
    minThreshold: 3
  },
  {
    id: '3',
    name: 'Projector Bulbs',
    category: 'Electronics',
    quantity: 0,
    unit: 'pieces',
    location: 'IT Storage',
    supplier: 'Tech Solutions',
    lastUpdated: '2024-01-25',
    status: 'Out of Stock',
    minThreshold: 10
  }
];

// Mock Enrollment Applications Data
export const mockEnrollmentApplications: EnrollmentApplication[] = [
  {
    id: '1',
    studentName: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(555) 111-2222',
    program: 'Computer Science',
    semester: 'Fall 2024',
    status: 'Pending',
    submissionDate: '2024-01-10',
    documents: ['Transcript', 'Application Form', 'Recommendation Letter']
  },
  {
    id: '2',
    studentName: 'Lisa Brown',
    email: 'lisa.brown@email.com',
    phone: '(555) 333-4444',
    program: 'Mathematics',
    semester: 'Fall 2024',
    status: 'Approved',
    submissionDate: '2024-01-08',
    documents: ['Transcript', 'Application Form', 'Personal Statement']
  },
  {
    id: '3',
    studentName: 'David Lee',
    email: 'david.lee@email.com',
    phone: '(555) 555-6666',
    program: 'English Literature',
    semester: 'Fall 2024',
    status: 'Waitlisted',
    submissionDate: '2024-01-12',
    documents: ['Transcript', 'Application Form']
  }
];

// Utility functions for data manipulation
export const getCoursesByInstructor = (instructorName: string): Course[] => {
  return mockCourses.filter(course => course.instructor === instructorName);
};

export const getStudentsByCourse = (courseId: string): Student[] => {
  return mockStudents.filter(student => student.enrolledCourses.includes(courseId));
};

export const getAssignmentsByStudent = (studentId: string): Assignment[] => {
  const student = mockStudents.find(s => s.id === studentId);
  if (!student) return [];
  
  return mockAssignments.filter(assignment => 
    student.enrolledCourses.includes(assignment.courseId)
  );
};

export const searchBooks = (query: string): Book[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockBooks.filter(book => 
    book.title.toLowerCase().includes(lowercaseQuery) ||
    book.author.toLowerCase().includes(lowercaseQuery) ||
    book.category.toLowerCase().includes(lowercaseQuery)
  );
};

export const getEmployeesByDepartment = (department: string): Employee[] => {
  return mockEmployees.filter(employee => employee.department === department);
};

export const getMaterialsByStatus = (status: Material['status']): Material[] => {
  return mockMaterials.filter(material => material.status === status);
};
