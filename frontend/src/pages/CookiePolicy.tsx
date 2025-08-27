import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CookiePolicy() {
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Cookie Policy" 
        description="How we use cookies and similar technologies" 
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>What Are Cookies?</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              Cookies are small text files that are stored on your computer or mobile device when you visit our library management system. They help us provide you with a better experience by remembering your preferences and improving our services.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Types of Cookies We Use</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h4>Essential Cookies</h4>
            <p>These cookies are necessary for the website to function properly. They enable core functionality such as:</p>
            <ul>
              <li>Authentication and login sessions</li>
              <li>Security features</li>
              <li>Form submissions</li>
              <li>Shopping cart functionality (if applicable)</li>
            </ul>

            <h4>Functional Cookies</h4>
            <p>These cookies enable enhanced functionality and personalization:</p>
            <ul>
              <li>Remembering your login credentials</li>
              <li>Storing your theme preferences (light/dark mode)</li>
              <li>Language and region settings</li>
              <li>User interface customizations</li>
            </ul>

            <h4>Analytics Cookies</h4>
            <p>These cookies help us understand how visitors use our website:</p>
            <ul>
              <li>Page views and popular content</li>
              <li>User navigation patterns</li>
              <li>System performance monitoring</li>
              <li>Error tracking and debugging</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Third-Party Cookies</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>We may use third-party services that set their own cookies:</p>
            <ul>
              <li><strong>Supabase:</strong> For authentication and database services</li>
              <li><strong>Analytics Services:</strong> To understand user behavior and improve our services</li>
              <li><strong>CDN Services:</strong> For faster content delivery</li>
            </ul>
            <p>These third parties have their own privacy policies and cookie practices.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Managing Cookies</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>You can control and manage cookies in several ways:</p>
            
            <h4>Browser Settings</h4>
            <ul>
              <li>Most browsers allow you to view, manage, and delete cookies</li>
              <li>You can set your browser to reject all cookies or only third-party cookies</li>
              <li>You can set your browser to prompt you before accepting cookies</li>
            </ul>

            <h4>System Settings</h4>
            <p>In our library management system, you can:</p>
            <ul>
              <li>Manage your preferences in the Settings page</li>
              <li>Choose which types of cookies to accept</li>
              <li>Opt-out of non-essential tracking</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cookie Retention</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>Different cookies have different lifespans:</p>
            <ul>
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until manually deleted</li>
              <li><strong>Authentication Cookies:</strong> Typically expire after 30 days of inactivity</li>
              <li><strong>Preference Cookies:</strong> May persist for up to 1 year</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Impact of Disabling Cookies</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>If you disable cookies, some features may not work properly:</p>
            <ul>
              <li>You may need to log in repeatedly</li>
              <li>Your preferences and settings may not be saved</li>
              <li>Some features may not function correctly</li>
              <li>The user experience may be degraded</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Updates to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              We may update this cookie policy from time to time to reflect changes in technology, legal requirements, or our practices. We will notify you of any significant changes by posting the updated policy on our website.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              If you have any questions about our use of cookies or this cookie policy, please contact us at: <br />
              Email: contact@subashsdhami.com.np <br />
              Developer: Subash Singh Dhami <br />
              Location: Nepal
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
