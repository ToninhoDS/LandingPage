import React from 'react';
import { useRoleAccess, UserRole, RolePermissions } from '@/hooks/useRoleAccess';

interface ProtectedComponentProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: keyof RolePermissions;
  requiredPermissions?: (keyof RolePermissions)[];
  requireAll?: boolean; // If true, user must have ALL permissions. If false, user needs ANY permission
  fallback?: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedComponent({
  children,
  requiredRole,
  requiredPermission,
  requiredPermissions,
  requireAll = false,
  fallback = null,
  allowedRoles,
}: ProtectedComponentProps) {
  const { 
    userRole, 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions, 
    isRole 
  } = useRoleAccess();

  // Check role-based access
  if (requiredRole && !isRole(requiredRole)) {
    return <>{fallback}</>;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <>{fallback}</>;
  }

  // Check single permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <>{fallback}</>;
  }

  // Check multiple permissions
  if (requiredPermissions) {
    const hasAccess = requireAll 
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);
    
    if (!hasAccess) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}