import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoadingState } from "./DataState";
import { useClientAuth } from "../hooks/useClientAuth";

export default function ProtectedClientRoute() {
  const { user, loading } = useClientAuth();
  const location = useLocation();
  if (loading) return <LoadingState label="Checking your account" />;
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}
