import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../services/AuthService';

const ProtectedRoute = ({ roles }) => {
  const currentUser = AuthService.getCurrentUser();

  if (!currentUser) {
    // not logged in so redirect to login page with the return url
    return <Navigate to="/login" />;
  }

  // check if route is restricted by role
  if (roles && roles.length > 0 && !roles.some(role => currentUser.roles.includes(role))) {
    // role not authorized so redirect to home page
    return <Navigate to="/" />;
  }

  // authorized so return outlet for child routes
  return <Outlet />;
};

export default ProtectedRoute;
