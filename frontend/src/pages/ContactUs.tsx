
import React, { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll respond shortly.",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Contact Us" 
        description="Get in touch with our library team" 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-6">
              Have a question or feedback about our library services? We'd love to hear from you!
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="p-2 bg-primary/10 text-primary rounded-md mr-4">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Our Location</h3>
                  <p className="text-sm text-muted-foreground">
                    123 Library Street<br />
                    Booktown, BK 12345<br />
                    United States
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 bg-primary/10 text-primary rounded-md mr-4">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Email Us</h3>
                  <p className="text-sm text-muted-foreground">
                    info@library.com<br />
                    support@library.com
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 bg-primary/10 text-primary rounded-md mr-4">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Call Us</h3>
                  <p className="text-sm text-muted-foreground">
                    (555) 123-4567<br />
                    Mon-Fri, 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-medium mb-3">Library Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>12:00 PM - 5:00 PM</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Send a Message</h2>
            <p className="text-muted-foreground mb-6">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter your name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  placeholder="What is your message about?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)} 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Type your message here"
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)} 
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="bg-lms-green hover:bg-lms-green-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6">Find Us</h2>
          <div className="relative h-[400px] w-full bg-muted rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48376.60768981954!2d-73.9845156143392!3d40.75849833922266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2590099a8a8a9%3A0xa4a37b097f83f389!2sNew%20York%20Public%20Library%20-%20Stephen%20A.%20Schwarzman%20Building!5e0!3m2!1sen!2sus!4v1714153262897!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Map"
            ></iframe>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Frequently Asked Questions</h3>
            <div className="space-y-4 mt-3">
              <div>
                <h4 className="font-medium">What are the library membership fees?</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Our basic membership is free for all residents. Premium memberships with additional benefits are available for $5 per month.
                </p>
              </div>
              <div>
                <h4 className="font-medium">How long can I borrow books for?</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  The standard borrowing period is 14 days. You can renew books up to 2 times if no one else has requested them.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Do you offer digital resources?</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Yes, we offer e-books, audiobooks, and digital magazines through our online platform. These are available to all members.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
