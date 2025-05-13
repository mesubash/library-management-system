
import React, { createContext, useContext, useEffect, useState } from "react";

export type UserRole = "admin" | "user" | null;

interface AuthContextType {
  role: UserRole;
  isAuthenticated: boolean;
  login: (role: UserRole, username: string) => void;
  logout: () => void;
  username: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Load from localStorage on initial render
    const savedRole = localStorage.getItem("role") as UserRole;
    const savedUsername = localStorage.getItem("username");
    
    if (savedRole) {
      setRole(savedRole);
      setIsAuthenticated(true);
    }
    
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const login = (newRole: UserRole, newUsername: string) => {
    if (!newRole) return;
    
    setRole(newRole);
    setUsername(newUsername);
    setIsAuthenticated(true);
    
    localStorage.setItem("role", newRole);
    localStorage.setItem("username", newUsername);
  };

  const logout = () => {
    setRole(null);
    setUsername(null);
    setIsAuthenticated(false);
    
    localStorage.removeItem("role");
    localStorage.removeItem("username");
  };

  return (
    <AuthContext.Provider value={{ role, isAuthenticated, login, logout, username }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
