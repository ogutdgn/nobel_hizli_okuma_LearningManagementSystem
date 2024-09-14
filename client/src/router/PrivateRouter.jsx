import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouter = ({ userType }) => {
  const { user } = useSelector((state) => state.auth);


  if (!user) {
    return <Navigate to="/" />;
  }

  if (!user.isActive) {
    return <Navigate to="/banned" />;
  }
  
  return <Outlet />;
};

export default PrivateRouter;
