
import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-lms-green mb-4">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="text-muted-foreground mb-8">
          The page at <code className="bg-muted px-2 py-1 rounded">{location.pathname}</code> was not found.
        </p>
        <Button asChild className="bg-lms-green hover:bg-lms-green-dark">
          <Link to="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
