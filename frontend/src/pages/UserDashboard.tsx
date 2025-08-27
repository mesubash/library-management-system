
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Book as BookIcon, BookOpenCheck, Clock, CheckCircle, Calendar, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useBooks, useBorrowRecords } from "@/hooks/useLibraryData";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { BorrowRecord, Book } from "@/types/book";

export default function UserDashboard() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const { 
    books, 
    loading: booksLoading, 
    refetch: fetchBooks 
  } = useBooks();
  
  const { 
    records: borrowRecords, 
    loading: recordsLoading,
    refetch: fetchBorrowRecords,
    borrowBook,
    cancelRequest 
  } = useBorrowRecords();

  useEffect(() => {
    fetchBooks();
    fetchBorrowRecords();
  }, []);

  // Get user's borrow records
  const userBorrowRecords = borrowRecords.filter(record => record.user_id === profile?.id);
  
  // Get currently borrowed books
  const borrowedBooks = userBorrowRecords
    .filter(record => record.status === 'borrowed')
    .map(record => {
      const book = books.find(b => b.id === record.book_id);
      return book ? { ...book, borrowRecord: record } : null;
    })
    .filter(Boolean);

  // Get pending requests
  const pendingRequests = userBorrowRecords
    .filter(record => record.status === 'requested')
    .map(record => {
      const book = books.find(b => b.id === record.book_id);
      return book ? { ...book, borrowRecord: record } : null;
    })
    .filter(Boolean);

  // Get approved requests (ready for pickup)
  const approvedRequests = userBorrowRecords
    .filter(record => record.status === 'approved')
    .map(record => {
      const book = books.find(b => b.id === record.book_id);
      return book ? { ...book, borrowRecord: record } : null;
    })
    .filter(Boolean);

  // Get recommended books (books not currently requested/borrowed by user)
  const userRequestedBookIds = userBorrowRecords
    .filter(record => ['requested', 'approved', 'borrowed'].includes(record.status))
    .map(record => record.book_id);
  
  const recommendedBooks = books
    .filter(book => !userRequestedBookIds.includes(book.id))
    .slice(0, 5);

  const handleBookRequest = async (book: Book) => {
    try {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14); // 14 days from now
      const result = await borrowBook(book.id, dueDate.toISOString());
      if (!result.error) {
        toast({
          title: "Book Requested",
          description: `Your request for "${book.title}" has been submitted and is awaiting approval.`,
        });
        fetchBorrowRecords(); // Refresh the records
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error requesting book:', error);
      toast({
        title: "Error",
        description: "Failed to request book. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelRequest = async (recordId: string) => {
    try {
      const result = await cancelRequest(recordId);
      if (!result.error) {
        toast({
          title: "Request Cancelled",
          description: "Your book request has been cancelled successfully.",
        });
        fetchBorrowRecords(); // Refresh the records
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast({
        title: "Error",
        description: "Failed to cancel request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'requested':
        return <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">Ready for Pickup</Badge>;
      case 'borrowed':
        return <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">Borrowed</Badge>;
      default:
        return null;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { dueDate: due, daysRemaining: diffDays };
  };

  const loading = booksLoading || recordsLoading;

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="My Dashboard" 
        description="Welcome back! Here's an overview of your library activity" 
      />
      
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard 
              title="Books Borrowed" 
              value={borrowedBooks.length.toString()} 
              icon={BookIcon}
              description="Currently borrowed books"
            />
            <StatCard 
              title="Pending Requests" 
              value={pendingRequests.length.toString()} 
              icon={Clock}
              description="Awaiting approval"
            />
            <StatCard 
              title="Ready for Pickup" 
              value={approvedRequests.length.toString()} 
              icon={CheckCircle}
              description="Approved books to collect"
            />
            <StatCard 
              title="Next Due Date" 
              value={borrowedBooks.length > 0 ? 
                getDaysUntilDue(borrowedBooks[0].borrowRecord.due_date).daysRemaining > 0 ? 
                  `${getDaysUntilDue(borrowedBooks[0].borrowRecord.due_date).daysRemaining} days` : 
                  "Overdue" : 
                "None"
              } 
              icon={AlertCircle}
              description={borrowedBooks.length > 0 ? "Days remaining" : "No borrowed books"}
            />
          </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Borrowed Books */}
        <Card>
          <CardHeader>
            <CardTitle>My Borrowed Books</CardTitle>
            <CardDescription>
              Books you currently have checked out
            </CardDescription>
          </CardHeader>
          <CardContent>
            {borrowedBooks.length > 0 ? (
              <div className="space-y-4">
                {borrowedBooks.map((book) => {
                  const dueInfo = getDaysUntilDue(book.borrowRecord.due_date);
                  return (
                    <div key={book.id} className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border">
                      <div className="w-full md:w-24 h-32 overflow-hidden rounded-md shrink-0">
                        <img
                          src={book.cover_image_url}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Status</span>
                            {getStatusBadge(book.borrowRecord.status)}
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Due Date</span>
                            <span className={`font-medium ${dueInfo.daysRemaining < 0 ? 'text-red-600' : dueInfo.daysRemaining <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                              {dueInfo.dueDate.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Days Remaining</span>
                            <span className={`font-medium ${dueInfo.daysRemaining < 0 ? 'text-red-600' : dueInfo.daysRemaining <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                              {dueInfo.daysRemaining < 0 ? `${Math.abs(dueInfo.daysRemaining)} days overdue` : `${dueInfo.daysRemaining} days`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You don't have any borrowed books</p>
                <Button asChild className="bg-lms-blue hover:bg-lms-blue-dark">
                  <Link to="/books">Browse Books</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Requests Status */}
        <Card>
          <CardHeader>
            <CardTitle>Request Status</CardTitle>
            <CardDescription>
              Track your book requests and pickups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Pending Requests */}
              {pendingRequests.length > 0 && (
                <div className="p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
                  <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Pending Requests ({pendingRequests.length})</h3>
                  <div className="space-y-2">
                    {pendingRequests.map((book) => (
                      <div key={book.id} className="flex justify-between items-center">
                        <span className="text-sm dark:text-gray-200">{book.title}</span>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(book.borrowRecord.status)}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCancelRequest(book.borrowRecord.id)}
                            className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Ready for Pickup */}
              {approvedRequests.length > 0 && (
                <div className="p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                  <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">Ready for Pickup ({approvedRequests.length})</h3>
                  <div className="space-y-2">
                    {approvedRequests.map((book) => (
                      <div key={book.id} className="flex justify-between items-center">
                        <span className="text-sm dark:text-gray-200">{book.title}</span>
                        {getStatusBadge(book.borrowRecord.status)}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-2">Visit the library to collect your approved books!</p>
                </div>
              )}
              
              {/* No Active Requests */}
              {pendingRequests.length === 0 && approvedRequests.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No pending requests</p>
                  <Button asChild className="bg-lms-blue hover:bg-lms-blue-dark">
                    <Link to="/books">Browse Books</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recommended for You</CardTitle>
            <CardDescription>
              Books available for request
            </CardDescription>
          </div>
          <Button asChild className="bg-lms-blue hover:bg-lms-blue-dark">
            <Link to="/books">Browse All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recommendedBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {recommendedBooks.map((book) => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  onBorrow={handleBookRequest}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">All available books have been requested or borrowed</p>
            </div>
          )}
        </CardContent>
      </Card>
        </>
      )}
    </div>
  );
}
