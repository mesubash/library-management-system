import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile
  const [sidebarExpanded, setSidebarExpanded] = useState(true); // for desktop
  const sidebarWidth = sidebarExpanded ? 250 : 64;
  const headerHeight = 80; // h-20 = 80px

  // Responsive marginLeft: 0 on mobile, sidebarWidth on md+
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handler for sidebar toggle in app bar
  const handleSidebarMenuClick = () => {
    if (windowWidth < 768) {
      setSidebarOpen(true);
    } else {
      setSidebarExpanded((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        onSidebarMenuClick={handleSidebarMenuClick}
        sidebarExpanded={sidebarExpanded}
        windowWidth={windowWidth}
        sidebarWidth={sidebarWidth}
      />
      <Sidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        expanded={sidebarExpanded}
        onExpandChange={setSidebarExpanded}
      />
      <div
        className="flex flex-col min-h-screen transition-all duration-300"
        style={{
          marginLeft: windowWidth >= 768 ? sidebarWidth : 0,
          paddingTop: headerHeight,
        }}
      >
        <main className="flex-1 w-full pb-8">
          <div className="container p-4 md:p-6">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
