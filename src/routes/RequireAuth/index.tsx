import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';

const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
