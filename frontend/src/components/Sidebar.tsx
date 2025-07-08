import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { 
  Book,
  Contact, 
  Home, 
  Info, 
  LayoutDashboard, 
  LogIn, 
  Settings, 
  User,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface SidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  expanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
}

export function Sidebar({ open, onOpenChange, expanded = true, onExpandChange }: SidebarProps) {
  const { isAuthenticated, role } = useAuth();

  // Define navigation items based on role
  const getNavItems = () => {
    if (!isAuthenticated) {
      return [
        { href: "/", label: "Home", icon: Home },
        { href: "/about", label: "About Us", icon: Info },
        { href: "/contact", label: "Contact Us", icon: Contact },
      ];
    }
    
    if (role === "admin") {
      return [
        { href: "/", label: "Home", icon: Home },
        { href: "/admin-dashboard", label: "Admin Dashboard", icon: LayoutDashboard },
        { href: "/admin-tools", label: "Admin Tools", icon: Settings },
        { href: "/books", label: "Books", icon: Book },
        { href: "/profile", label: "Profile", icon: User },
      ];
    }
    
    // User role
    return [
      { href: "/", label: "Home", icon: Home },
      { href: "/dashboard", label: "My Dashboard", icon: LayoutDashboard },
      { href: "/books", label: "Books", icon: Book },
      { href: "/profile", label: "Profile", icon: User },
    ];
  };
  
  const navItems = getNavItems();

  // Sidebar content for both desktop and mobile
  const SidebarContent = ({ forceExpanded = false }: { forceExpanded?: boolean }) => (
    <div className="h-full flex flex-col py-4">
      <div className="flex items-center px-4 mb-6">
        <Logo iconOnly={!(forceExpanded || expanded)} />
      </div>
      <nav className="flex-1 flex flex-col gap-1 mt-2 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={() => onOpenChange?.(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors",
                isActive ? "bg-muted font-semibold" : "",
                (forceExpanded || expanded) ? "justify-start" : "justify-center"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {(forceExpanded || expanded) && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto px-2 pb-4">
        <Separator className="my-4" />
        {!isAuthenticated && (
          <div className="space-y-2">
            <Button
              variant="default"
              size="sm"
              className="w-full bg-lms-green hover:bg-lms-green-dark flex items-center gap-2 justify-center"
              asChild
            >
              <NavLink to="/login" onClick={() => onOpenChange?.(false)}>
                <LogIn className="h-4 w-4" />
                {(forceExpanded || expanded) && <span>Login</span>}
              </NavLink>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center"
              asChild
            >
              <NavLink to="/register" onClick={() => onOpenChange?.(false)}>
                {(forceExpanded || expanded) && <span>Register</span>}
              </NavLink>
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar (Sheet component) */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-[250px] p-0 border-r md:hidden">
          <SidebarContent forceExpanded />
        </SheetContent>
      </Sheet>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "h-screen fixed left-0 top-0 z-30 border-r bg-background overflow-y-auto flex flex-col transition-all duration-300",
          expanded ? "w-[250px]" : "w-16",
          "hidden md:flex"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
