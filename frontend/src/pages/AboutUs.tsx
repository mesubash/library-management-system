
import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Map, Phone, UserRound } from "lucide-react";

export default function AboutUs() {
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
              <h3 className="text-xl font-semibold mb-4">Our Team</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[
                  { name: "Subash Singh Dhami", role: "Lead Developer", img: "https://i.pravatar.cc/300?img=1" },
                  { name: "Nepal Library Team", role: "Support Team", img: "https://i.pravatar.cc/300?img=3" },
                  { name: "Community Librarians", role: "Local Partners", img: "https://i.pravatar.cc/300?img=5" },
                  { name: "Tech Support", role: "System Maintenance", img: "https://i.pravatar.cc/300?img=7" },
                ].map((member, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
                      <img 
                        src={member.img} 
                        alt={member.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-semibold">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
