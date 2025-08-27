import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfService() {
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Terms of Service" 
        description="Please read these terms carefully before using our library management system" 
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              By accessing and using the Library Management System, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Library Services</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              Our library management system provides the following services:
            </p>
            <ul>
              <li>Book borrowing and return management</li>
              <li>Digital catalog browsing</li>
              <li>Account management for library members</li>
              <li>Administrative tools for library staff</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. User Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>As a user of our system, you agree to:</p>
            <ul>
              <li>Provide accurate and current information when registering</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Return borrowed books on time and in good condition</li>
              <li>Pay any applicable fines for late returns or damaged items</li>
              <li>Use the system only for lawful purposes</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Borrowing Policies</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <ul>
              <li>Maximum of 5 books can be borrowed at any time</li>
              <li>Standard loan period is 14 days</li>
              <li>Books can be renewed if no other requests are pending</li>
              <li>Late fees may apply for overdue items</li>
              <li>Lost or damaged books must be paid for at replacement cost</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Privacy and Data Protection</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              We are committed to protecting your privacy. Your personal information is collected and used in accordance with our Privacy Policy. We do not sell, trade, or rent your personal information to third parties.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              The library shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages resulting from the use or inability to use the library management system.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Modifications</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              The library reserves the right to modify these terms at any time. Users will be notified of significant changes via email or system notifications.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              For questions about these terms, please contact us at: <br />
              Email: contact@subashsdhami.com.np <br />
              Developer: Subash Singh Dhami
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
