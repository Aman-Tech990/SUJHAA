import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem("sujhaa-user"));
    const role = localStorage.getItem("sujhaa-role");

    // Not logged in
    if (!user || !role) {
        return <Navigate to="/login" replace />;
    }

    // Role NOT allowed
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
