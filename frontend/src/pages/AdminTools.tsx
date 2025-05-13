
import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BookOpenText, FileSpreadsheet, Upload, UserRound, Users } from "lucide-react";

export default function AdminTools() {
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Admin Tools" 
        description="Manage books, users, and library operations" 
      />
      
      <Tabs defaultValue="add-book" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList className="grid grid-cols-4 w-full md:w-[600px]">
            <TabsTrigger value="add-book">Add Book</TabsTrigger>
            <TabsTrigger value="manage-users">Manage Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="add-book" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Book</CardTitle>
              <CardDescription>
                Enter the details of the book you want to add to the library
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Enter book title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input id="author" placeholder="Enter author name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input id="isbn" placeholder="Enter ISBN" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="publisher">Publisher</Label>
                    <Input id="publisher" placeholder="Enter publisher" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="genre">Genre</Label>
                    <Select>
                      <SelectTrigger id="genre">
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fiction">Fiction</SelectItem>
                        <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="biography">Biography</SelectItem>
                        <SelectItem value="fantasy">Fantasy</SelectItem>
                        <SelectItem value="mystery">Mystery</SelectItem>
                        <SelectItem value="romance">Romance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="publication-date">Publication Date</Label>
                    <Input id="publication-date" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Enter book description" 
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cover">Book Cover</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-40 border-2 border-dashed rounded-md flex items-center justify-center">
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Upload Cover</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Drag and drop or click to upload a cover image.
                      <br />
                      Recommended size: 400x600px. Max file size: 2MB.
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="bg-lms-green hover:bg-lms-green-dark">
                    Add Book
                  </Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/10 pb-2">
                <CardTitle className="flex items-center gap-2">
                  <BookOpenText className="h-5 w-5" />
                  <span>Book Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    View All Books
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Edit Existing Books
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Manage Categories
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Import Books (CSV)
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/10 pb-2">
                <CardTitle className="flex items-center gap-2">
                  <BookOpenText className="h-5 w-5" />
                  <span>Borrowing Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Check Out Books
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Return Books
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    View Borrowed Books
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Manage Due Dates
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/10 pb-2">
                <CardTitle className="flex items-center gap-2">
                  <BookOpenText className="h-5 w-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Generate Barcode
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Print Book Labels
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Check Book Status
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Book Maintenance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="manage-users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Library Members</CardTitle>
              <CardDescription>
                View and manage user accounts, memberships, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
                <div className="flex-1 relative">
                  <Input 
                    placeholder="Search users by name or email..." 
                    className="pl-8"
                  />
                </div>
                
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button className="bg-lms-green hover:bg-lms-green-dark">
                    <UserRound className="mr-2 h-4 w-4" />
                    Add New Member
                  </Button>
                </div>
              </div>
              
              <div className="rounded-md border">
                <div className="grid grid-cols-5 p-4 bg-muted/50 font-medium">
                  <div>Name</div>
                  <div>Email</div>
                  <div>Status</div>
                  <div>Books</div>
                  <div>Actions</div>
                </div>
                <div className="divide-y">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="grid grid-cols-5 p-4">
                      <div className="font-medium">John Doe {i}</div>
                      <div className="text-muted-foreground">user{i}@example.com</div>
                      <div>
                        <div className={`px-2 py-1 rounded-full text-xs inline-flex ${
                          i % 3 === 0 
                            ? "bg-yellow-100 text-yellow-800"
                            : i % 2 === 0
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                          {i % 3 === 0 ? "Overdue" : i % 2 === 0 ? "Inactive" : "Active"}
                        </div>
                      </div>
                      <div>{i % 3} borrowed</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing 5 of 120 members
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm" className="bg-primary text-white">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/10 pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>Member Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    View All Members
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Add New Member
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Edit Member
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Member Activity Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/10 pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>Membership</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Membership Plans
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Renew Membership
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Membership Cards
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Membership Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/10 pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Send Mass Email
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Import Members (CSV)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Export Member List
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Member Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Library Reports</CardTitle>
              <CardDescription>
                Generate and view reports on library operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileSpreadsheet className="h-5 w-5 text-lms-green" />
                      Borrowing Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground mb-3">
                      View details about borrowed books, due dates, and overdue items.
                    </p>
                    <Button className="w-full bg-lms-green hover:bg-lms-green-dark">Generate</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileSpreadsheet className="h-5 w-5 text-lms-blue" />
                      Book Inventory
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground mb-3">
                      Complete inventory of all books, including availability status.
                    </p>
                    <Button className="w-full bg-lms-blue hover:bg-lms-blue-dark">Generate</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileSpreadsheet className="h-5 w-5 text-lms-green" />
                      Member Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground mb-3">
                      Track member activity, including borrowing history and engagement.
                    </p>
                    <Button className="w-full bg-lms-green hover:bg-lms-green-dark">Generate</Button>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Custom Report</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Generate a custom report by selecting parameters below
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="report-type">Report Type</Label>
                      <Select defaultValue="borrowing">
                        <SelectTrigger id="report-type">
                          <SelectValue placeholder="Select Report Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="borrowing">Borrowing Report</SelectItem>
                          <SelectItem value="inventory">Inventory Report</SelectItem>
                          <SelectItem value="member">Member Report</SelectItem>
                          <SelectItem value="overdue">Overdue Report</SelectItem>
                          <SelectItem value="financial">Financial Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date-range">Date Range</Label>
                      <Select defaultValue="month">
                        <SelectTrigger id="date-range">
                          <SelectValue placeholder="Select Date Range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="week">This Week</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                          <SelectItem value="quarter">This Quarter</SelectItem>
                          <SelectItem value="year">This Year</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="format">Output Format</Label>
                      <Select defaultValue="pdf">
                        <SelectTrigger id="format">
                          <SelectValue placeholder="Select Format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="detail-level">Detail Level</Label>
                      <Select defaultValue="standard">
                        <SelectTrigger id="detail-level">
                          <SelectValue placeholder="Select Detail Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="summary">Summary</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="detailed">Detailed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button className="bg-lms-blue hover:bg-lms-blue-dark">
                    Generate Custom Report
                  </Button>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">Scheduled Reports</h3>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-4 p-4 bg-muted/50 font-medium">
                      <div>Report Name</div>
                      <div>Frequency</div>
                      <div>Last Generated</div>
                      <div>Actions</div>
                    </div>
                    <div className="divide-y">
                      <div className="grid grid-cols-4 p-4">
                        <div className="font-medium">Monthly Borrowing Summary</div>
                        <div>Monthly</div>
                        <div>May 1, 2025</div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Generate Now</Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 p-4">
                        <div className="font-medium">Weekly Overdue Report</div>
                        <div>Weekly</div>
                        <div>May 7, 2025</div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Generate Now</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Library Settings</CardTitle>
              <CardDescription>
                Configure library policies, system settings, and application preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="general" className="space-y-4">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="borrowing">Borrowing</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="library-name">Library Name</Label>
                    <Input id="library-name" defaultValue="Public Library" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="library-contact">Contact Email</Label>
                    <Input id="library-contact" defaultValue="contact@library.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="library-address">Library Address</Label>
                    <Textarea id="library-address" defaultValue="123 Library Street, Booktown, BK 12345" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="library-hours">Operating Hours</Label>
                    <Textarea 
                      id="library-hours" 
                      defaultValue={
                        "Monday - Friday: 9:00 AM - 8:00 PM\n" +
                        "Saturday: 10:00 AM - 6:00 PM\n" +
                        "Sunday: 12:00 PM - 5:00 PM"
                      }
                    />
                  </div>
                  <Button className="bg-lms-green hover:bg-lms-green-dark">
                    Save Changes
                  </Button>
                </TabsContent>
                
                <TabsContent value="borrowing" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-books">Maximum Books Per User</Label>
                    <Input id="max-books" type="number" defaultValue="5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loan-period">Loan Period (Days)</Label>
                    <Input id="loan-period" type="number" defaultValue="14" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grace-period">Grace Period (Days)</Label>
                    <Input id="grace-period" type="number" defaultValue="3" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fine-rate">Fine Rate ($ per day)</Label>
                    <Input id="fine-rate" type="number" step="0.01" defaultValue="0.50" />
                  </div>
                  <Button className="bg-lms-green hover:bg-lms-green-dark">
                    Save Changes
                  </Button>
                </TabsContent>
                
                <TabsContent value="notifications" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Due Date Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Send email reminders before books are due
                        </p>
                      </div>
                      <div className="ml-4">
                        <div className="w-10 h-5 bg-lms-green rounded-full relative">
                          <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Overdue Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Send notifications for overdue books
                        </p>
                      </div>
                      <div className="ml-4">
                        <div className="w-10 h-5 bg-lms-green rounded-full relative">
                          <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Book Recommendations</Label>
                        <p className="text-sm text-muted-foreground">
                          Send book recommendations based on user history
                        </p>
                      </div>
                      <div className="ml-4">
                        <div className="w-10 h-5 bg-muted rounded-full relative">
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>New Book Arrivals</Label>
                        <p className="text-sm text-muted-foreground">
                          Notify users about new books added to the library
                        </p>
                      </div>
                      <div className="ml-4">
                        <div className="w-10 h-5 bg-muted rounded-full relative">
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button className="bg-lms-green hover:bg-lms-green-dark">
                    Save Changes
                  </Button>
                </TabsContent>
                
                <TabsContent value="system" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="backup-frequency">Database Backup Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger id="backup-frequency">
                        <SelectValue placeholder="Select Frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="log-retention">Log Retention (Days)</Label>
                    <Input id="log-retention" type="number" defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Take the system offline for maintenance
                        </p>
                      </div>
                      <div className="ml-4">
                        <div className="w-10 h-5 bg-muted rounded-full relative">
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button className="bg-red-500 hover:bg-red-700 mr-2">
                      Reset Database
                    </Button>
                    <Button variant="outline">
                      Download Backup
                    </Button>
                  </div>
                  <Button className="bg-lms-green hover:bg-lms-green-dark mt-4">
                    Save Changes
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
