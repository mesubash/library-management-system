import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/guest/Home";
import Books from "./pages/Books";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import Profile from "./pages/Profile";
import AboutUs from "./pages/guest/AboutUs";
import ContactUs from "./pages/guest/ContactUs";
import AdminTools from "./pages/admin/AdminTools";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/auth/Unauthorized";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Pages (No Layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Public & Protected Routes Inside Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-tools" element={<AdminTools />} />
          </Route>

          {/* User Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
