import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../services/AuthService';

interface ProtectedRouteProps {
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles }) => {
  const currentUser = AuthService.getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && !roles.some(role => currentUser.roles?.includes(role))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
