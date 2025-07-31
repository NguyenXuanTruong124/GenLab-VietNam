import { Navigate } from "react-router-dom";

const ProtectedManagerRoute = ({ user, children }) => {
    if (!user) return <Navigate to="/signin" />;
    if (user.role === "Customer" || user.role === "Guest") {
        return <Navigate to="/" />;
    }
    return children;
};

export default ProtectedManagerRoute;