import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

export function RequireAdmin({ children }: { children: ReactNode }) {
  const location = useLocation();
  const token = localStorage.getItem('bb_admin_token');

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}