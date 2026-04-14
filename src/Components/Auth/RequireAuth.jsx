import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";

function RequireAuth({ allowedRoles }) {
  const { isLoggedIn, role } = useSelector((state) => state.auth);

  // Debug logs to ensure the role is what you expect
  console.log("RequireAuth: isLoggedIn =", isLoggedIn, "role =", role);
  console.log("RequireAuth: allowedRoles =", allowedRoles);

  return isLoggedIn && allowedRoles.includes(role) ? (
    <Outlet />
  ) : isLoggedIn ? (
    <Navigate to="/denied" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}

RequireAuth.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RequireAuth;