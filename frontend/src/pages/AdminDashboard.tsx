
import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Book, BookCopy, Clock, UserRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCard } from "@/components/BookCard";
import { booksData } from "@/data/books";
import { Link } from "react-router-dom";

// Sample data for the charts
const booksByMonthData = [
  { name: "Jan", books: 10 },
  { name: "Feb", books: 20 },
  { name: "Mar", books: 15 },
  { name: "Apr", books: 25 },
  { name: "May", books: 30 },
  { name: "Jun", books: 22 },
];

const booksByGenreData = [
  { name: "Fiction", books: 120 },
  { name: "Science", books: 80 },
  { name: "History", books: 70 },
  { name: "Biography", books: 50 },
  { name: "Fantasy", books: 90 },
  { name: "Other", books: 40 },
];

export default function AdminDashboard() {
  // Get books that are not available (borrowed)
  const borrowedBooks = booksData.filter(book => !book.available);

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Admin Dashboard" 
        description="Library management overview and statistics" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Books" 
          value="1,255" 
          icon={Book}
          description="12 added this month"
          trend="up"
          trendValue="+3.2%"
        />
        <StatCard 
          title="Active Members" 
          value="382" 
          icon={UserRound}
          description="5 new this week"
          trend="up"
          trendValue="+2.1%"
        />
        <StatCard 
          title="Books Borrowed" 
          value="85" 
          icon={BookCopy}
          description="Current month"
          trend="down"
          trendValue="-1.5%"
        />
        <StatCard 
          title="Overdue Returns" 
          value="12" 
          icon={Clock}
          description="Needs attention"
          trend="up"
          trendValue="+2"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Books Borrowed per Month</CardTitle>
            <CardDescription>
              Number of books borrowed in the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={booksByMonthData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar dataKey="books" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Books by Genre</CardTitle>
            <CardDescription>
              Distribution of books across different genres
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={booksByGenreData} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Bar dataKey="books" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recently Borrowed Books</CardTitle>
            <CardDescription>
              Books that are currently borrowed by members
            </CardDescription>
          </div>
          <Button asChild className="bg-lms-blue hover:bg-lms-blue-dark">
            <Link to="/books">View All Books</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {borrowedBooks.slice(0, 5).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Button asChild className="bg-lms-green hover:bg-lms-green-dark">
            <Link to="/admin-tools">
              Add New Book
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin-tools">
              Manage Members
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin-tools">
              Generate Reports
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin-tools">
              Check Overdue Books
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
