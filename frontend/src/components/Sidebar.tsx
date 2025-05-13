
import React from "react";
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
  X 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface SidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
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

  // Sidebar content that's used in both desktop and mobile versions
  const SidebarContent = () => (
    <div className="h-full flex flex-col py-4">
      <div className="px-4 mb-6">
        <Logo />
      </div>
      
      <nav className="space-y-1 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={() => onOpenChange?.(false)}
            className={({ isActive }) => 
              cn("sidebar-link", isActive && "active")
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="mt-auto px-4">
        <Separator className="my-4" />
        {!isAuthenticated && (
          <div className="space-y-2">
            <Button 
              variant="default" 
              size="sm" 
              className="w-full bg-lms-green hover:bg-lms-green-dark flex items-center gap-2"
              asChild
            >
              <NavLink to="/login" onClick={() => onOpenChange?.(false)}>
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </NavLink>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              asChild
            >
              <NavLink to="/register" onClick={() => onOpenChange?.(false)}>
                <span>Register</span>
              </NavLink>
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  // Render different sidebar versions based on screen size
  return (
    <>
      {/* Mobile sidebar (Sheet component) */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-[250px] p-0 border-r">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className="w-[250px] fixed left-0 top-20 bottom-0 z-20 border-r bg-background overflow-y-auto hidden md:block">
        <SidebarContent />
      </aside>
    </>
  );
}
