import React, { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Grid2X2, List, Plus, Search, BookOpen, Calendar, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useBooks, useBorrowRecords, useCategories } from "@/hooks/useLibraryData";
import { supabase } from "@/lib/supabase";
import { getPlaceholderImage } from "@/lib/imageUpload";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

export default function Books() {
  const { role, profile } = useAuth();
  const isAdmin = role === "admin";
  const { toast } = useToast();
  
  const { books, loading } = useBooks();
  const { borrowBook, records } = useBorrowRecords();
  const { categories } = useCategories();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Borrow dialog state
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isBorrowDialogOpen, setIsBorrowDialogOpen] = useState(false);
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [currentBorrowCount, setCurrentBorrowCount] = useState(0);
  
  // Admin dialogs state
  const [isManageBookOpen, setIsManageBookOpen] = useState(false);
  const [selectedBookForManage, setSelectedBookForManage] = useState<any>(null);
  const [newCopiesCount, setNewCopiesCount] = useState(0);
  const [isUpdatingCopies, setIsUpdatingCopies] = useState(false);
  const [bookBorrowers, setBookBorrowers] = useState<any[]>([]);
  
  // Load current borrow count
  React.useEffect(() => {
    const loadBorrowCount = async () => {
      if (!profile?.id) return;
      
      const { data, error } = await supabase
        .from('borrow_records')
        .select('id')
        .eq('user_id', profile.id)
        .is('return_date', null);
        
      if (!error && data) {
        setCurrentBorrowCount(data.length);
      }
    };
    
    loadBorrowCount();
  }, [profile?.id, books]); // Re-run when books change (after borrowing)
  
  // Filter books based on search term, category and availability
  const filteredBooks = books.filter(book => {
    const matchesSearch = searchTerm === "" || 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
      book.categories?.id === selectedCategory;
    
    const matchesAvailability = availabilityFilter === "all" ||
      (availabilityFilter === "available" && book.available_copies > 0) ||
      (availabilityFilter === "unavailable" && book.available_copies === 0);
    
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const handleBorrowBook = async () => {
    if (!selectedBook || !profile?.id) return;
    
    setIsBorrowing(true);
    try {
      // Check borrowing restrictions
      const { data: currentBorrows, error: borrowError } = await supabase
        .from('borrow_records')
        .select('book_id')
        .eq('user_id', profile.id)
        .is('return_date', null); // Only active borrows

      if (borrowError) {
        console.error('Error checking current borrows:', borrowError);
        return;
      }

      // Check if user has already borrowed this specific book
      const hasBorrowedThisBook = currentBorrows?.some(record => record.book_id === selectedBook.id);
      if (hasBorrowedThisBook) {
        alert('You have already borrowed this book. Please return it before borrowing again.');
        return;
      }

      // Check if user has reached the 5-book limit
      if (currentBorrows && currentBorrows.length >= 5) {
        alert('You have reached the maximum limit of 5 borrowed books. Please return some books before borrowing new ones.');
        return;
      }

      // Set due date to 14 days from now
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      
      const result = await borrowBook(selectedBook.id, dueDate.toISOString());
      
      if (!result.error) {
        setCurrentBorrowCount(prev => prev + 1); // Update the count
        setIsBorrowDialogOpen(false);
        setSelectedBook(null);
      }
    } finally {
      setIsBorrowing(false);
    }
  };

  const openBorrowDialog = (book: any) => {
    setSelectedBook(book);
    setIsBorrowDialogOpen(true);
  };

  // Admin functions
  const openManageBookDialog = async (book: any) => {
    setSelectedBookForManage(book);
    setNewCopiesCount(book.total_copies);
    setIsManageBookOpen(true);
    
    // Load current borrowers for this book
    const { data, error } = await supabase
      .from('borrow_records')
      .select(`
        *,
        users (id, name, email)
      `)
      .eq('book_id', book.id)
      .order('borrow_date', { ascending: false });
      
    if (!error && data) {
      setBookBorrowers(data);
    }
  };

  const handleUpdateCopies = async () => {
    if (!selectedBookForManage) return;
    
    setIsUpdatingCopies(true);
    try {
      const newAvailableCopies = newCopiesCount - (selectedBookForManage.total_copies - selectedBookForManage.available_copies);
      
      const { error } = await supabase
        .from('books')
        .update({
          total_copies: newCopiesCount,
          available_copies: Math.max(0, newAvailableCopies)
        })
        .eq('id', selectedBookForManage.id);
        
      if (!error) {
        setIsManageBookOpen(false);
        toast({
          title: "Book Updated Successfully",
          description: `Total copies updated to ${newCopiesCount}. Available copies: ${Math.max(0, newAvailableCopies)}`,
        });
        // Refresh the page to see updated data
        window.location.reload();
      } else {
        toast({
          title: "Error Updating Book",
          description: "Failed to update book copies. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsUpdatingCopies(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <PageHeader 
          title="Library Catalog" 
          description={`Browse our collection of ${books.length} books`}
        />
        
        {isAdmin && (
          <Button asChild className="bg-lms-blue hover:bg-lms-blue-dark">
            <Link to="/admin-tools">
              <Plus className="h-4 w-4 mr-2" />
              Add New Book
            </Link>
          </Button>
        )}
      </div>

      {/* User Borrow Status (for non-admin users) */}
      {!isAdmin && profile && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Currently Borrowed: {currentBorrowCount}/5 books</span>
              </div>
              {currentBorrowCount >= 5 && (
                <Badge variant="destructive">Limit Reached</Badge>
              )}
            </div>
            {currentBorrowCount >= 4 && (
              <p className="text-sm text-blue-600 mt-2">
                {currentBorrowCount === 4 
                  ? "You can borrow 1 more book." 
                  : "You've reached the maximum limit. Return books to borrow more."}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search Books</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Availability</Label>
              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Books</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="unavailable">Currently Borrowed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>View</Label>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="flex-1"
                >
                  <Grid2X2 className="h-4 w-4 mr-1" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="flex-1"
                >
                  <List className="h-4 w-4 mr-1" />
                  List
                </Button>
              </div>
            </div>
          </div>
          
          {/* Results summary */}
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {filteredBooks.length} of {books.length} books
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Books Display with Tabs */}
      <Tabs defaultValue="all-books" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all-books">All Books ({books.length})</TabsTrigger>
          <TabsTrigger value="my-borrowed" disabled={!profile}>
            My Borrowed Books ({profile ? records.filter(r => r.user_id === profile.id && r.status === 'borrowed').length : 0})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-books" className="space-y-6">
          {filteredBooks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No books found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or browse all books.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setAvailabilityFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }>
              {filteredBooks.map((book) => (
                <Card key={book.id} className={`hover:shadow-md transition-shadow ${viewMode === "list" ? "flex" : ""}`}>
                  <CardContent className={`p-6 ${viewMode === "list" ? "flex items-center gap-6 w-full" : ""}`}>
                    {viewMode === "grid" ? (
                      // Grid View
                      <div className="space-y-4">
                        <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                          <img 
                            src={(book as any).cover_image_url || getPlaceholderImage('book-cover', book.title)}
                            alt={`${book.title} cover`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg leading-tight">{book.title}</h3>
                          <p className="text-sm text-muted-foreground">by {book.author}</p>
                          
                          {book.categories && (
                            <Badge variant="secondary">{book.categories.name}</Badge>
                          )}
                          
                          <div className="text-xs text-muted-foreground space-y-1">
                            {book.isbn && <p>ISBN: {book.isbn}</p>}
                            {book.published_year && <p>Published: {book.published_year}</p>}
                            <p>
                              {book.available_copies} of {book.total_copies} available
                            </p>
                          </div>
                        </div>
                        
                        <div className="pt-2 space-y-2">
                          {book.available_copies > 0 ? (
                            <Button 
                              className="w-full bg-lms-blue hover:bg-lms-blue-dark"
                              onClick={() => openBorrowDialog(book)}
                              disabled={!profile || currentBorrowCount >= 5}
                            >
                              {!profile ? "Login to Borrow" : currentBorrowCount >= 5 ? "Limit Reached" : "Borrow Book"}
                            </Button>
                          ) : (
                            <Button variant="outline" className="w-full" disabled>
                              Currently Unavailable
                            </Button>
                          )}
                          
                          {isAdmin && (
                            <Button 
                              variant="secondary" 
                              className="w-full" 
                              onClick={() => openManageBookDialog(book)}
                            >
                              Manage Book
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      // List View
                      <>
                        <div className="w-24 h-32 bg-muted rounded-lg overflow-hidden shrink-0">
                          <img 
                            src={(book as any).cover_image_url || getPlaceholderImage('book-cover', book.title)}
                            alt={`${book.title} cover`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div>
                            <h3 className="font-semibold text-xl">{book.title}</h3>
                            <p className="text-muted-foreground">by {book.author}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {book.categories && (
                              <Badge variant="secondary">{book.categories.name}</Badge>
                            )}
                            <Badge variant={book.available_copies > 0 ? "default" : "destructive"}>
                              {book.available_copies > 0 ? "Available" : "Unavailable"}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-muted-foreground grid grid-cols-2 gap-4">
                            {book.isbn && <p>ISBN: {book.isbn}</p>}
                            {book.published_year && <p>Published: {book.published_year}</p>}
                            <p>Copies: {book.available_copies}/{book.total_copies}</p>
                          </div>
                        </div>
                        
                        <div className="shrink-0 space-y-2">
                          {book.available_copies > 0 ? (
                            <Button 
                              className="bg-lms-blue hover:bg-lms-blue-dark"
                              onClick={() => openBorrowDialog(book)}
                              disabled={!profile || currentBorrowCount >= 5}
                            >
                              {!profile ? "Login to Borrow" : currentBorrowCount >= 5 ? "Limit Reached" : "Borrow Book"}
                            </Button>
                          ) : (
                            <Button variant="outline" disabled>
                              Currently Unavailable
                            </Button>
                          )}
                          
                          {isAdmin && (
                            <Button 
                              variant="secondary" 
                              onClick={() => openManageBookDialog(book)}
                            >
                              Manage
                            </Button>
                          )}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="my-borrowed" className="space-y-6">
          {profile ? (
            (() => {
              const myBorrowedBooks = records.filter(record => 
                record.user_id === profile.id && record.status === 'borrowed'
              );
              
              return myBorrowedBooks.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No borrowed books</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't borrowed any books yet. Browse our collection to get started!
                    </p>
                    <Button onClick={() => {
                      const tabTrigger = document.querySelector('[value="all-books"]') as HTMLElement;
                      tabTrigger?.click();
                    }}>
                      Browse Books
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>My Borrowed Books</CardTitle>
                    <CardDescription>
                      Books currently borrowed by you
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Book Title</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Borrowed Date</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Fine</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {myBorrowedBooks.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">
                              {record.books?.title || 'Unknown Title'}
                            </TableCell>
                            <TableCell>{record.books?.author || 'Unknown Author'}</TableCell>
                            <TableCell>
                              {new Date(record.borrow_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {new Date(record.due_date).toLocaleDateString()}
                                {new Date(record.due_date) < new Date() && (
                                  <Badge variant="destructive" className="text-xs">
                                    Overdue
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {record.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={record.fine > 0 ? "destructive" : "secondary"}>
                                ${record.fine.toFixed(2)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              );
            })()
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Login Required</h3>
                <p className="text-muted-foreground mb-4">
                  Please log in to view your borrowed books.
                </p>
                <Button asChild>
                  <Link to="/login">Login</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Borrow Book Dialog */}
      <Dialog open={isBorrowDialogOpen} onOpenChange={setIsBorrowDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Borrow Book</DialogTitle>
            <DialogDescription>
              Confirm your book borrowing details below.
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
                {selectedBook.isbn && (
                  <p className="text-sm text-muted-foreground">ISBN: {selectedBook.isbn}</p>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Borrower: {profile?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Borrow Date: {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Due Date: {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  You can extend the borrowing period later if needed. Please return the book on or before the due date to avoid late fees.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBorrowDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBorrowBook} disabled={isBorrowing}>
              {isBorrowing ? "Processing..." : "Confirm Borrow"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin: Manage Book Dialog */}
      <Dialog open={isManageBookOpen} onOpenChange={setIsManageBookOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Manage Book - {selectedBookForManage?.title}</DialogTitle>
            <DialogDescription>
              Update book copies and view borrowing history
            </DialogDescription>
          </DialogHeader>
          
          {selectedBookForManage && (
            <div className="space-y-6">
              {/* Book Info */}
              <div className="p-4 rounded-lg border space-y-2">
                <h3 className="font-semibold text-lg">{selectedBookForManage.title}</h3>
                <p className="text-muted-foreground">by {selectedBookForManage.author}</p>
                <div className="flex gap-2">
                  {selectedBookForManage.categories && (
                    <Badge variant="secondary">{selectedBookForManage.categories.name}</Badge>
                  )}
                  <Badge variant={selectedBookForManage.available_copies > 0 ? "default" : "destructive"}>
                    {selectedBookForManage.available_copies > 0 ? "Available" : "Unavailable"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Current: {selectedBookForManage.available_copies} of {selectedBookForManage.total_copies} available
                </p>
              </div>

              {/* Update Copies Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Update Book Copies</CardTitle>
                  <CardDescription>
                    Increase the total number of copies to make more books available
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="current-copies">Current Total Copies</Label>
                      <Input
                        id="current-copies"
                        value={selectedBookForManage.total_copies}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-copies">New Total Copies</Label>
                      <Input
                        id="new-copies"
                        type="number"
                        min={selectedBookForManage.total_copies - selectedBookForManage.available_copies}
                        value={newCopiesCount}
                        onChange={(e) => setNewCopiesCount(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-800">
                      Adding {newCopiesCount - selectedBookForManage.total_copies} copies will make 
                      {" "}{selectedBookForManage.available_copies + (newCopiesCount - selectedBookForManage.total_copies)} books available for borrowing.
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleUpdateCopies} 
                    disabled={isUpdatingCopies || newCopiesCount < selectedBookForManage.total_copies - selectedBookForManage.available_copies}
                    className="w-full"
                  >
                    {isUpdatingCopies ? "Updating..." : "Update Copies"}
                  </Button>
                </CardContent>
              </Card>

              {/* Current Borrowers */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Borrowers</CardTitle>
                  <CardDescription>
                    Users who currently have this book borrowed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const currentBorrowers = bookBorrowers.filter(record => record.status === 'borrowed');
                    
                    return currentBorrowers.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No one is currently borrowing this book
                      </p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Borrower</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Borrowed Date</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentBorrowers.map((record) => (
                            <TableRow key={record.id}>
                              <TableCell className="font-medium">
                                {record.users?.name || 'Unknown User'}
                              </TableCell>
                              <TableCell>{record.users?.email || 'Unknown Email'}</TableCell>
                              <TableCell>
                                {new Date(record.borrow_date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {new Date(record.due_date).toLocaleDateString()}
                                  {new Date(record.due_date) < new Date() && (
                                    <Badge variant="destructive" className="text-xs">
                                      Overdue
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">
                                  {record.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Borrowing History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Borrowing History</CardTitle>
                  <CardDescription>
                    Complete history of all users who have borrowed this book
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {bookBorrowers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No borrowing history available
                    </p>
                  ) : (
                    <div className="max-h-64 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Borrower</TableHead>
                            <TableHead>Borrowed Date</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Returned Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Fine</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bookBorrowers.map((record) => (
                            <TableRow key={record.id}>
                              <TableCell className="font-medium">
                                {record.users?.name || 'Unknown User'}
                              </TableCell>
                              <TableCell>
                                {new Date(record.borrow_date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                {new Date(record.due_date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                {record.return_date 
                                  ? new Date(record.return_date).toLocaleDateString()
                                  : '-'
                                }
                              </TableCell>
                              <TableCell>
                                <Badge variant={record.status === 'returned' ? 'default' : 'secondary'}>
                                  {record.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={record.fine > 0 ? "destructive" : "secondary"}>
                                  ${record.fine.toFixed(2)}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManageBookOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
