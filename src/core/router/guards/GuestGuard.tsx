import type { ComponentChild } from "@/core/types/basic.type";
import { Navigate } from "react-router-dom";

export default function GuestGuard({ children }: ComponentChild) {

  const isAuthenticated = false;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}