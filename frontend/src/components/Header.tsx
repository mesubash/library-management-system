import React from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/UserAvatar";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onSidebarMenuClick?: () => void;
  sidebarExpanded?: boolean;
  windowWidth?: number;
  sidebarWidth?: number;
}

export function Header({ onSidebarMenuClick, sidebarExpanded, windowWidth = 1024, sidebarWidth = 250 }: HeaderProps) {
  const { isAuthenticated, logout, username, role } = useAuth();

  // Responsive style: on mobile, no margin; on desktop, marginLeft = sidebarWidth
  const headerStyle =
    windowWidth >= 768
      ? { left: sidebarWidth, right: 0, width: `calc(100% - ${sidebarWidth}px)` }
      : { left: 0, right: 0, width: '100%' };

  return (
    <header
      className="h-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30 fixed top-0 flex items-center shadow-sm transition-all duration-200"
      style={headerStyle}
    >
      <div className="container flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {/* Sidebar expand/collapse button */}
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={onSidebarMenuClick}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Logo className="block" />
          <div className="hidden md:flex ml-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search library..." 
                className="w-[200px] lg:w-[300px] pl-8 rounded-full bg-muted"
              />
            </div>
          </div>
        </div>
        {/* Rightmost: Profile info, ThemeToggle, then avatar dropdown */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          {isAuthenticated && (
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-medium">{username}</span>
              <span className="text-xs text-muted-foreground capitalize">{role} Account</span>
            </div>
          )}
          <ThemeToggle />
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full ml-2">
                  <UserAvatar />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <a href="/profile">Profile</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/settings">Settings</a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="default"
              size="sm" 
              className="rounded-full px-4 bg-lms-green hover:bg-lms-green-dark shadow-sm hover:shadow transition-all"
              onClick={() => window.location.href = "/login"}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
