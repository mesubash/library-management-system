import React, { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Book, BookCopy, Clock, UserRound, Plus, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useDashboardStats, useBooks, useBorrowRecords, useCategories } from "@/hooks/useLibraryData";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { stats, loading: statsLoading } = useDashboardStats();
  const { books, addBook, refetch: refetchBooks } = useBooks();
  const { records, returnBook } = useBorrowRecords();
  const { categories } = useCategories();
  const { username } = useAuth();
  const { toast } = useToast();

  // Add Book Dialog State
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    published_year: new Date().getFullYear(),
    total_copies: 1,
    available_copies: 1,
    category_id: ""
  });
  const [isAddingBook, setIsAddingBook] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleAddBook = async () => {
    setIsAddingBook(true);
    try {
      const result = await addBook({
        ...newBook,
        available_copies: newBook.total_copies
      });
      
      if (!result.error) {
        setIsAddBookOpen(false);
        setNewBook({
          title: "",
          author: "",
          isbn: "",
          published_year: new Date().getFullYear(),
          total_copies: 1,
          available_copies: 1,
          category_id: ""
        });
        
        // Show success toast
        toast({
          title: "Book Added Successfully",
          description: `"${newBook.title}" has been added to the library catalog.`,
        });
        
        // Refresh the books list
        refetchBooks();
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

  const handleReturnBook = async (recordId: string) => {
    await returnBook(recordId);
  };

  // Filter records based on search and status
  const filteredRecords = records.filter(record => {
    const matchesSearch = searchTerm === "" || 
      record.books?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.users?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Chart data for popular books
  const chartData = stats?.popularBooks?.map(book => ({
    name: book.title.length > 15 ? book.title.substring(0, 15) + "..." : book.title,
    borrows: book.borrow_count
  })) || [];

  if (statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <PageHeader 
          title={`Welcome back, ${username || 'Admin'}!`}
          description="Library management overview and statistics" 
        />
        <Dialog open={isAddBookOpen} onOpenChange={setIsAddBookOpen}>
          <DialogTrigger asChild>
            <Button className="bg-lms-blue hover:bg-lms-blue-dark">
              <Plus className="h-4 w-4 mr-2" />
              Add New Book
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
              <DialogDescription>
                Add a new book to the library catalog.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  placeholder="Enter book title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  placeholder="Enter author name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN (Optional)</Label>
                <Input
                  id="isbn"
                  value={newBook.isbn}
                  onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                  placeholder="Enter ISBN"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setNewBook({ ...newBook, category_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
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
            <DialogFooter>
              <Button 
                onClick={handleAddBook} 
                disabled={isAddingBook || !newBook.title || !newBook.author}
              >
                {isAddingBook ? "Adding..." : "Add Book"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Books" 
          value={stats?.totalBooks?.toString() || "0"} 
          icon={Book}
          description={`${books.filter(b => b.available_copies > 0).length} available`}
        />
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers?.toString() || "0"} 
          icon={UserRound}
          description="Registered members"
        />
        <StatCard 
          title="Currently Borrowed" 
          value={stats?.totalBorrowed?.toString() || "0"} 
          icon={BookCopy}
          description="Books checked out"
        />
        <StatCard 
          title="Overdue Books" 
          value={stats?.totalOverdue?.toString() || "0"} 
          icon={Clock}
          description="Need attention"
          trend={stats?.totalOverdue ? "down" : undefined}
        />
      </div>

      {/* Charts and Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Books Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Most Borrowed Books</CardTitle>
            <CardDescription>
              Books with highest circulation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="borrows" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No borrowing data available yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Borrowings</CardTitle>
            <CardDescription>
              Latest book checkouts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentBorrows?.slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                  <div className="flex-1">
                    <p className="font-medium">{record.books?.title}</p>
                    <p className="text-sm text-muted-foreground">
                      by {record.users?.name}
                    </p>
                  </div>
                  <Badge variant={record.status === 'borrowed' ? 'default' : 'secondary'}>
                    {record.status}
                  </Badge>
                </div>
              )) || (
                <p className="text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Borrow Records Management Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Borrow Records Management</CardTitle>
              <CardDescription>
                Manage active and past book borrowings
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search books or users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full sm:w-[300px]"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="borrowed">Borrowed</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Borrow Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.slice(0, 10).map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {record.books?.title}
                      <p className="text-sm text-muted-foreground">
                        by {record.books?.author}
                      </p>
                    </TableCell>
                    <TableCell>{record.users?.name}</TableCell>
                    <TableCell>
                      {new Date(record.borrow_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span className={
                        record.status === 'borrowed' && new Date(record.due_date) < new Date()
                          ? 'text-red-600 font-medium'
                          : ''
                      }>
                        {new Date(record.due_date).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          record.status === 'returned' 
                            ? 'secondary' 
                            : record.is_late 
                              ? 'destructive' 
                              : 'default'
                        }
                      >
                        {record.status === 'borrowed' && record.is_late ? 'Overdue' : record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {record.status === 'borrowed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReturnBook(record.id)}
                        >
                          Mark Returned
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredRecords.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No borrow records found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link to="/admin-tools">
            <CardContent className="p-6 text-center">
              <BookCopy className="h-8 w-8 mx-auto mb-2 text-lms-blue" />
              <h3 className="font-semibold">Manage Books</h3>
              <p className="text-sm text-muted-foreground">Add, edit, or remove books</p>
            </CardContent>
          </Link>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link to="/books">
            <CardContent className="p-6 text-center">
              <Book className="h-8 w-8 mx-auto mb-2 text-lms-blue" />
              <h3 className="font-semibold">Browse Catalog</h3>
              <p className="text-sm text-muted-foreground">View all books in library</p>
            </CardContent>
          </Link>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link to="/profile">
            <CardContent className="p-6 text-center">
              <UserRound className="h-8 w-8 mx-auto mb-2 text-lms-blue" />
              <h3 className="font-semibold">Profile Settings</h3>
              <p className="text-sm text-muted-foreground">Manage your account</p>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}