"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'Administrator' | 'Dean' | 'Teacher' | 'Student' | 'Parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  studentId?: string;
  employeeId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'admin@university.edu',
    role: 'Administrator',
    employeeId: 'EMP001',
    department: 'Administration'
  },
  {
    id: '2',
    name: 'Prof. Michael Chen',
    email: 'dean@university.edu',
    role: 'Dean',
    employeeId: 'EMP002',
    department: 'Computer Science'
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    email: 'teacher@university.edu',
    role: 'Teacher',
    employeeId: 'EMP003',
    department: 'Mathematics'
  },
  {
    id: '4',
    name: 'Alex Thompson',
    email: 'student@university.edu',
    role: 'Student',
    studentId: 'STU001',
    department: 'Computer Science'
  },
  {
    id: '5',
    name: 'Maria Thompson',
    email: 'parent@university.edu',
    role: 'Parent'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('academicSuite_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('academicSuite_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user by email (password validation is mocked)
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (!foundUser) {
        setError('Invalid email or password');
        setIsLoading(false);
        return false;
      }

      // In a real app, you'd validate the password here
      // For demo purposes, any password works
      setUser(foundUser);
      localStorage.setItem('academicSuite_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    } catch (err) {
      setError('Login failed. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('academicSuite_user');
    setError(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
