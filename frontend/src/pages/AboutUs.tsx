
import React, { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, Map, Phone, UserRound, Github, Globe, Mail, Code, Award, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPlaceholderImage } from "@/lib/imageUpload";

export default function AboutUs() {
  const [isDeveloperDialogOpen, setIsDeveloperDialogOpen] = useState(false);
  
  // Generate consistent placeholder for developer
  const developerAvatar = getPlaceholderImage('profile', 'Subash Singh Dhami');

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="About Us" 
        description="Learn more about our library and mission" 
      />
      
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Our Mission</h2>
            <p className="text-muted-foreground">
              The Library Management System aims to provide an accessible, efficient, and modern platform for 
              libraries across Nepal. Our mission is to promote literacy, lifelong learning, and community 
              engagement by making knowledge resources readily available to all Nepali communities, from the 
              bustling cities to the remote mountain villages.
            </p>
            
            <div className="relative h-60 overflow-hidden rounded-lg mt-8">
              <img 
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66"
                alt="Library interior" 
                className="object-cover w-full h-full"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Our History</h3>
                <p className="text-muted-foreground">
                  Established in 2020, our library management system was created to serve the diverse communities 
                  of Nepal. We have grown from supporting a few local libraries to becoming a comprehensive 
                  digital platform that serves libraries across the beautiful country of Nepal. We continuously evolve 
                  our services to meet the changing needs of Nepali communities, embracing new technologies while 
                  maintaining our commitment to making knowledge accessible.
                </p>
                <p className="text-muted-foreground mt-4">
                  Today, we are proud to support libraries from Kathmandu to rural villages, offering a vast 
                  collection of books in Nepali and English. Our dedicated team works tirelessly to ensure that 
                  every library using our platform can serve their community effectively, promoting education 
                  and literacy throughout Nepal.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">What We Offer</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="mr-2 p-1 bg-primary/10 text-primary rounded-full mt-0.5">
                      <UserRound className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-medium">User-Friendly System:</span> Our platform is designed to be intuitive and easy to use for both librarians and members.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 p-1 bg-primary/10 text-primary rounded-full mt-0.5">
                      <UserRound className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-medium">Vast Collection:</span> Access to thousands of books across various genres and categories.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 p-1 bg-primary/10 text-primary rounded-full mt-0.5">
                      <UserRound className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-medium">Digital Resources:</span> E-books, audiobooks, and digital subscriptions.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 p-1 bg-primary/10 text-primary rounded-full mt-0.5">
                      <UserRound className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-medium">Personalized Recommendations:</span> Get book suggestions based on your reading history.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 p-1 bg-primary/10 text-primary rounded-full mt-0.5">
                      <UserRound className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-medium">Community Events:</span> Workshops, book clubs, and author talks.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-primary/10 mb-4">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Library Hours</h3>
                    <div className="space-y-1 text-sm">
                      <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                      <p>Saturday: 10:00 AM - 6:00 PM</p>
                      <p>Sunday: 12:00 PM - 5:00 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-primary/10 mb-4">
                      <Map className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Location</h3>
                    <div className="space-y-1 text-sm">
                      <p>Kathmandu, Nepal</p>
                      <p>Bagmati Province</p>
                      <p>Nepal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-primary/10 mb-4">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Contact Us</h3>
                    <div className="space-y-1 text-sm">
                      <p>Developer: Subash Singh Dhami</p>
                      <p>Email: contact@subashsdhami.com.np</p>
                      <p>Support: contact@subashsdhami.com.np</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-6">Meet the Developer</h3>
              <div className="flex justify-center">
                <Card className="max-w-md w-full">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <Avatar className="h-24 w-24 border-4 border-primary/20">
                        <AvatarImage src={developerAvatar} alt="Subash Singh Dhami" />
                        <AvatarFallback className="text-xl font-bold">SD</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-lg font-bold">Subash Singh Dhami</h4>
                        <p className="text-muted-foreground mb-2">Full Stack Developer</p>
                        <div className="flex justify-center gap-2 mb-4">
                          <Badge variant="secondary" className="text-xs">
                            <Code className="h-3 w-3 mr-1" />
                            Full Stack
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Award className="h-3 w-3 mr-1" />
                            React Expert
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Passionate developer from Nepal, creating modern web applications 
                        to serve communities and promote digital literacy.
                      </p>
                      <Dialog open={isDeveloperDialogOpen} onOpenChange={setIsDeveloperDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <UserRound className="h-4 w-4 mr-2" />
                            See Developer Info
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={developerAvatar} alt="Subash Singh Dhami" />
                                <AvatarFallback>SD</AvatarFallback>
                              </Avatar>
                              Subash Singh Dhami - Developer Profile
                            </DialogTitle>
                            <DialogDescription>
                              Full Stack Developer & Technology Enthusiast from Nepal
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6 p-2">
                            {/* About Section */}
                            <div>
                              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <Heart className="h-5 w-5 text-red-500" />
                                About Me
                              </h4>
                              <p className="text-muted-foreground">
                                I'm a passionate Developer passionate about innovative digital solutions that make a positive impact on communities.
                              </p>
                            </div>

                           

                            {/* Contact Information */}
                            <div>
                              <h4 className="text-lg font-semibold mb-3">Contact & Links</h4>
                              <div className="grid grid-cols-1 gap-3">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                  <Globe className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium">Portfolio Website</p>
                                    <a 
                                      href="https://subashsdhami.com.np" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-sm text-blue-600 hover:underline break-all"
                                    >
                                      subashsdhami.com.np
                                    </a>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                  <Mail className="h-5 w-5 text-green-500 flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium">Email</p>
                                    <a 
                                      href="mailto:contact@subashsdhami.com.np"
                                      className="text-sm text-green-600 hover:underline break-all"
                                    >
                                      contact@subashsdhami.com.np
                                    </a>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                  <Github className="h-5 w-5 text-gray-700 flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium">GitHub</p>
                                    <a 
                                      href="https://github.com/subashsigdel" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-sm text-gray-600 hover:underline break-all"
                                    >
                                      github.com/subashsigdel
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Mission Statement */}
                            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                              <h4 className="text-lg font-semibold mb-2 text-primary">Mission</h4>
                              <p className="text-sm text-muted-foreground">
                                "To leverage technology in creating meaningful solutions that serve communities, 
                                promote education, and contribute to the digital transformation of Nepal while 
                                maintaining the highest standards of code quality and user experience."
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
