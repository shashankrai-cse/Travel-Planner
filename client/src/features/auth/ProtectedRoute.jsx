import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSafeAuth } from './useSafeAuth';

export const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useSafeAuth();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sunset-500"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
