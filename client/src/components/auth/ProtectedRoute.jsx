import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

function ProtectedRoute({ children, roles = [] }) {
  const { loading, loggedIn, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="route-loading">Loading dashboard...</div>;
  }

  if (!loggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default React.memo(ProtectedRoute);
