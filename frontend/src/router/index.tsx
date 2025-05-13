
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AdminDashboard from "@/pages/AdminDashboard";
import UserDashboard from "@/pages/UserDashboard";
import Books from "@/pages/Books";
import Profile from "@/pages/Profile";
import AdminTools from "@/pages/AdminTools";
import AboutUs from "@/pages/AboutUs";
import ContactUs from "@/pages/ContactUs";
import NotFound from "@/pages/NotFound";
import { useAuth } from "@/context/AuthContext";

export default function AppRouter() {
  const { isAuthenticated, role } = useAuth();
  
  // Protected route component
  const ProtectedRoute = ({ 
    children, 
    allowedRoles, 
    redirectPath = "/login" 
  }: { 
    children: React.ReactNode, 
    allowedRoles?: string[], 
    redirectPath?: string 
  }) => {
    if (!isAuthenticated) {
      return <Navigate to={redirectPath} replace />;
    }
    
    if (allowedRoles && !allowedRoles.includes(role as string)) {
      return <Navigate to="/" replace />;
    }
    
    return <>{children}</>;
  };

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/books" element={<Books />} />
        
        {/* Protected Routes */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        <Route path="/admin-dashboard" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admin-tools" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminTools />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserDashboard />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* Auth Routes - outside main layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
