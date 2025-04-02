import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen ">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 ml-64 mt-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

