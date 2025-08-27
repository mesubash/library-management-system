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
import Settings from "@/pages/Settings";
import AdminTools from "@/pages/AdminTools";
import AboutUs from "@/pages/AboutUs";
import ContactUs from "@/pages/ContactUs";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import CookiePolicy from "@/pages/CookiePolicy";
import NotFound from "@/pages/NotFound";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function AppRouter() {
  const { isAuthenticated, role } = useAuth();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/books" element={<Books />} />
        
        {/* Auth Routes - redirect if already authenticated */}
        <Route path="/login" element={
          isAuthenticated ? (
            role === "admin" ? <Navigate to="/admin-dashboard" replace /> : <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        } />
        <Route path="/register" element={
          isAuthenticated ? (
            role === "admin" ? <Navigate to="/admin-dashboard" replace /> : <Navigate to="/dashboard" replace />
          ) : (
            <Register />
          )
        } />
        
        {/* Protected Routes */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />

        <Route path="/admin-dashboard" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admin-tools" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminTools />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute requireAdmin={false}>
            {role === "admin" ? <Navigate to="/admin-dashboard" replace /> : <UserDashboard />}
          </ProtectedRoute>
        } />
        
        {/* Catch any admin users trying to access regular dashboard */}
        <Route path="/user-dashboard" element={
          <ProtectedRoute requireAdmin={false}>
            {role === "admin" ? <Navigate to="/admin-dashboard" replace /> : <UserDashboard />}
          </ProtectedRoute>
        } />

        {/* Footer Pages */}
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/cookies" element={<CookiePolicy />} />
      </Route>
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}