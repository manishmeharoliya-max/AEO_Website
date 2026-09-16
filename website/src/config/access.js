export const ROLE_HOME = {
  user: '/account',
  admin: '/admin',
  superadmin: '/superadmin',
};

export function dashboardPath(role) {
  return ROLE_HOME[role] || '/login';
}

export function loginDestination(role, requestedPath) {
  const home = dashboardPath(role);
  if (typeof requestedPath !== 'string') return home;
  if (role === 'user' && /^\/checkout(?:\?|$)/.test(requestedPath)) {
    return requestedPath;
  }
  if (requestedPath === home || requestedPath.startsWith(`${home}/`)) {
    return requestedPath;
  }
  return home;
}
