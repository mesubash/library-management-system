
import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Book, BookOpenCheck, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCard } from "@/components/BookCard";
import { booksData } from "@/data/books";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

export default function UserDashboard() {
  // Get a few random books for demonstration
  const borrowedBooks = booksData.filter(book => !book.available).slice(0, 2);
  const recommendedBooks = booksData.filter(book => book.available).slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="My Dashboard" 
        description="Welcome back! Here's an overview of your library activity" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Books Borrowed" 
          value="2" 
          icon={Book}
          description="Currently borrowed books"
        />
        <StatCard 
          title="Reading Progress" 
          value="65%" 
          icon={BookOpenCheck}
          description="Overall completion"
        />
        <StatCard 
          title="Next Due Date" 
          value="May 24" 
          icon={Clock}
          description="5 days remaining"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                {borrowedBooks.map((book) => (
                  <div key={book.id} className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border">
                    <div className="w-full md:w-24 h-32 overflow-hidden rounded-md shrink-0">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                      <div className="mt-2 space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Reading Progress</span>
                            <span className="font-medium">45%</span>
                          </div>
                          <Progress value={45} className="h-2" />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Due Date</span>
                          <span className="font-medium">May 24, 2025</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" size="sm">
                          Extend Borrow Time
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
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
        
        <Card>
          <CardHeader>
            <CardTitle>Reading Activity</CardTitle>
            <CardDescription>
              Your recent reading history and progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border">
                <h3 className="font-medium">Monthly Reading Goal</h3>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>2 of 4 books completed</span>
                    <span className="font-medium">50%</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>
              </div>
              
              <div className="p-4 rounded-lg border">
                <h3 className="font-medium">Reading Streak</h3>
                <div className="mt-2 flex justify-between">
                  <div className="text-center">
                    <div className="text-2xl font-bold">14</div>
                    <div className="text-xs text-muted-foreground">Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-xs text-muted-foreground">Hours Today</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-xs text-muted-foreground">Books This Year</div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border">
                <h3 className="font-medium">Favorite Genres</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Fantasy</div>
                  <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Science Fiction</div>
                  <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Mystery</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recommended for You</CardTitle>
            <CardDescription>
              Based on your reading history and preferences
            </CardDescription>
          </div>
          <Button asChild className="bg-lms-blue hover:bg-lms-blue-dark">
            <Link to="/books">Browse All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {recommendedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
