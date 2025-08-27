
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Book } from "@/types/book";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { getPlaceholderImage } from "@/lib/imageUpload";

interface BookCardProps {
  book: Book;
  className?: string;
}

export function BookCard({ book, className }: BookCardProps) {
  const { role } = useAuth();
  const isAdmin = role === "admin";
  
  // Get consistent placeholder image for this book
  const coverImage = book.cover_image_url || getPlaceholderImage('book-cover', book.title);
  const isAvailable = book.available_copies > 0;
  
  return (
    <Card className={cn("book-card overflow-hidden", className)}>
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={coverImage}
          alt={`${book.title} cover`}
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge 
            variant={isAvailable ? "default" : "outline"}
            className={isAvailable ? "bg-lms-green text-white" : ""}
          >
            {isAvailable ? "Available" : "Borrowed"}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold line-clamp-2 text-lg">{book.title}</h3>
        <p className="text-sm text-muted-foreground">{book.author}</p>
        <div className="mt-2 space-x-1">
          <Badge variant="secondary" className="text-xs">
            {book.published_year || 'Unknown Year'}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {book.available_copies}/{book.total_copies} Available
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 pb-4 pt-0 flex gap-2">
        {isAdmin ? (
          <>
            <Button variant="outline" size="sm" className="flex-1">Edit</Button>
            <Button variant="default" size="sm" className="flex-1 bg-lms-blue hover:bg-lms-blue-dark">
              Manage
            </Button>
          </>
        ) : (
          <Button 
            variant="default" 
            size="sm" 
            className="w-full bg-lms-blue hover:bg-lms-blue-dark"
            disabled={!isAvailable}
          >
            {isAvailable ? "Borrow" : "Unavailable"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
