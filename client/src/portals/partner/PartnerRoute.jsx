import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

export default function PartnerRoute({ children }) {
  const location = useLocation();
  const { loading, loggedIn, role } = useAuth();

  if (loading) return null;

  if (!loggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Partners can access; admins can preview the portal
  if (role !== "partner" && role !== "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
