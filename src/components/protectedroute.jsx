import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useCtx } from "../context/Ctx";

export const RequireAuth = ({ roles }) => {
  const { authenticatedUser } = useCtx();
  console.log({ authenticatedUser });
  console.log({ roles });

  return authenticatedUser && roles?.includes(authenticatedUser) ? (
    <Outlet />
  ) : (
    <Navigate to={"/global-signin"} />
  );
};
