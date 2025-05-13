
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

export function UserAvatar() {
  const { username, role } = useAuth();
  
  // Get first letter of username, or fallback to role's first letter
  const initial = username ? username.charAt(0).toUpperCase() : 
                 role ? role.charAt(0).toUpperCase() : "G";
  
  // Use different colors for different roles
  const getAvatarColor = () => {
    if (role === "admin") return "bg-lms-green text-white";
    if (role === "user") return "bg-lms-blue text-white";
    return "bg-muted";
  };

  return (
    <Avatar className="h-9 w-9">
      <AvatarFallback className={getAvatarColor()}>
        {initial}
      </AvatarFallback>
    </Avatar>
  );
}
