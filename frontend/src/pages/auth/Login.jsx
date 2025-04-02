import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation(); // Get previous route if any

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    identifierType: "email", // Default login type
  });

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Toggle state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("role", data.role);

        // Redirect based on role or previous attempted route
        const redirectPath =
          location.state?.from || (data.role === "ADMIN" ? "/admin-dashboard" : "/user-dashboard");
        navigate(redirectPath);
      } else {
        setShowError(true);
        setShake(true);
        setErrorMessage(data.message || "Invalid credentials");

        // Reset fields but keep identifierType selection
        setFormData({ ...formData, identifier: "", password: "" });

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

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-white">
      {showError && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-red-600 text-white rounded-md shadow-lg animate-slide-in-right">
          {errorMessage}
        </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg h-fit border border-gray-200">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Welcome Back
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Log in to access your library account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identifier Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Login Type & Enter Details
            </label>
            <div className="flex mt-1">
              <select
                name="identifierType"
                value={formData.identifierType}
                onChange={handleChange}
                className="p-3 rounded-l-md border border-r-0 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
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
                className={`flex-1 p-3 rounded-r-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 ${
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
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 ${
                shake ? "animate-shake" : ""
              }`}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Show Password Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="h-4 w-4 text-green-500 focus:ring-green-400"
            />
            <label htmlFor="showPassword" className="text-sm text-gray-700">
              Show Password
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className={`w-full py-3 rounded-md text-white transition-colors focus:outline-none ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
