import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ role, children }: { role: string, children: JSX.Element }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/" />;
    }

    const decodedToken = jwtDecode(token) as any;
    const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    if (userRole !== role) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute;
