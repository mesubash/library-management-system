
import React from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { BookCard } from "@/components/BookCard";
import { booksData } from "@/data/books";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const featuredBooks = booksData.slice(0, 6);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="rounded-lg border bg-card p-8 text-center overflow-hidden relative">
        <div className="max-w-2xl mx-auto relative z-10">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Welcome to the Library Management System</h1>
          <p className="text-muted-foreground mb-6">
            Discover thousands of books, manage your reading list, and more.
          </p>
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-lms-green hover:bg-lms-green-dark">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <section>
        <PageHeader 
          title="Featured Books" 
          description="Check out the latest additions to our collection"
          className="mb-4"
        >
          <Button asChild className="bg-lms-blue hover:bg-lms-blue-dark">
            <Link to="/books">View All Books</Link>
          </Button>
        </PageHeader>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="bg-primary/10 text-primary font-bold rounded-full h-8 w-8 flex items-center justify-center">1</div>
              <div>
                <h3 className="font-medium">Browse Our Collection</h3>
                <p className="text-sm text-muted-foreground">Explore our extensive library of books.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-primary/10 text-primary font-bold rounded-full h-8 w-8 flex items-center justify-center">2</div>
              <div>
                <h3 className="font-medium">Borrow Books</h3>
                <p className="text-sm text-muted-foreground">Reserve or borrow books with a single click.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-primary/10 text-primary font-bold rounded-full h-8 w-8 flex items-center justify-center">3</div>
              <div>
                <h3 className="font-medium">Return When Done</h3>
                <p className="text-sm text-muted-foreground">Return books and share your feedback.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Library Hours</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Monday - Friday</span>
              <span className="font-medium">9:00 AM - 8:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Saturday</span>
              <span className="font-medium">10:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Sunday</span>
              <span className="font-medium">12:00 PM - 5:00 PM</span>
            </div>
            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                Please note that the library may have special hours during holidays.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
