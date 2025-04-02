import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation(); // Get the previous route (if any)

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    identifierType: "email", // Default to email
  });

  const [showError, setShowError] = useState(false);
  const [shake, setShake] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

      if (response.ok) {
        // Store access token and user role in local storage
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("role", data.role);

        // Redirect logic:
        const redirectPath = location.state?.from || (data.role === "ADMIN" ? "/admin-dashboard" : "/user-dashboard");
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
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                Select Login Type & Enter Details
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
                  <option value="username">Username</option>
                </select>
                <input
                  type={formData.identifierType === "email" ? "email" : "text"}
                  id="identifier"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  pattern={formData.identifierType === "phone" ? "[0-9]*" : undefined}
                  className={`flex-1 p-3 rounded-r-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent ${
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
                className={`mt-1 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent ${
                  shake ? "animate-shake" : ""
                }`}
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
