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
    role: 'student', // Default role
    studentId: '', // Student-specific
    institution: '', // Student-specific
    occupation: '', // Other-specific
    affiliation: '', // Other-specific
  });
  const [showPassword, setShowPassword] = useState(false); // For password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // For confirm password visibility

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleKeyPress = (e) => {
    // Allow only numbers for phone field
    if (e.target.name === 'phone' && !/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
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
      role: 'student',
      studentId: '',
      institution: '',
      occupation: '',
      affiliation: '',
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setPage(1); // Reset to first page
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl h-fit border border-gray-200">
        {/* Header visible on both pages */}
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

        {/* Scrollable Form Section */}
        <div className="max-h-[50vh] overflow-y-auto">
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
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
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
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                    <div className="mt-2 flex items-center">
                      <input
                        type="checkbox"
                        id="showConfirmPassword"
                        checked={showConfirmPassword}
                        onChange={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="h-4 w-4 text-green-600 focus:ring-green-400 border-gray-300 rounded"
                      />
                      <label htmlFor="showConfirmPassword" className="ml-2 text-sm text-gray-600">
                        Show Confirm Password
                      </label>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                      required
                    >
                      <option value="student">Student</option>
                      <option value="other">Other (Faculty, Staff, Public Member, etc.)</option>
                    </select>
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
                      onKeyPress={handleKeyPress} // Restrict to numbers
                      pattern="[0-9]*" // Enforce numbers
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
                      rows="2"
                      required
                    />
                  </div>
                  {formData.role === 'student' ? (
                    <>
                      <div>
                        <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                          Student ID
                        </label>
                        <input
                          type="text"
                          id="studentId"
                          name="studentId"
                          value={formData.studentId}
                          onChange={handleChange}
                          className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                          placeholder="e.g., S123456"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                          Institution
                        </label>
                        <input
                          type="text"
                          id="institution"
                          name="institution"
                          value={formData.institution}
                          onChange={handleChange}
                          className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                          placeholder="e.g., University of Booktown"
                          required
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
                          Occupation
                        </label>
                        <input
                          type="text"
                          id="occupation"
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleChange}
                          className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                          placeholder="e.g., Teacher, Librarian, etc."
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700">
                          Affiliation
                        </label>
                        <input
                          type="text"
                          id="affiliation"
                          name="affiliation"
                          value={formData.affiliation}
                          onChange={handleChange}
                          className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                          placeholder="e.g., Booktown Public Library"
                          required
                        />
                      </div>
                    </>
                  )}
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
        </div>

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