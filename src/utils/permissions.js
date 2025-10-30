/**
 * Check if a user has a specific permission
 * 
 * CRITICAL RULE:
 * - platform_super_admin role has ALL permissions (even with empty features array)
 * - Other roles must have the feature in their features array
 * 
 * @param {Object} user - The user object from context
 * @param {string} featureCode - The feature code to check (e.g., 'tenant.management')
 * @returns {boolean} - True if user has permission
 */
export const userHasPermission = (user, featureCode) => {
  if (!user) return false;
  
  // Platform super admin has ALL permissions
  if (user.role === 'platform_super_admin') {
    return true;
  }
  
  // For all other roles, check the features array
  return user.features && user.features.includes(featureCode);
};

/**
 * Check if user has ANY of the provided permissions
 * 
 * @param {Object} user - The user object from context
 * @param {string[]} featureCodes - Array of feature codes to check
 * @returns {boolean} - True if user has at least one permission
 */
export const userHasAnyPermission = (user, featureCodes) => {
  if (!user) return false;
  
  if (user.role === 'platform_super_admin') {
    return true;
  }
  
  return featureCodes.some(code => 
    user.features && user.features.includes(code)
  );
};

/**
 * Check if user has ALL of the provided permissions
 * 
 * @param {Object} user - The user object from context
 * @param {string[]} featureCodes - Array of feature codes to check
 * @returns {boolean} - True if user has all permissions
 */
export const userHasAllPermissions = (user, featureCodes) => {
  if (!user) return false;
  
  if (user.role === 'platform_super_admin') {
    return true;
  }
  
  return featureCodes.every(code => 
    user.features && user.features.includes(code)
  );
};

/**
 * Permission feature codes constants
 */
export const PERMISSIONS = {
  TENANT_MANAGEMENT: 'tenant.management',
  CREATE_SUB_ADMIN: 'user.subadmin.create',
  CREATE_SUPER_ADMIN: 'user.superadmin.create',
};