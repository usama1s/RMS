import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useCtx } from "../context/Ctx";

export const RequireAuth = ({ roles }) => {
  const { authenticatedUser } = useCtx();

  return authenticatedUser && roles?.includes(authenticatedUser?.role) ? (
    <Outlet />
  ) : (
    <Navigate to={`/${roles[0].toLowerCase()}/login`} />
  );
};
