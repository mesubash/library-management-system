
import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendValue,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("stat-card", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        {Icon && (
          <div className="p-2 bg-primary/10 rounded-full">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
      
      {(description || trend) && (
        <div className="mt-4 flex items-center text-sm">
          {trend && (
            <span
              className={cn("mr-1", {
                "text-green-500": trend === "up",
                "text-red-500": trend === "down",
                "text-muted-foreground": trend === "neutral",
              })}
            >
              {trendValue}
            </span>
          )}
          {description && <span className="text-muted-foreground">{description}</span>}
        </div>
      )}
    </Card>
  );
}
