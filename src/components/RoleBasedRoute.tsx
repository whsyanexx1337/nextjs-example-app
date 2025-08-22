"use client";

import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface RoleBasedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallbackMessage?: string;
}

export function RoleBasedRoute({ 
  allowedRoles, 
  children, 
  fallbackMessage 
}: RoleBasedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You need to be logged in to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                {fallbackMessage || 
                  `This page is restricted to: ${allowedRoles.join(', ')}. Your current role is: ${user.role}`
                }
              </AlertDescription>
            </Alert>
            <Link href="/dashboard">
              <Button className="w-full">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

// Higher-order component version for easier use
export function withRoleBasedAccess<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: string[],
  fallbackMessage?: string
) {
  return function ProtectedComponent(props: P) {
    return (
      <RoleBasedRoute allowedRoles={allowedRoles} fallbackMessage={fallbackMessage}>
        <Component {...props} />
      </RoleBasedRoute>
    );
  };
}

// Hook for checking role access
export function useRoleAccess(allowedRoles: string[]) {
  const { user } = useAuth();
  
  return {
    hasAccess: user ? allowedRoles.includes(user.role) : false,
    user,
    userRole: user?.role
  };
}
