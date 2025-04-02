import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function Unauthorized() {
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  useEffect(() => {
    // Clear session when the user lands on the Unauthorized page
    localStorage.removeItem('role');
    localStorage.removeItem('accessToken');

    // Set a timeout to redirect after a brief delay
    setTimeout(() => {
      setRedirectToLogin(true);
    }, 2000); // Redirect after 2 seconds
  }, []);

  if (redirectToLogin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">403 - Forbidden</h1>
        <p className="mt-4 text-xl text-gray-600">You do not have permission to access this page.</p>
        <p className="mt-6">Redirecting you to the login page...</p>
      </div>
    </div>
  );
}
