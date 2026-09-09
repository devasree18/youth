import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { sendError } from '../utils/response';
import { DEFAULT_ROLE_PERMISSIONS } from '../models/User';

export const requirePermission = (permission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 401, 'UNAUTHORIZED', 'Authentication required');
    }

    const userRole = req.user.role?.toUpperCase() || 'USER';
    const userPermissions = req.user.permissions || DEFAULT_ROLE_PERMISSIONS[userRole] || [];

    // Super admin bypass
    if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN' || userPermissions.includes('*')) {
      return next();
    }

    if (!userPermissions.includes(permission)) {
      return sendError(
        res, 
        403, 
        'INSUFFICIENT_PERMISSIONS', 
        `Access denied. Required permission '${permission}' is missing.`
      );
    }

    next();
  };
};

export const requireRole = (roles: string | string[]) => {
  const roleList = Array.isArray(roles) ? roles.map(r => r.toUpperCase()) : [roles.toUpperCase()];

  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 401, 'UNAUTHORIZED', 'Authentication required');
    }

    const currentRole = req.user.role?.toUpperCase();
    
    // Legacy mapping support
    const normalizedRole = currentRole === 'STUDENT' ? 'STUDENT'
      : currentRole === 'COUNSELOR' ? 'COUNSELOR'
      : currentRole === 'INSTITUTION' ? 'INSTITUTION_ADMIN'
      : currentRole === 'ADMIN' ? 'ADMIN'
      : currentRole;

    if (currentRole === 'SUPER_ADMIN' || roleList.includes(currentRole) || roleList.includes(normalizedRole)) {
      return next();
    }

    return sendError(
      res, 
      403, 
      'ROLE_ACCESS_DENIED', 
      `Access denied. Role '${currentRole}' is not authorized for this resource.`
    );
  };
};

export const requireTenantContext = () => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 401, 'UNAUTHORIZED', 'Authentication required');
    }

    if (!req.user.tenantId && !req.user.institutionId && req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'ADMIN') {
      return sendError(res, 403, 'TENANT_CONTEXT_REQUIRED', 'Tenant context is missing for this operation');
    }

    next();
  };
};
