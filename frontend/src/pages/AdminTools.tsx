import React, { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, FileSpreadsheet, Upload, UserRound, Users, Edit, Trash2, Plus, Download, Eye, Search } from "lucide-react";
import { useBooks, useCategories, useBorrowRecords } from "@/hooks/useLibraryData";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { BorrowRecord } from "@/types/book";
import { getPlaceholderImage } from "@/lib/imageUpload";
import { useToast } from "@/hooks/use-toast";

export default function AdminTools() {
  const { books, addBook, updateBook, deleteBook } = useBooks();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { records } = useBorrowRecords();
  const { role } = useAuth();
  const { toast } = useToast();

  // Book Management State
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    published_year: new Date().getFullYear(),
    total_copies: 1,
    category_id: ""
  });
  const [editingBook, setEditingBook] = useState<any>(null);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<any>(null);

  // Category Management State
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  // User Management State
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Borrowed History State
  const [borrowedHistory, setBorrowedHistory] = useState<BorrowRecord[]>([]);
  const [selectedBookHistory, setSelectedBookHistory] = useState<any>(null);
  const [historySearchTerm, setHistorySearchTerm] = useState("");
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);

  // Fetch borrowed history for a specific book
  const fetchBookHistory = async (bookId: string) => {
    try {
      const { data, error } = await supabase
        .from('borrow_records')
        .select(`
          id,
          user_id,
          book_id,
          borrow_date,
          return_date,
          due_date,
          fine,
          users!inner(id, name, email)
        `)
        .eq('book_id', bookId)
        .order('borrow_date', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = data?.map(record => ({
        ...record,
        user: Array.isArray(record.users) ? record.users[0] : record.users
      })) || [];
      
      setBorrowedHistory(transformedData);
    } catch (error) {
      console.error('Error fetching book history:', error);
    }
  };

  // Handle showing book history
  const handleShowHistory = async (book: any) => {
    setSelectedBookHistory(book);
    await fetchBookHistory(book.id);
    setShowHistoryDialog(true);
  };

  // Handle adding a new book
  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author) return;
    
    setIsAddingBook(true);
    try {
      // Auto-assign a placeholder image based on book title
      const coverImageUrl = getPlaceholderImage('book-cover', newBook.title);
      
      const result = await addBook({
        ...newBook,
        available_copies: newBook.total_copies,
        cover_image_url: coverImageUrl
      });
      
      if (!result.error) {
        setNewBook({
          title: "",
          author: "",
          isbn: "",
          published_year: new Date().getFullYear(),
          total_copies: 1,
          category_id: ""
        });
        
        // Show success toast
        toast({
          title: "Book Added Successfully",
          description: `"${newBook.title}" has been added to the library catalog.`,
        });
      } else {
        // Show error toast
        toast({
          title: "Error Adding Book",
          description: result.error || "Failed to add the book. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsAddingBook(false);
    }
  };

  // Handle editing a book
  const handleEditBook = async () => {
    if (!editingBook) return;
    
    try {
      await updateBook(editingBook.id, {
        title: editingBook.title,
        author: editingBook.author,
        isbn: editingBook.isbn,
        published_year: editingBook.published_year,
        total_copies: editingBook.total_copies,
        category_id: editingBook.category_id
      });
      
      setIsEditDialogOpen(false);
      setEditingBook(null);
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  // Handle deleting a book
  const handleDeleteBook = async () => {
    if (!bookToDelete) return;
    
    try {
      await deleteBook(bookToDelete.id);
      setIsDeleteDialogOpen(false);
      setBookToDelete(null);
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  // Handle adding/editing categories
  const handleSaveCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, newCategoryName);
      } else {
        await addCategory(newCategoryName);
      }
      
      setNewCategoryName("");
      setEditingCategory(null);
      setIsCategoryDialogOpen(false);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  // Load users for admin
  const loadUsers = async () => {
    if (role !== 'admin') return;
    
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error) {
        setUsers(data || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Generate reports data
  const generateReportsData = () => {
    const totalBooks = books.length;
    const totalBorrows = records.length;
    const activeBorrows = records.filter(r => r.status === 'borrowed').length;
    const overdueBorrows = records.filter(r => 
      r.status === 'borrowed' && new Date(r.due_date) < new Date()
    ).length;
    
    const popularBooks = books
      .map(book => ({
        ...book,
        borrowCount: records.filter(r => r.book_id === book.id).length
      }))
      .sort((a, b) => b.borrowCount - a.borrowCount)
      .slice(0, 10);

    return {
      totalBooks,
      totalBorrows,
      activeBorrows,
      overdueBorrows,
      popularBooks
    };
  };

  const reportsData = generateReportsData();

  if (role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <UserRound className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground">You need admin privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Admin Tools" 
        description="Comprehensive library management and administration" 
      />
      
      <Tabs defaultValue="books" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full md:w-[600px]">
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        {/* Books Management */}
        <TabsContent value="books" className="space-y-6">
          {/* Add Book Form */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Book</CardTitle>
              <CardDescription>
                Add a new book to the library catalog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input 
                    id="title" 
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    placeholder="Enter book title" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input 
                    id="author" 
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    placeholder="Enter author name" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input 
                    id="isbn" 
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                    placeholder="Enter ISBN" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Published Year</Label>
                  <Input 
                    id="year" 
                    type="number"
                    value={newBook.published_year}
                    onChange={(e) => setNewBook({ ...newBook, published_year: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="copies">Total Copies</Label>
                  <Input 
                    id="copies" 
                    type="number"
                    min="1"
                    value={newBook.total_copies}
                    onChange={(e) => setNewBook({ ...newBook, total_copies: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => setNewBook({ ...newBook, category_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                  <p className="text-sm text-blue-700">
                    📚 A unique book cover will be automatically assigned based on the book title.
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  onClick={handleAddBook}
                  disabled={isAddingBook || !newBook.title || !newBook.author}
                  className="bg-lms-blue hover:bg-lms-blue-dark"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isAddingBook ? "Adding..." : "Add Book"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Books List */}
          <Card>
            <CardHeader>
              <CardTitle>Manage Books</CardTitle>
              <CardDescription>
                Edit or remove books from the catalog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Copies</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>History</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {books.slice(0, 10).map((book) => (
                      <TableRow key={book.id}>
                        <TableCell className="font-medium">{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>
                          {book.categories ? (
                            <Badge variant="secondary">{book.categories.name}</Badge>
                          ) : (
                            <span className="text-muted-foreground">No category</span>
                          )}
                        </TableCell>
                        <TableCell>{book.total_copies}</TableCell>
                        <TableCell>{book.available_copies}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleShowHistory(book)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingBook(book);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setBookToDelete(book);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Management */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Manage Categories</CardTitle>
                  <CardDescription>
                    Add, edit, or remove book categories
                  </CardDescription>
                </div>
                <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => {
                        setEditingCategory(null);
                        setNewCategoryName("");
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingCategory ? "Edit Category" : "Add Category"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingCategory ? "Modify the category name." : "Create a new book category."}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="categoryName">Category Name</Label>
                        <Input
                          id="categoryName"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Enter category name"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveCategory} disabled={!newCategoryName.trim()}>
                        {editingCategory ? "Update" : "Add"} Category
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <Card key={category.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category.name}</span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingCategory(category);
                              setNewCategoryName(category.name);
                              setIsCategoryDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Management */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    View and manage registered users
                  </CardDescription>
                </div>
                <Button onClick={loadUsers} disabled={loadingUsers}>
                  {loadingUsers ? "Loading..." : "Refresh Users"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {users.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">Active</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Click "Refresh Users" to load user data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{reportsData.totalBooks}</div>
                <p className="text-sm text-muted-foreground">Total Books</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">{reportsData.totalBorrows}</div>
                <p className="text-sm text-muted-foreground">Total Borrows</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <UserRound className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">{reportsData.activeBorrows}</div>
                <p className="text-sm text-muted-foreground">Active Borrows</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-red-600" />
                <div className="text-2xl font-bold">{reportsData.overdueBorrows}</div>
                <p className="text-sm text-muted-foreground">Overdue Books</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Most Popular Books</CardTitle>
              <CardDescription>
                Books with the highest borrowing frequency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportsData.popularBooks.slice(0, 5).map((book, index) => (
                  <div key={book.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{book.title}</p>
                        <p className="text-sm text-muted-foreground">by {book.author}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{book.borrowCount} borrows</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Book Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>
              Modify book details below.
            </DialogDescription>
          </DialogHeader>
          {editingBook && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editTitle">Title</Label>
                <Input
                  id="editTitle"
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editAuthor">Author</Label>
                <Input
                  id="editAuthor"
                  value={editingBook.author}
                  onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editCopies">Total Copies</Label>
                <Input
                  id="editCopies"
                  type="number"
                  value={editingBook.total_copies}
                  onChange={(e) => setEditingBook({ ...editingBook, total_copies: parseInt(e.target.value) })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditBook}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Book Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Book</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this book? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {bookToDelete && (
            <div className="p-4 rounded-lg border">
              <p className="font-medium">{bookToDelete.title}</p>
              <p className="text-sm text-muted-foreground">by {bookToDelete.author}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBook}>
              Delete Book
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Borrowed History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Borrowed History - {selectedBookHistory?.title}</DialogTitle>
            <DialogDescription>
              View the complete borrowing history for this book
            </DialogDescription>
          </DialogHeader>
          
          {/* Search for history */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user name or email..."
                value={historySearchTerm}
                onChange={(e) => setHistorySearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {borrowedHistory.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Borrowed Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Returned Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fine</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borrowedHistory
                    .filter(record => 
                      !historySearchTerm || 
                      record.user?.name?.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
                      record.user?.email?.toLowerCase().includes(historySearchTerm.toLowerCase())
                    )
                    .map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {record.user?.name || 'Unknown User'}
                      </TableCell>
                      <TableCell>{record.user?.email || 'N/A'}</TableCell>
                      <TableCell>
                        {new Date(record.borrow_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {record.due_date ? new Date(record.due_date).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {record.return_date ? new Date(record.return_date).toLocaleDateString() : 'Not Returned'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={record.return_date ? "default" : "destructive"}>
                          {record.return_date ? "Returned" : "Borrowed"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {record.fine ? `$${record.fine}` : '$0.00'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No borrowing history found for this book.
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowHistoryDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
