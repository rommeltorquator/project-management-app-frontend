import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PublicRoute: React.FC = () => {
  const { token } = React.useContext(AuthContext);
  const location = useLocation();

  if (token) {
    // If the user is authenticated, redirect them to the home page or previous page
    const from = (location.state as { from?: Location })?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
