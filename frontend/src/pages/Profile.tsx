import React, { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useBorrowRecords } from "@/hooks/useLibraryData";
import { User, Calendar, BookOpen, Book, Lock } from "lucide-react";
import { getPlaceholderImage } from "@/lib/imageUpload";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export default function Profile() {
  const { user, profile, username } = useAuth();
  const { records } = useBorrowRecords();
  const [isBorrowedBooksOpen, setIsBorrowedBooksOpen] = useState(false);
  const { toast } = useToast();
  
  // Password change state
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Check if this is a test user (disable password change for test accounts)
  const isTestUser = profile?.email === 'user@lms.com' || profile?.email === 'admin@lms.com';

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password don't match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      // Update password using Supabase auth
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });

      // Reset form and close dialog
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsPasswordDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Password Change Failed",
        description: error.message || "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  // Generate a consistent placeholder image for this user
  const profileImageUrl = getPlaceholderImage('profile', user?.id || profile?.name || 'User');

  // Calculate dynamic stats
  const userRecords = records.filter(record => record.user_id === profile?.id);
  const totalBorrowed = userRecords.length;
  const totalReturned = userRecords.filter(record => record.status === 'returned').length;
  const currentBorrowed = userRecords.filter(record => record.status === 'borrowed').length;
  const currentBorrowedBooks = userRecords.filter(record => record.status === 'borrowed');
  
  // Calculate fines (overdue books with late fees)
  const overdueRecords = userRecords.filter(record => 
    record.status === 'borrowed' && 
    new Date(record.due_date) < new Date()
  );
  const totalFines = overdueRecords.reduce((total, record) => total + (record.fine || 0), 0);
  
  // Determine account status based on fines and borrowing behavior
  const accountStatus = totalFines > 0 ? 'Warning' : 'Active';
  const membershipType = profile?.role === 'admin' ? 'Administrator' : 'Standard';

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="My Profile" 
        description="Manage your account information and library activity" 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                View your personal information and change your password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Image Section */}
              <div className="space-y-4">
                <Label>Profile Picture</Label>
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profileImageUrl} alt={profile?.name} />
                    <AvatarFallback className="text-lg">
                      {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      Your profile picture is automatically generated based on your name.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile?.name || username || ""}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Account Type</Label>
                <Input
                  id="role"
                  value={profile?.role || "user"}
                  readOnly
                  className="bg-muted capitalize"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="member-since">Member Since</Label>
                <Input
                  id="member-since"
                  value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}
                  readOnly
                  className="bg-muted"
                />
              </div>
              
              {/* Password Change Section */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Password</h3>
                    <p className="text-sm text-muted-foreground">
                      Change your account password
                    </p>
                  </div>
                  <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        disabled={isTestUser}
                        variant="outline"
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                          Enter your current password and choose a new one.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input
                            id="current-password"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({
                              ...prev,
                              currentPassword: e.target.value
                            }))}
                            placeholder="Enter current password"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input
                            id="new-password"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({
                              ...prev,
                              newPassword: e.target.value
                            }))}
                            placeholder="Enter new password"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({
                              ...prev,
                              confirmPassword: e.target.value
                            }))}
                            placeholder="Confirm new password"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsPasswordDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handlePasswordChange}
                            disabled={isChangingPassword}
                          >
                            {isChangingPassword ? "Changing..." : "Change Password"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                {isTestUser && (
                  <p className="text-sm text-amber-600">
                    Password change is disabled for test accounts.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Library Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Books Borrowed</p>
                  <p className="text-2xl font-bold">{totalBorrowed}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Books Returned</p>
                  <p className="text-2xl font-bold">{totalReturned}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <User className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Current Borrowed</p>
                  <p className="text-2xl font-bold">{currentBorrowed}</p>
                </div>
                {currentBorrowed > 0 && (
                  <Dialog open={isBorrowedBooksOpen} onOpenChange={setIsBorrowedBooksOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Book className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>My Borrowed Books</DialogTitle>
                        <DialogDescription>
                          Books currently borrowed by you
                        </DialogDescription>
                      </DialogHeader>
                      <div className="max-h-96 overflow-y-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Book Title</TableHead>
                              <TableHead>Author</TableHead>
                              <TableHead>Borrowed Date</TableHead>
                              <TableHead>Due Date</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentBorrowedBooks.map((record) => (
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
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Account Status</span>
                  <Badge variant={accountStatus === 'Active' ? 'default' : 'destructive'}>
                    {accountStatus}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Membership Type</span>
                  <Badge variant={membershipType === 'Administrator' ? 'default' : 'secondary'}>
                    {membershipType}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Outstanding Fines</span>
                  <Badge variant={totalFines > 0 ? 'destructive' : 'secondary'}>
                    ${totalFines.toFixed(2)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
