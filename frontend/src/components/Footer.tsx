
import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Mail, Info, Home } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t py-6 md:py-8 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="flex flex-col space-y-4">
            <Logo className="w-32" />
            <p className="text-sm text-muted-foreground">
              Your gateway to knowledge and discovery through our comprehensive library services.
            </p>
          </div>
          
          <div className="sm:col-span-2 md:col-span-1">
            <h4 className="font-medium text-lg mb-3 md:mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/books" className="text-muted-foreground hover:text-foreground flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Books</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-3 md:mb-4">Library Hours</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-muted-foreground">Monday - Friday</span>
                <span>9:00 AM - 8:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Saturday</span>
                <span>10:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Sunday</span>
                <span>12:00 PM - 5:00 PM</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-3 md:mb-4">Contact</h4>
            <address className="not-italic text-sm space-y-2 text-muted-foreground">
              <p>Kathmandu, Nepal</p>
              <p>Developer: Subash Singh Dhami</p>
              <p>Email: contact@subashsdhami.com.np</p>
              <p>Library Management System</p>
            </address>
          </div>
        </div>
        
        <Separator className="my-4 md:my-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Library Management System. All rights reserved.
          </p>
          <div className="flex mt-4 md:mt-0 space-x-4 text-sm">
            <Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link to="/cookies" className="text-muted-foreground hover:text-foreground">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
