import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api, session } from '../../lib/api.js';
import { ROLE_HOME, dashboardPath } from '../../config/access.js';

export { dashboardPath } from '../../config/access.js';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const restoreSession = useCallback(async (signal) => {
    setLoading(true);
    setError('');
    try {
      if (session.get()) {
        const profile = await api('/auth/me', { signal });
        if (!Object.hasOwn(ROLE_HOME, profile.role)) {
          session.clear();
          throw new Error('This account has an unsupported access level.');
        }
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch (failure) {
      if (failure.name !== 'AbortError' && failure.status !== 401) {
        setError(failure.message);
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const expired = () => setUser(null);
    window.addEventListener('session-expired', expired);
    restoreSession(controller.signal);
    return () => {
      controller.abort();
      window.removeEventListener('session-expired', expired);
    };
  }, [restoreSession]);

  function authenticate(data) {
    if (!Object.hasOwn(ROLE_HOME, data.user?.role)) {
      throw new Error('This account has an unsupported access level.');
    }
    session.set(data.token);
    setUser(data.user);
    setError('');
  }

  function logout() {
    session.clear();
    setUser(null);
    setError('');
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, error, retry: restoreSession, authenticate, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export function RequireAuth({ roles, children }) {
  const { user, loading, error, retry } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="px-6 py-24 text-center" role="status">
        Loading your workspace…
      </div>
    );
  }
  if (error) {
    return (
      <div className="px-6 py-24 text-center">
        <p role="alert">{error}</p>
        <button
          className="mt-4 rounded-lg bg-blue-600 px-5 py-3 text-white"
          onClick={() => retry()}
        >
          Retry connection
        </button>
      </div>
    );
  }
  if (!user) {
    const destination = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${destination}`} replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={dashboardPath(user.role)} replace />;
  }
  return children;
}
