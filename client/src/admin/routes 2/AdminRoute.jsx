import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

export default function AdminRoute({ children }) {
  const location = useLocation();
  const { loading, loggedIn } = useAuth();

  if (loading) return null;

  if (!loggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
