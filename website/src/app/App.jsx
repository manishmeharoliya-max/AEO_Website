import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './AppRoutes.jsx';
import { AuthProvider } from '../features/auth/AuthContext.jsx';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
