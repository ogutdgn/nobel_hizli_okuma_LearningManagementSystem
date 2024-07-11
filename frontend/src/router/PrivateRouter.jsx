import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouter = ({ isAdminRoute }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/" />;
  }

  if (!user.isActive) {
    // Kullanıcı banlıysa login sayfasına yönlendirilir.
    return <Navigate to="/banned" />;
  }

  if (isAdminRoute && !user.isAdmin) {
    // Kullanıcı admin değilse admin dashboard'a erişimi engellenir.
    return <Navigate to="/nobelhizliokuma" />;
  }

  if (!isAdminRoute && user.isAdmin) {
    // Admin kullanıcı normal kullanıcı dashboard'una erişmeye çalışıyorsa admin dashboard'a yönlendirilir.
    return <Navigate to="/nobelhizliokuma/admin-dashboard" />;
  }

  return <Outlet />;
};

export default PrivateRouter;
