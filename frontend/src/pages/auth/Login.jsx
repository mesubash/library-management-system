import React, { useState } from 'react';

export default function Login() {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    identifierType: 'email', // Default to email
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [shake, setShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleKeyPress = (e) => {
    // Allow only numbers when identifierType is 'phone'
    if (formData.identifierType === 'phone' && !/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login logic (replace with real API call)
    const { identifier, password, identifierType } = formData;
    const isAuthorized =
      (identifierType === 'email' && identifier === 'user@example.com' && password === 'password123') ||
      (identifierType === 'phone' && identifier === '1234567890' && password === 'password123');

    if (isAuthorized) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // Auto-close after 3 seconds
    } else {
      setShowError(true);
      setShake(true);
      setFormData({ identifier: '', password: '', identifierType: 'email' }); // Clear fields
      setTimeout(() => {
        setShowError(false);
        setShake(false);
      }, 3000); // Stop error and shake after 3 seconds
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-white">
      {/* Success Alert */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-green-600 text-white rounded-md shadow-lg animate-slide-in-right">
          Login successful! Welcome back to the Library.
        </div>
      )}

      {/* Error Alert */}
      {showError && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-red-600 text-white rounded-md shadow-lg animate-slide-in-right">
          Unauthorized: Invalid {formData.identifierType} or password.
        </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg h-fit border border-gray-200">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Welcome Back
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Log in to access your library account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                Email or Phone Number
              </label>
              <div className="flex mt-1">
                <select
                  name="identifierType"
                  value={formData.identifierType}
                  onChange={handleChange}
                  className="p-3 rounded-l-md border border-r-0 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-gray-50"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                </select>
                <input
                  type={formData.identifierType === 'email' ? 'email' : 'tel'}
                  id="identifier"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress} // Restrict to numbers for phone
                  pattern={formData.identifierType === 'phone' ? '[0-9]*' : undefined} // Enforce numbers for phone
                  className={`flex-1 p-3 rounded-r-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent ${
                    shake ? 'animate-shake' : ''
                  }`}
                  placeholder={formData.identifierType === 'email' ? 'john.doe@example.com' : '(123) 456-7890'}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent ${
                  shake ? 'animate-shake' : ''
                }`}
                placeholder="••••••••"
                required
              />
              <div className="mt-2 flex items-center">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="h-4 w-4 text-green-600 focus:ring-green-400 border-gray-300 rounded"
                />
                <label htmlFor="showPassword" className="ml-2 text-sm text-gray-600">
                  Show Password
                </label>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
          >
            Log In
          </button>
        </form>

        {/* Accent Links */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <a href="/register" className="text-purple-500 hover:text-purple-600 font-medium">
            Register here
          </a>
        </p>
        <p className="mt-2 text-center text-sm text-gray-600">
          Forgot password?{' '}
          <a href="/forgot-password" className="text-purple-500 hover:text-purple-600 font-medium">
            Reset it
          </a>
        </p>

        {/* Light Green Accent */}
        <div className="mt-6 text-center">
          <span className="inline-block px-3 py-1 text-xs font-medium text-green-800 bg-lightgreen-100 rounded-full">
            Secure Login
          </span>
        </div>
      </div>
    </div>
  );
}