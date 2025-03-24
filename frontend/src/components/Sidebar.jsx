import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Sidebar() {
  const [currentRole, setCurrentRole] = useState(null);

  return (
    <div className="sidebar border-r h-screen flex flex-col">
      {/* Profile Section */}
      <div className="p-4 border-b">
        {!currentRole ? (
          <div className="space-y-3">
            <button
              onClick={() => setCurrentRole('admin')}
              className="btn-secondary w-full"
            >
              Login as Admin
            </button>
            <button
              onClick={() => setCurrentRole('user')}
              className="btn-primary w-full"
            >
              Login as User
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div
              className={`w-16 h-16 rounded-full text-white flex items-center justify-center text-2xl mb-3 ${
                currentRole === 'admin' ? 'bg-purple-600' : 'bg-blue-600'
              }`}
            >
              {currentRole === 'admin' ? 'A' : 'U'}
            </div>
            <h3 className="font-medium">
              {currentRole === 'admin' ? 'Administrator' : 'Library Member'}
            </h3>
            <button
              onClick={() => setCurrentRole(null)}
              className="mt-2 text-sm text-blue-600 dark:text-red-400 hover:underline"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="p-4 flex-1">
        {!currentRole ? (
          <Link to="/" className="sidebar-link">🏠 Home</Link>
        ) : currentRole === 'admin' ? (
          <Link to="/admin-dashboard" className="sidebar-link">📊 Admin Dashboard</Link>
        ) : (
          <Link to="/user-dashboard" className="sidebar-link">📊 My Dashboard</Link>
        )}
        <Link to="/books" className="sidebar-link">📚 Books</Link>
        {!currentRole && (
          <Link to="/about-us" className="sidebar-link">ℹ️ About Us</Link>
        )}
        {!currentRole && (
          <Link to="/contact-us" className="sidebar-link">📧 Contact Us</Link>
        )}
        {currentRole && (
          <Link to="/profile" className="sidebar-link">👤 Profile</Link>
        )}
        {currentRole === 'admin' && (
          <Link to="/admin-tools" className="sidebar-link">⚙️ Admin Tools</Link>
        )}
      </div>
    </div>
  );
}