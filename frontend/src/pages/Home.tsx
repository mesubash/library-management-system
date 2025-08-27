
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { BookCard } from "@/components/BookCard";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useBooks, useBorrowRecords } from "@/hooks/useLibraryData";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const { isAuthenticated, profile, role } = useAuth();
  const { books, loading } = useBooks();
  const { borrowBook, refetch: refetchRecords } = useBorrowRecords();
  const { toast } = useToast();
  const featuredBooks = books.slice(0, 6);
  const isAdmin = role === "admin";

  // Request dialog state
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isBorrowDialogOpen, setIsBorrowDialogOpen] = useState(false);
  const [isBorrowing, setIsBorrowing] = useState(false);

  // Handle requesting a book
  const handleBorrowBook = async () => {
    if (!selectedBook || !profile?.id) return;
    
    setIsBorrowing(true);
    try {
      // Set due date to 14 days from now
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      
      const result = await borrowBook(selectedBook.id, dueDate.toISOString());
      
      if (!result.error) {
        setIsBorrowDialogOpen(false);
        setSelectedBook(null);
        // Refresh borrow records to update UI
        await refetchRecords();
      }
    } finally {
      setIsBorrowing(false);
    }
  };

  const openBorrowDialog = (book: any) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "You need to login to request books.",
        action: (
          <Button asChild variant="outline" size="sm">
            <Link to="/login">Login</Link>
          </Button>
        ),
      });
      return;
    }
    setSelectedBook(book);
    setIsBorrowDialogOpen(true);
  };

  // Admin functions
  const handleEditBook = (book: any) => {
    toast({
      title: "Edit Book",
      description: `Redirecting to edit ${book.title}...`,
    });
    // TODO: Implement edit book functionality or redirect to admin tools
    window.location.href = `/admin-tools?edit=${book.id}`;
  };

  const handleManageBook = (book: any) => {
    toast({
      title: "Manage Book",
      description: `Managing ${book.title}...`,
    });
    // TODO: Implement manage book functionality
    window.location.href = `/admin-tools?manage=${book.id}`;
  };

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
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 aspect-[2/3] rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))
          ) : (
            featuredBooks.map((book) => (
              <BookCard 
                key={book.id} 
                book={book} 
                onBorrow={openBorrowDialog}
                onEdit={isAdmin ? handleEditBook : undefined}
                onManage={isAdmin ? handleManageBook : undefined}
              />
            ))
          )}
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

      {/* Request Book Dialog */}
      <Dialog open={isBorrowDialogOpen} onOpenChange={setIsBorrowDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Book for Borrowing</DialogTitle>
            <DialogDescription>
              This will submit a request to borrow this book. You'll be notified when it's ready for pickup.
            </DialogDescription>
          </DialogHeader>
          
          {selectedBook && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg border space-y-2">
                <h3 className="font-semibold text-lg">{selectedBook.title}</h3>
                <p className="text-muted-foreground">by {selectedBook.author}</p>
                {selectedBook.categories && (
                  <Badge variant="secondary">{selectedBook.categories.name}</Badge>
                )}
              </div>
              
              <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                <h4 className="font-medium text-amber-800 mb-2">📚 How it works:</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Your request will be reviewed by library staff</li>
                  <li>• You'll be notified when the book is ready for pickup</li>
                  <li>• Visit the library within 3 days of approval</li>
                  <li>• Bring your library card and valid ID</li>
                </ul>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBorrowDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBorrowBook} disabled={isBorrowing}>
              {isBorrowing ? "Submitting Request..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
