
import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  const { username, role } = useAuth();
  
  // For demo purposes, let's create some fake user data
  const userData = {
    fullName: username === "admin" ? "Admin User" : "John Doe",
    email: username === "admin" ? "admin@library.com" : "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Library St, Booktown, BK 12345",
    memberSince: "January 15, 2023",
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Profile" 
        description="Manage your account information" 
      >
        <Button className="bg-lms-blue hover:bg-lms-blue-dark">
          Edit Profile
        </Button>
      </PageHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className={role === "admin" ? "bg-lms-green text-white text-3xl" : "bg-lms-blue text-white text-3xl"}>
                  {username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle>{userData.fullName}</CardTitle>
            <p className="text-sm text-muted-foreground capitalize">{role} Account</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Email</div>
                <div>{userData.email}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Member Since</div>
                <div>{userData.memberSince}</div>
              </div>
              <Separator className="my-2" />
              {role === "user" && (
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-medium">Account Status</div>
                    <div className="text-lms-green">Active</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Borrowed Books</div>
                    <div>2 books</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Reading Preferences</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <div className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Fiction</div>
                      <div className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Fantasy</div>
                      <div className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Mystery</div>
                    </div>
                  </div>
                </div>
              )}
              {role === "admin" && (
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-medium">Role</div>
                    <div className="text-lms-green">System Administrator</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Permissions</div>
                    <div>Full Access</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Last Login</div>
                    <div>Today, 10:30 AM</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={userData.fullName} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={userData.email} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" value={userData.phone} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={role === "admin" ? "Administrator" : "Library Member"} readOnly />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={userData.address} readOnly />
              </div>
              
              {role === "user" && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Email Notifications</div>
                          <div className="text-sm text-muted-foreground">Receive email updates about your account</div>
                        </div>
                        <div className="ml-4">
                          <div className="w-10 h-5 bg-lms-green rounded-full relative">
                            <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Reading Activity</div>
                          <div className="text-sm text-muted-foreground">Show your reading activity on your profile</div>
                        </div>
                        <div className="ml-4">
                          <div className="w-10 h-5 bg-muted rounded-full relative">
                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {role === "admin" && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium mb-4">System Permissions</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Manage Books</span>
                        <span className="text-lms-green">Full Access</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Manage Users</span>
                        <span className="text-lms-green">Full Access</span>
                      </div>
                      <div className="flex justify-between">
                        <span>View Reports</span>
                        <span className="text-lms-green">Full Access</span>
                      </div>
                      <div className="flex justify-between">
                        <span>System Configuration</span>
                        <span className="text-lms-green">Full Access</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
