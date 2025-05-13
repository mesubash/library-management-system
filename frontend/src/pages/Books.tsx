
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Grid2X2, List, Plus, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { booksData } from "@/data/books";
import { Book } from "@/types/book";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function Books() {
  const { role } = useAuth();
  const isAdmin = role === "admin";
  
  const [books, setBooks] = useState<Book[]>(booksData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  
  // List of unique genres from books data
  const genres = ["all", ...Array.from(new Set(booksData.map(book => book.genre)))];
  
  // Filter books based on search term, genre and availability
  useEffect(() => {
    let filtered = [...booksData];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by genre
    if (selectedGenre !== "all") {
      filtered = filtered.filter(book => book.genre === selectedGenre);
    }
    
    // Filter by availability
    if (availabilityFilter !== "all") {
      const isAvailable = availabilityFilter === "available";
      filtered = filtered.filter(book => book.available === isAvailable);
    }
    
    setBooks(filtered);
  }, [searchTerm, selectedGenre, availabilityFilter]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Books" 
        description="Browse our collection of available and borrowed books" 
      >
        {isAdmin && (
          <Button className="bg-lms-green hover:bg-lms-green-dark">
            <Plus className="mr-2 h-4 w-4" />
            Add Book
          </Button>
        )}
      </PageHeader>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by title or author..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div className="w-full sm:w-40">
                <Select
                  value={selectedGenre}
                  onValueChange={setSelectedGenre}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre === "all" ? "All Genres" : genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-40">
                <Select
                  value={availabilityFilter}
                  onValueChange={setAvailabilityFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Books</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="borrowed">Borrowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="grid" className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {books.length} {books.length === 1 ? "book" : "books"} found
          </div>
          <TabsList>
            <TabsTrigger value="grid">
              <Grid2X2 className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="grid" className="mt-0">
          {books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No books found matching your criteria</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          {books.length > 0 ? (
            <div className="space-y-4">
              {books.map((book) => (
                <Card key={book.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="w-full sm:w-24 h-32 overflow-hidden rounded-md shrink-0">
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div>
                            <h3 className="font-semibold text-lg">{book.title}</h3>
                            <p className="text-sm text-muted-foreground">{book.author}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm ${
                            book.available 
                              ? "bg-lms-green/10 text-lms-green" 
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {book.available ? "Available" : "Borrowed"}
                          </div>
                        </div>
                        <div className="mt-2">
                          <Label className="text-xs text-muted-foreground">Genre</Label>
                          <p className="text-sm">{book.genre}</p>
                        </div>
                        <div className="mt-4">
                          {isAdmin ? (
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Edit</Button>
                              <Button 
                                size="sm" 
                                className="bg-lms-blue hover:bg-lms-blue-dark"
                              >
                                {book.available ? "Mark Borrowed" : "Mark Returned"}
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              size="sm" 
                              className="bg-lms-blue hover:bg-lms-blue-dark"
                              disabled={!book.available}
                            >
                              {book.available ? "Borrow" : "Unavailable"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No books found matching your criteria</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
