import Sidebar from "../components/Sidebar";
import Navbar from "../components/TopBar";
import StatsCard from "../components/StatsCard";
import { useState } from "react";

export default function Dashboard() {
  const [role, setRole] = useState("guest"); // Change to 'librarian' or 'customer' after login

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role={role} />
      <div className="flex-1">
        <Navbar role={role} setRole={setRole} />
        <main className="p-6">
          {role === "librarian" && <h2 className="text-2xl font-bold">Dashboard</h2>}
          {role === "customer" && <h2 className="text-2xl font-bold">Dashboard</h2>}
          {role === "guest" && <h2 className="text-2xl font-bold">Welcome to Library System</h2>}
          <div className="grid grid-cols-3 gap-6 mt-6">
            <StatsCard title="Total Books" value="1245" />
            <StatsCard title="Borrowed Today" value="56" />
            <StatsCard title="Members" value="300" />
          </div>
        </main>
      </div>
    </div>
  );
}
