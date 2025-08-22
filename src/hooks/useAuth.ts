import { useAuth as useAuthContext } from '@/context/AuthContext';

// Re-export the useAuth hook for easier imports
export const useAuth = useAuthContext;

// Additional auth-related utilities
export function useRequireAuth() {
  const auth = useAuthContext();
  
  if (!auth.user) {
    throw new Error('Authentication required');
  }
  
  return auth;
}

export function useHasRole(allowedRoles: string[]) {
  const { user } = useAuthContext();
  
  if (!user) return false;
  
  return allowedRoles.includes(user.role);
}

export function useIsRole(role: string) {
  const { user } = useAuthContext();
  
  return user?.role === role;
}
