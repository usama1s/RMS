import { Routes, Route, Navigate } from "react-router-dom";
import { RequireAuth } from "../components/protectedroute";
import { ROUTES } from "../utils/routes";
import { useCtx } from "../context/Ctx";
import { Manager } from "./manager";
import { Waiter } from "./waiter";
import { Admin } from "./admin";
import { ROLES } from "../utils/roles";
import Login from "./shared/Login";

export function Router() {
  const { authStatus, authenticatedUser } = useCtx();

  return (
    <>
      {authStatus && (
        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to={
                  !authenticatedUser
                    ? `/global-signin`
                    : `/${authenticatedUser.toLowerCase()}`
                }
              />
            }
          />
          <Route element={<h1>Unauthorized</h1>} path="/unauthorized" />
          <Route
            element={
              !authenticatedUser ? (
                <Login />
              ) : (
                <Navigate to={`/${authenticatedUser?.toLowerCase()}`} />
              )
            }
            path="/global-signin"
          />

          <Route element={<RequireAuth roles={[ROLES.ADMIN]} />}>
            <Route element={<Admin />} path={ROUTES.admin} />
          </Route>
          <Route element={<RequireAuth roles={[ROLES.MANAGER]} />}>
            <Route element={<Manager />} path={ROUTES.manager} />
          </Route>
          <Route element={<RequireAuth roles={[ROLES.WAITER]} />}>
            <Route element={<Waiter />} path={ROUTES.waiter} />
          </Route>
        </Routes>
      )}
    </>
  );
}
