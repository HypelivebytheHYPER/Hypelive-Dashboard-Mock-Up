/**
 * Role-Based Access Control (RBAC) Middleware
 * Advanced permission system for multi-stakeholder KOL platform
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';
import { logger } from '@/lib/core/observability/logger';
import { ApiError } from '@/lib/api/types/api.types';

/**
 * Permission types for different resources
 */
export type ResourceType = 
  | 'kols'
  | 'campaigns' 
  | 'analytics'
  | 'settings'
  | 'users'
  | 'billing'
  | 'integrations'
  | 'reports';

export type ActionType = 
  | 'read'
  | 'write' 
  | 'delete'
  | 'approve'
  | 'manage'
  | 'export';

/**
 * Role definitions with hierarchical permissions
 */
export interface Role {
  id: string;
  name: string;
  level: number; // Higher level = more permissions
  permissions: Permission[];
  description: string;
}

export interface Permission {
  resource: ResourceType;
  actions: ActionType[];
  conditions?: PermissionCondition[];
}

/**
 * Discriminated union for permission conditions
 * Each condition type has specific validation requirements
 */
export type PermissionCondition =
  | { type: 'own'; field?: string }
  | { type: 'team'; field?: string }
  | { type: 'organization'; field?: string }
  | { type: 'assigned'; field?: string };

/**
 * Predefined roles for KOL platform
 */
export const ROLES: Record<string, Role> = {
  super_admin: {
    id: 'super_admin',
    name: 'Super Administrator',
    level: 100,
    permissions: [
      { resource: 'kols', actions: ['read', 'write', 'delete', 'manage'] },
      { resource: 'campaigns', actions: ['read', 'write', 'delete', 'approve', 'manage'] },
      { resource: 'analytics', actions: ['read', 'export', 'manage'] },
      { resource: 'settings', actions: ['read', 'write', 'manage'] },
      { resource: 'users', actions: ['read', 'write', 'delete', 'manage'] },
      { resource: 'billing', actions: ['read', 'write', 'manage'] },
      { resource: 'integrations', actions: ['read', 'write', 'manage'] },
      { resource: 'reports', actions: ['read', 'write', 'export', 'manage'] }
    ],
    description: 'Full system access and management'
  },
  
  organization_admin: {
    id: 'organization_admin',
    name: 'Organization Administrator',
    level: 90,
    permissions: [
      { resource: 'kols', actions: ['read', 'write', 'delete', 'manage'] },
      { resource: 'campaigns', actions: ['read', 'write', 'delete', 'approve', 'manage'] },
      { resource: 'analytics', actions: ['read', 'export'] },
      { resource: 'settings', actions: ['read', 'write'] },
      { resource: 'users', actions: ['read', 'write', 'manage'] },
      { resource: 'billing', actions: ['read', 'write'] },
      { resource: 'integrations', actions: ['read', 'write'] },
      { resource: 'reports', actions: ['read', 'write', 'export'] }
    ],
    description: 'Organization-level management'
  },
  
  campaign_manager: {
    id: 'campaign_manager',
    name: 'Campaign Manager',
    level: 70,
    permissions: [
      { resource: 'kols', actions: ['read', 'write'], conditions: [{ type: 'assigned' }] },
      { resource: 'campaigns', actions: ['read', 'write', 'approve'], conditions: [{ type: 'own' }] },
      { resource: 'analytics', actions: ['read', 'export'] },
      { resource: 'settings', actions: ['read'] },
      { resource: 'reports', actions: ['read', 'export'] }
    ],
    description: 'Manages campaigns and KOL relationships'
  },
  
  kol_coordinator: {
    id: 'kol_coordinator',
    name: 'KOL Coordinator',
    level: 50,
    permissions: [
      { resource: 'kols', actions: ['read', 'write'] },
      { resource: 'campaigns', actions: ['read', 'write'], conditions: [{ type: 'assigned' }] },
      { resource: 'analytics', actions: ['read'] },
      { resource: 'reports', actions: ['read'] }
    ],
    description: 'Coordinates with KOLs and manages content'
  },
  
  brand_manager: {
    id: 'brand_manager',
    name: 'Brand Manager',
    level: 40,
    permissions: [
      { resource: 'kols', actions: ['read'] },
      { resource: 'campaigns', actions: ['read'], conditions: [{ type: 'team' }] },
      { resource: 'analytics', actions: ['read', 'export'] },
      { resource: 'reports', actions: ['read', 'export'] }
    ],
    description: 'Oversees brand campaigns and performance'
  },
  
  finance_manager: {
    id: 'finance_manager',
    name: 'Finance Manager',
    level: 60,
    permissions: [
      { resource: 'campaigns', actions: ['read'], conditions: [{ type: 'organization' }] },
      { resource: 'billing', actions: ['read', 'write', 'manage'] },
      { resource: 'reports', actions: ['read', 'export'] },
      { resource: 'analytics', actions: ['read', 'export'] }
    ],
    description: 'Manages budgets, billing, and financial reports'
  },
  
  external_agency: {
    id: 'external_agency',
    name: 'External Agency',
    level: 30,
    permissions: [
      { resource: 'kols', actions: ['read'] },
      { resource: 'campaigns', actions: ['read'], conditions: [{ type: 'assigned' }] },
      { resource: 'analytics', actions: ['read'], conditions: [{ type: 'assigned' }] }
    ],
    description: 'External partner with limited access'
  },
  
  viewer: {
    id: 'viewer',
    name: 'Viewer',
    level: 10,
    permissions: [
      { resource: 'kols', actions: ['read'] },
      { resource: 'campaigns', actions: ['read'], conditions: [{ type: 'organization' }] },
      { resource: 'analytics', actions: ['read'], conditions: [{ type: 'organization' }] },
      { resource: 'reports', actions: ['read'] }
    ],
    description: 'Read-only access to organization data'
  }
};

/**
 * User with role and organization information
 */
export interface UserWithRole {
  id: string;
  email: string;
  role: Role;
  organizationId: string;
  teamId?: string;
  permissions?: Permission[]; // Cached permissions
}

/**
 * Context data for permission checks
 */
export interface PermissionContext {
  resourceId?: string;
  resourceData?: Record<string, unknown>;
  organizationId?: string;
}

/**
 * Check if user has permission for a specific action on a resource
 * @param user - User with role information
 * @param resource - Resource type being accessed
 * @param action - Action being performed
 * @param context - Optional context for conditional permissions
 * @returns Promise<boolean> - True if permission granted
 */
export async function checkPermission(
  user: UserWithRole,
  resource: ResourceType,
  action: ActionType,
  context?: PermissionContext
): Promise<boolean> {
  try {
    // Super admin bypass
    if (user.role.id === 'super_admin') {
      return true;
    }

    // Find relevant permission
    const permission = user.role.permissions.find(p => p.resource === resource);
    if (!permission) {
      logger.warn('No permission found for resource', { 
        userId: user.id, 
        resource, 
        action 
      });
      return false;
    }

    // Check if action is allowed
    if (!permission.actions.includes(action)) {
      logger.warn('Action not permitted', { 
        userId: user.id, 
        resource, 
        action,
        allowedActions: permission.actions 
      });
      return false;
    }

    // Check conditions if they exist
    if (permission.conditions && permission.conditions.length > 0) {
      const conditionCheck = await checkPermissionConditions(
        user,
        permission.conditions,
        context
      );
      
      if (!conditionCheck) {
        logger.warn('Permission conditions not met', { 
          userId: user.id, 
          resource, 
          action,
          conditions: permission.conditions 
        });
        return false;
      }
    }

    // Log successful permission check
    logger.debug('Permission granted', { 
      userId: user.id, 
      resource, 
      action 
    });

    return true;
  } catch (error) {
    logger.error('Error checking permission', { 
      error, 
      userId: user.id, 
      resource, 
      action 
    });
    return false;
  }
}

/**
 * Check permission conditions (ownership, team membership, etc.)
 * @param user - User with role information
 * @param conditions - Array of conditions to check
 * @param context - Optional context for conditional permissions
 * @returns Promise<boolean> - True if all conditions pass
 */
async function checkPermissionConditions(
  user: UserWithRole,
  conditions: PermissionCondition[],
  context?: PermissionContext
): Promise<boolean> {
  for (const condition of conditions) {
    switch (condition.type) {
      case 'own':
        if (!context?.resourceData?.[condition.field || 'createdBy']) {
          return false;
        }
        return context.resourceData[condition.field || 'createdBy'] === user.id;

      case 'team':
        if (!user.teamId || !context?.resourceData?.[condition.field || 'teamId']) {
          return false;
        }
        return context.resourceData[condition.field || 'teamId'] === user.teamId;

      case 'organization':
        if (!context?.organizationId && !context?.resourceData?.[condition.field || 'organizationId']) {
          return false;
        }
        const resourceOrgId = context.organizationId || context?.resourceData?.[condition.field || 'organizationId'];
        return resourceOrgId === user.organizationId;

      case 'assigned':
        if (!context?.resourceData?.[condition.field || 'assignedTo']) {
          return false;
        }
        return context.resourceData[condition.field || 'assignedTo'] === user.id;

      default:
        logger.warn('Unknown permission condition type', { condition });
        return false;
    }
  }
  return true;
}

/**
 * Handler function type for protected routes
 */
export type ProtectedRouteHandler = (
  request: NextRequest,
  user: UserWithRole
) => Promise<NextResponse>;

/**
 * Middleware for protecting API routes
 * @param request - NextRequest object
 * @param resource - Resource type being accessed
 * @param action - Action being performed
 * @param handler - Handler function to execute if permission granted
 * @returns Promise<NextResponse> - API response
 */
export async function withPermission(
  request: NextRequest,
  resource: ResourceType,
  action: ActionType,
  handler: ProtectedRouteHandler
): Promise<NextResponse> {
  try {
    // Extract token from request
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Verify token and get user
    const payload = await verifyToken(token);
    const user: UserWithRole = {
      id: payload.userId,
      email: payload.email,
      role: ROLES[payload.role] || ROLES.viewer,
      organizationId: payload.organizationId,
      teamId: payload.teamId
    };

    // Check permission
    const hasPermission = await checkPermission(user, resource, action);
    if (!hasPermission) {
      logger.warn('Permission denied', { 
        userId: user.id, 
        resource, 
        action 
      });
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Add user to request headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.id);
    requestHeaders.set('x-user-role', user.role.id);
    requestHeaders.set('x-organization-id', user.organizationId);
    if (user.teamId) {
      requestHeaders.set('x-team-id', user.teamId);
    }

    const modifiedRequest = new NextRequest(request.url, {
      method: request.method,
      headers: requestHeaders,
      body: request.body
    });

    // Execute handler
    return await handler(modifiedRequest, user);
  } catch (error) {
    logger.error('RBAC middleware error', { error });
    
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Get all permissions for a specific role
 * @param roleId - Role identifier
 * @returns Array of permissions for the role
 */
export function getRolePermissions(roleId: string): Permission[] {
  const role = ROLES[roleId];
  return role?.permissions || [];
}

/**
 * Check if user can impersonate another user
 * @param currentUser - User attempting to impersonate
 * @param targetUser - User to be impersonated
 * @returns boolean - True if impersonation is allowed
 */
export function canImpersonate(currentUser: UserWithRole, targetUser: UserWithRole): boolean {
  // Only super admins can impersonate
  if (currentUser.role.id !== 'super_admin') {
    return false;
  }

  // Cannot impersonate other super admins
  if (targetUser.role.id === 'super_admin') {
    return false;
  }

  return true;
}

/**
 * Audit log context type
 */
export type AuditLogContext = Record<string, unknown>;

/**
 * Generate audit log entry for permission checks
 * @param userId - User ID
 * @param resource - Resource type
 * @param action - Action attempted
 * @param granted - Whether permission was granted
 * @param context - Additional context data
 */
export function createPermissionAuditLog(
  userId: string,
  resource: ResourceType,
  action: ActionType,
  granted: boolean,
  context?: AuditLogContext
): void {
  logger.info('Permission audit log', {
    type: 'permission_audit',
    userId,
    resource,
    action,
    granted,
    timestamp: new Date().toISOString(),
    ...context
  });
}