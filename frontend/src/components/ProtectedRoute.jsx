import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles }) {
  // Fetch the role of the user from localStorage or a global state
  const currentRole = localStorage.getItem('role');
  const accessToken = localStorage.getItem('accessToken'); // Assuming you're storing the JWT token

  if (!accessToken) {
    // If no token, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    // Clear session (log out the user)
    localStorage.removeItem('role');
    localStorage.removeItem('accessToken');
    
    // Redirect to unauthorized page (force navigation)
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />; // Renders the protected page if the role is allowed
}
