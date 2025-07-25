import React from "react";
import { BookOpenText } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly }: LogoProps) {
  return (
    <Link to="/" className={cn("flex items-center gap-2", className)}>
      <BookOpenText size={28} className="text-lms-green" />
      {!iconOnly && (
        <div className="flex flex-col">
          <span className="font-bold text-lg leading-none">Library</span>
          <span className="text-xs text-muted-foreground leading-none">Management System</span>
        </div>
      )}
    </Link>
  );
}
