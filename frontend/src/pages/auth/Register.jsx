import React, { useState } from 'react';

export default function Register() {
  const [page, setPage] = useState(1); // Page 1: Personal Info, Page 2: Library Info
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    userType: 'student', // Default value
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (page === 1 && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    setPage(2);
  };

  const handleBack = () => {
    setPage(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for registration logic (e.g., API call)
    console.log('Registration submitted:', formData);
    alert('Registration successful! Welcome to the Library.');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      address: '',
      userType: 'student',
    });
    setPage(1); // Reset to first page
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl h-fit border border-gray-200">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Register for Library Access
        </h1>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-6">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${page === 1 ? 'bg-green-600' : 'bg-gray-300'}`}>
            1
          </div>
          <div className="w-12 h-1 bg-gray-300 self-center mx-2"></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${page === 2 ? 'bg-green-600' : 'bg-gray-300'}`}>
            2
          </div>
        </div>

        {/* Form */}
        <form onSubmit={page === 2 ? handleSubmit : null} className="space-y-6">
          {page === 1 ? (
            <>
              {/* Page 1: Personal Info */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
              >
                Next
              </button>
            </>
          ) : (
            <>
              {/* Page 2: Library Info */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    placeholder="(123) 456-7890"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    placeholder="123 Library Lane, Booktown"
                    rows="2" // Reduced rows to fit
                    required
                  />
                </div>
                <div>
                  <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
                    User Type
                  </label>
                  <select
                    id="userType"
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    required
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="public">Public Member</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-1/2 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                >
                  Register
                </button>
              </div>
            </>
          )}
        </form>

        {/* Accent Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-purple-500 hover:text-purple-600 font-medium">
            Log in here
          </a>
        </p>

        {/* Light Green Accent */}
        <div className="mt-6 text-center">
          <span className="inline-block px-3 py-1 text-xs font-medium text-green-800 bg-lightgreen-100 rounded-full">
            Step {page} of 2
          </span>
        </div>
      </div>
    </div>
  );
}