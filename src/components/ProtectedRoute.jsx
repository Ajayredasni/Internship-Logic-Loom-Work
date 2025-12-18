// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "./store/authSlice";

function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();
  //  If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Save the attempted URL to redirect back after login
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  //  If authenticated, show the protected content
  return children;
}
export default ProtectedRoute;
