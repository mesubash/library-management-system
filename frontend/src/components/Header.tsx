
import React from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/UserAvatar";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";

export function Header() {
  const { isAuthenticated, logout, username, role } = useAuth();

  return (
    <header className="h-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30 fixed top-0 left-0 right-0 shadow-sm transition-all duration-200">
      <div className="container flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Logo className="block" />
          <ThemeToggle />
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

        <div className="flex items-center gap-2 sm:gap-4">
          {isAuthenticated ? (
            <>
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium">{username}</span>
                <span className="text-xs text-muted-foreground capitalize">{role} Account</span>
              </div>
              <UserAvatar />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={logout}
                className="rounded-full hover:bg-muted/80 transition-colors"
                aria-label="Log out"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
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
