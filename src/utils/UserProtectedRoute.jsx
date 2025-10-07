import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/userStores";

function UserProtectedRoute() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />; 
}

export default UserProtectedRoute;