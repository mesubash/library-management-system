import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const [currentRole, setCurrentRole] = useState(null);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    if (role) {
      setCurrentRole(role);
      setUserName(name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    setCurrentRole(null);
    setUserName('');
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="sidebar fixed top-0 left-0 h-full w-64 bg-white shadow-md mt-16">
      {/* Sidebar content */}
      <div className="p-4 border-b flex flex-col items-center">
        {currentRole ? (
          <div className="flex flex-col items-center">
            <div
              className={`w-16 h-16 rounded-full text-white flex items-center justify-center text-2xl mb-3 ${
                currentRole === 'admin' ? 'bg-purple-600' : 'bg-blue-600'
              }`}
            >
              {currentRole === 'admin' ? 'A' : 'U'}
            </div>
            <h3 className="font-medium text-center text-gray-800">
              {userName || (currentRole === 'admin' ? 'Administrator' : 'Library Member')}
            </h3>
            <button
              onClick={handleLogout}
              className="mt-2 text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleLoginRedirect}
              className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Login
            </button>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="p-4 flex-1 space-y-2">
        <Link to="/" className="sidebar-link">🏠 Home</Link>
        {currentRole === 'admin' && (
          <>
            <Link to="/admin-dashboard" className="sidebar-link">📊 Admin Dashboard</Link>
            <Link to="/admin-tools" className="sidebar-link">⚙️ Admin Tools</Link>
          </>
        )}
        {currentRole === 'user' && (
          <Link to="/user-dashboard" className="sidebar-link">📊 My Dashboard</Link>
        )}
        <Link to="/books" className="sidebar-link">📚 Books</Link>
        {!currentRole && (
          <>
            <Link to="/about-us" className="sidebar-link">ℹ️ About Us</Link>
            <Link to="/contact-us" className="sidebar-link">📧 Contact Us</Link>
          </>
        )}
        {currentRole && <Link to="/profile" className="sidebar-link">👤 Profile</Link>}
      </div>
    </div>
  );
}
