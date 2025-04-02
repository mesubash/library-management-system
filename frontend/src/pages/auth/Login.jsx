import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    identifierType: "email",
    rememberMe: false,
  });

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleKeyPress = (e) => {
    if (formData.identifierType === "phone" && !/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowError(false);
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password,
          identifierType: formData.identifierType,
          rememberMe: formData.rememberMe,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("role", data.role);

        const redirectPath =
          location.state?.from || (data.role === "ADMIN" ? "/admin-dashboard" : "/user-dashboard");
        navigate(redirectPath);
      } else {
        setShowError(true);
        setShake(true);
        setErrorMessage(data.message || "Invalid credentials");

        setTimeout(() => {
          setShowError(false);
          setShake(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Login Error:", error);
      setLoading(false);
      setShowError(true);
      setShake(true);
      setErrorMessage("Server error. Please try again.");
    }
  };

  const handleSocialLogin = (provider) => {
    // Implement social login logic here
    window.location.href = `http://localhost:8080/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-gray-50 p-4">
      {showError && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-red-600 text-white rounded-md shadow-lg animate-slide-in-right">
          {errorMessage}
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Log in to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Identifier Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Login with
            </label>
            <div className="flex">
              <select
                name="identifierType"
                value={formData.identifierType}
                onChange={handleChange}
                className="p-3 rounded-l-lg border border-r-0 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 text-gray-700"
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="username">Username</option>
              </select>
              <input
                type={formData.identifierType === "email" ? "email" : "text"}
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                pattern={formData.identifierType === "phone" ? "[0-9]*" : undefined}
                className={`flex-1 p-3 rounded-r-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 ${
                  shake ? "animate-shake" : ""
                }`}
                placeholder={
                  formData.identifierType === "email"
                    ? "john.doe@example.com"
                    : formData.identifierType === "phone"
                    ? "1234567890"
                    : "YourUsername"
                }
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 ${
                  shake ? "animate-shake" : ""
                }`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-green-500 focus:ring-green-400 rounded"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm text-green-600 hover:text-red-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors focus:outline-none ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Log In"
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
            >
              <FaGoogle className="h-5 w-5 text-red-500" />
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("facebook")}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
            >
              <FaFacebook className="h-5 w-5 text-blue-600" />
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("github")}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
            >
              <FaGithub className="h-5 w-5 text-gray-800" />
            </button>
          </div>
        </form>

        {/* Registration Link */}
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-green-600 hover:text-green-700 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}