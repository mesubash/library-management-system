import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Eye, EyeOff, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Forgot password state
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  
  const { login, resetPassword, role, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Check for success message from registration or email confirmation
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const confirmed = urlParams.get('confirmed');
    
    if (confirmed === 'true') {
      setSuccess("Email confirmed successfully! You can now log in to your account.");
      // Clean up URL
      navigate(location.pathname, { replace: true });
    } else if (location.state?.message) {
      setSuccess(location.state.message);
      // Clear the state to prevent showing the message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location, navigate]);

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
        toast({
          title: "Login Failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        // Login successful, navigation will be handled by useEffect
        toast({
          title: "Login Successful",
          description: "Welcome back! You have been logged in successfully.",
        });
      }
    } catch (error) {
      setError("An unexpected error occurred");
      toast({
        title: "Login Error",
        description: "An unexpected error occurred during login.",
        variant: "destructive",
      });
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");
    
    if (!resetEmail) {
      setResetError("Please enter your email address");
      return;
    }
    
    setIsResetting(true);
    
    try {
      const result = await resetPassword(resetEmail);
      
      if (result.error) {
        setResetError(result.error);
        toast({
          title: "Reset Failed",
          description: result.error,
          variant: "destructive",
        });
      } else if (result.success) {
        setResetSuccess("Password reset link sent! You will receive an email if this account is registered with us.");
        toast({
          title: "Reset Link Sent",
          description: "Password reset link sent! You will receive an email if this account is registered with us.",
        });
        setTimeout(() => {
          setIsForgotPasswordOpen(false);
          setResetEmail("");
          setResetError("");
          setResetSuccess("");
        }, 4000);
      }
    } catch (error) {
      setResetError("An unexpected error occurred");
      toast({
        title: "Reset Error",
        description: "An unexpected error occurred while sending the reset link.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
                <DialogTrigger asChild>
                  <Button variant="link" className="text-sm p-0 h-auto">
                    Forgot password?
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>
                      Enter your email address and we'll send you a link to reset your password.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleForgotPassword}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reset-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="reset-email"
                            type="email"
                            placeholder="Enter your email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      
                      {resetSuccess && (
                        <div className="text-sm text-green-600 text-center p-3 bg-green-50 rounded-md">
                          {resetSuccess}
                        </div>
                      )}
                      {resetError && (
                        <div className="text-sm text-red-600 text-center p-3 bg-red-50 rounded-md">
                          {resetError}
                        </div>
                      )}
                    </div>
                    
                    <DialogFooter className="mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsForgotPasswordOpen(false)}
                        disabled={isResetting}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isResetting}>
                        {isResetting ? "Sending..." : "Send Reset Link"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
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
              <div className="flex justify-center">
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={() => handleTestLogin("admin@lms.com", "password")}
                  disabled={isLoading}
                  className="text-xs"
                >
                  Test Admin Login
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
