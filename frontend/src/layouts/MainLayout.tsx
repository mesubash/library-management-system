
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 pt-20">
        {/* Mobile sidebar toggle button */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-4 right-4 z-50 md:hidden bg-primary text-primary-foreground shadow-md rounded-full h-12 w-12"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>

        {/* Responsive sidebar */}
        <div className={`${sidebarOpen ? 'fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden' : 'hidden'}`} onClick={() => setSidebarOpen(false)} />
        <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
        
        {/* Main content - responsive padding */}
        <main className="flex-1 w-full transition-all duration-300 ease-in-out
          pb-8 pl-0 md:pl-[250px]">
          <div className="container p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
