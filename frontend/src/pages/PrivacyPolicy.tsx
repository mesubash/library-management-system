import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Privacy Policy" 
        description="How we collect, use, and protect your personal information" 
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>We collect the following types of information:</p>
            <ul>
              <li><strong>Personal Information:</strong> Name, email address, phone number, and address when you register for a library account</li>
              <li><strong>Usage Information:</strong> Books borrowed, return dates, search history, and system usage patterns</li>
              <li><strong>Technical Information:</strong> IP address, browser type, device information, and access logs</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>Your information is used for:</p>
            <ul>
              <li>Managing your library account and borrowing privileges</li>
              <li>Sending notifications about due dates, holds, and library updates</li>
              <li>Improving our services and user experience</li>
              <li>Maintaining system security and preventing misuse</li>
              <li>Generating anonymous usage statistics</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Information Sharing</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>We do not sell, trade, or rent your personal information to third parties. Information may be shared only in the following circumstances:</p>
            <ul>
              <li>With your explicit consent</li>
              <li>When required by law or legal process</li>
              <li>To protect the rights, property, or safety of the library, users, or others</li>
              <li>With service providers who assist in operating our system (under strict confidentiality agreements)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Security</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>We implement appropriate security measures to protect your personal information:</p>
            <ul>
              <li>Encrypted data transmission using SSL/TLS protocols</li>
              <li>Secure database storage with access controls</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal information on a need-to-know basis</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>You have the right to:</p>
            <ul>
              <li>Access and review your personal information</li>
              <li>Request corrections to inaccurate information</li>
              <li>Request deletion of your account and personal data</li>
              <li>Opt-out of non-essential communications</li>
              <li>Export your data in a portable format</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>Our system uses cookies and similar technologies to:</p>
            <ul>
              <li>Maintain your login session</li>
              <li>Remember your preferences and settings</li>
              <li>Analyze system usage and performance</li>
              <li>Provide a personalized experience</li>
            </ul>
            <p>You can control cookie settings through your browser preferences.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>We retain your personal information for as long as:</p>
            <ul>
              <li>Your account remains active</li>
              <li>Required to provide library services</li>
              <li>Necessary for legal, accounting, or reporting requirements</li>
              <li>You have outstanding obligations (overdue books, fines, etc.)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              We may update this privacy policy from time to time. We will notify you of any material changes by posting the new privacy policy on this page and sending an email notification.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              If you have any questions about this privacy policy or our data practices, please contact us at: <br />
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
