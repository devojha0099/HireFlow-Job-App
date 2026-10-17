import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader.jsx";


const ProtectedRoute = ({ role }) => {
  const { user, initializing } = useSelector((state) => state.auth);

  if (initializing) return <Loader text="Checking your session..." />;

  if (!user) return <Navigate to={`/${role}/login`} replace />;

  if (user.role !== role) return <Navigate to={`/${user.role}`} replace />;

  return <Outlet />;
};

export default ProtectedRoute;
