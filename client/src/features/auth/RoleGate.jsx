import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSafeUser } from './useSafeAuth';

export const RoleGate = ({ allowedRoles = [], children, fallback = null }) => {
  const { isLoaded, user } = useSafeUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sunset-500"></div>
      </div>
    );
  }

  const role = user?.publicMetadata?.role || 'admin';

  if (!allowedRoles.includes(role)) {
    if (fallback) return fallback;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleGate;
