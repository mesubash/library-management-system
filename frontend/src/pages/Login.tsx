import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, role, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for success message from registration
  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      // Clear the state to prevent showing the message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Handle navigation after authentication
  useEffect(() => {
    if (isAuthenticated && role) {
      const from = location.state?.from?.pathname || (role === "admin" ? "/admin-dashboard" : "/dashboard");
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, role, navigate, location.state]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(""); // Clear success message when attempting login
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.error) {
        setError(result.error);
      } else {
        // Login successful, navigation will be handled by useEffect
        // Don't navigate here, let the useEffect handle it when role is available
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTestLogin = async (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
    setError("");
    setSuccess("");
    setIsLoading(true);
    
    try {
      const result = await login(testEmail, testPassword);
      
      if (result.error) {
        setError(result.error);
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 flex flex-col items-center">
          <div className="mb-2">
            <Logo />
          </div>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {success && (
              <div className="text-sm text-green-600 text-center">
                {success}
              </div>
            )}
            {error && (
              <div className="text-sm text-red-600 text-center">
                {error}
              </div>
            )}
            
            {/* Test Credentials Section */}
            <div className="pt-4 border-t">
              <div className="text-sm text-muted-foreground text-center mb-3">
                Quick Test Access
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={() => handleTestLogin("user@lms.com", "password123")}
                  disabled={isLoading}
                  className="text-xs"
                >
                  Test User
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={() => handleTestLogin("admin@lms.com", "admin123")}
                  disabled={isLoading}
                  className="text-xs"
                >
                  Test Admin
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register here
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
