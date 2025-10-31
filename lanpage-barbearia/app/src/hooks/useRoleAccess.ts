import { useAuth } from '@/contexts/AuthContext';

export type UserRole = 'cliente' | 'barbeiro' | 'admin';

export interface RolePermissions {
  canViewDashboard: boolean;
  canManageAppointments: boolean;
  canViewEarnings: boolean;
  canManageUsers: boolean;
  canManageServices: boolean;
  canViewReports: boolean;
  canManageIntegrations: boolean;
  canViewProducts: boolean;
  canManageProducts: boolean;
  canViewClients: boolean;
  canManageClients: boolean;
  canViewBarbers: boolean;
  canManageBarbers: boolean;
  canAccessAdminPanel: boolean;
}

const rolePermissions: Record<UserRole, RolePermissions> = {
  cliente: {
    canViewDashboard: true,
    canManageAppointments: true, // Can create/cancel their own appointments
    canViewEarnings: false,
    canManageUsers: false,
    canManageServices: false,
    canViewReports: false,
    canManageIntegrations: false,
    canViewProducts: true,
    canManageProducts: false,
    canViewClients: false,
    canManageClients: false,
    canViewBarbers: true, // Can view to select for appointments
    canManageBarbers: false,
    canAccessAdminPanel: false,
  },
  barbeiro: {
    canViewDashboard: true,
    canManageAppointments: true, // Can manage their own appointments
    canViewEarnings: true,
    canManageUsers: false,
    canManageServices: false,
    canViewReports: false, // Limited reports about their own performance
    canManageIntegrations: false,
    canViewProducts: true,
    canManageProducts: false,
    canViewClients: true, // Can view their clients
    canManageClients: false,
    canViewBarbers: true, // Can view other barbers
    canManageBarbers: false,
    canAccessAdminPanel: false,
  },
  admin: {
    canViewDashboard: true,
    canManageAppointments: true,
    canViewEarnings: true,
    canManageUsers: true,
    canManageServices: true,
    canViewReports: true,
    canManageIntegrations: true,
    canViewProducts: true,
    canManageProducts: true,
    canViewClients: true,
    canManageClients: true,
    canViewBarbers: true,
    canManageBarbers: true,
    canAccessAdminPanel: true,
  },
};

export function useRoleAccess() {
  const { userProfile } = useAuth();
  
  const userRole = userProfile?.tipo || 'cliente';
  const permissions = rolePermissions[userRole];

  const hasPermission = (permission: keyof RolePermissions): boolean => {
    return permissions[permission];
  };

  const hasAnyPermission = (permissionList: (keyof RolePermissions)[]): boolean => {
    return permissionList.some(permission => permissions[permission]);
  };

  const hasAllPermissions = (permissionList: (keyof RolePermissions)[]): boolean => {
    return permissionList.every(permission => permissions[permission]);
  };

  const isRole = (role: UserRole): boolean => {
    return userRole === role;
  };

  const isAdmin = (): boolean => {
    return userRole === 'admin';
  };

  const isBarbeiro = (): boolean => {
    return userRole === 'barbeiro';
  };

  const isCliente = (): boolean => {
    return userRole === 'cliente';
  };

  const canAccessRoute = (route: string): boolean => {
    // Define route access rules
    const routePermissions: Record<string, keyof RolePermissions> = {
      '/dashboard': 'canViewDashboard',
      '/agendamento': 'canManageAppointments',
      '/ganhos': 'canViewEarnings',
      '/gestao': 'canAccessAdminPanel',
      '/relatorios': 'canViewReports',
      '/integracoes': 'canManageIntegrations',
      '/produtos': 'canViewProducts',
      '/proximos': 'canViewEarnings', // Barber-specific
    };

    const requiredPermission = routePermissions[route];
    if (!requiredPermission) {
      return true; // Allow access to routes not explicitly restricted
    }

    return hasPermission(requiredPermission);
  };

  return {
    userRole,
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isRole,
    isAdmin,
    isBarbeiro,
    isCliente,
    canAccessRoute,
  };
}