import React, { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { User, Bell, Shield, Palette, Download, Trash2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function Settings() {
  const { profile, role } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Profile settings state
  const [profileData, setProfileData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    profileImage: profile?.profile_image_url || "",
  });

  // Notification settings state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    borrowReminders: true,
    overdueNotices: true,
    newBooks: false,
  });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement profile update logic
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    toast({
      title: "Data Export",
      description: "Your data export will be sent to your email address.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion",
      description: "Please contact support to delete your account.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Settings" 
        description="Manage your account settings and preferences" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Settings */}
        <div className="space-y-6">
          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the app's appearance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Role:</span>
                <span className="text-sm font-medium capitalize">{role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Member since:</span>
                <span className="text-sm font-medium">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notification Settings */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose what notifications you want to receive.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for important updates.
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, emailNotifications: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="borrow-reminders">Borrow Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get reminded about upcoming due dates.
                </p>
              </div>
              <Switch
                id="borrow-reminders"
                checked={notifications.borrowReminders}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, borrowReminders: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="overdue-notices">Overdue Notices</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications for overdue books.
                </p>
              </div>
              <Switch
                id="overdue-notices"
                checked={notifications.overdueNotices}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, overdueNotices: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="new-books">New Book Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when new books are added.
                </p>
              </div>
              <Switch
                id="new-books"
                checked={notifications.newBooks}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, newBooks: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Data & Privacy</CardTitle>
            <CardDescription>
              Manage your data and account deletion.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleExportData}
            >
              <Download className="h-4 w-4 mr-2" />
              Export My Data
            </Button>
            <Button 
              variant="destructive" 
              className="w-full justify-start"
              onClick={handleDeleteAccount}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
