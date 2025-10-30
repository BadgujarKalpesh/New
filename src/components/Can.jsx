// src/components/Can.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { userHasPermission, userHasAnyPermission, userHasAllPermissions } from '../utils/permissions';

/**
 * Permission wrapper component
 * 
 * Usage examples:
 * 
 * 1. Single permission:
 *    <Can perform="tenant.management">
 *      <button>Manage Tenants</button>
 *    </Can>
 * 
 * 2. Multiple permissions (ANY):
 *    <Can performAny={['user.subadmin.create', 'user.superadmin.create']}>
 *      <button>Create User</button>
 *    </Can>
 * 
 * 3. Multiple permissions (ALL):
 *    <Can performAll={['tenant.management', 'user.superadmin.create']}>
 *      <button>Advanced Action</button>
 *    </Can>
 * 
 * 4. Fallback for no permission:
 *    <Can perform="tenant.management" fallback={<p>No access</p>}>
 *      <button>Manage Tenants</button>
 *    </Can>
 */
const Can = ({ 
  perform, 
  performAny, 
  performAll, 
  fallback = null, 
  children 
}) => {
  const { user } = useAuth();

  let hasPermission = false;

  if (perform) {
    // Single permission check
    hasPermission = userHasPermission(user, perform);
  } else if (performAny && Array.isArray(performAny)) {
    // Check if user has ANY of the permissions
    hasPermission = userHasAnyPermission(user, performAny);
  } else if (performAll && Array.isArray(performAll)) {
    // Check if user has ALL of the permissions
    hasPermission = userHasAllPermissions(user, performAll);
  }

  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

export default Can;