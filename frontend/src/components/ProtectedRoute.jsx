import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    const location = useLocation();

    if (!token) {
        // If not logged in, store the last attempted URL
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!allowedRoles.includes(role)) {
        // If role is not allowed, redirect to unauthorized page
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
