
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, MessageSquare, Clock, AlertCircle } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name || !email || !subject || !message || !category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll respond shortly.",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setCategory("");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-bet-primary">Contact Us</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're here to help! Reach out to our team with any questions, concerns, or feedback. 
              Our customer support team is available 24/7.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="border-bet-accent/20 hover:border-bet-accent/50 transition-all">
              <CardHeader className="pb-2">
                <div className="mb-4 w-12 h-12 rounded-full bg-bet-accent/10 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-bet-accent" />
                </div>
                <CardTitle>Call Us</CardTitle>
                <CardDescription>Speak directly with our support team</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-1">Main Support Line:</p>
                <p className="font-medium mb-4">+250 7XX XXX XXX</p>
                <p className="text-sm text-muted-foreground mb-1">VIP Support:</p>
                <p className="font-medium">+250 7XX XXX XXX</p>
              </CardContent>
            </Card>
            
            <Card className="border-bet-primary/20 hover:border-bet-primary/50 transition-all">
              <CardHeader className="pb-2">
                <div className="mb-4 w-12 h-12 rounded-full bg-bet-primary/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-bet-primary" />
                </div>
                <CardTitle>Email Us</CardTitle>
                <CardDescription>Send us a message anytime</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-1">Customer Support:</p>
                <p className="font-medium mb-4">support@urbanbet.com</p>
                <p className="text-sm text-muted-foreground mb-1">Responsible Gambling:</p>
                <p className="font-medium">responsible@urbanbet.com</p>
              </CardContent>
            </Card>
            
            <Card className="border-bet-secondary/20 hover:border-bet-secondary/50 transition-all">
              <CardHeader className="pb-2">
                <div className="mb-4 w-12 h-12 rounded-full bg-bet-secondary/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-bet-secondary" />
                </div>
                <CardTitle>Visit Us</CardTitle>
                <CardDescription>Our office location</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-1">Headquarters:</p>
                <p className="font-medium mb-4">123 Urban Street, Kigali, Rwanda</p>
                <p className="text-sm text-muted-foreground mb-1">Office Hours:</p>
                <p className="font-medium">Mon-Fri: 9am-5pm</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" /> Send Us a Message
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name <span className="text-bet-danger">*</span></Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address <span className="text-bet-danger">*</span></Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category <span className="text-bet-danger">*</span></Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="account">Account Issues</SelectItem>
                          <SelectItem value="deposit">Deposits & Withdrawals</SelectItem>
                          <SelectItem value="bonus">Bonuses & Promotions</SelectItem>
                          <SelectItem value="betting">Betting Questions</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="responsible">Responsible Gambling</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject <span className="text-bet-danger">*</span></Label>
                      <Input
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Enter subject"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message <span className="text-bet-danger">*</span></Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter your message..."
                        rows={6}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-bet-primary hover:bg-bet-primary/90" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" /> Support Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-1">Customer Support</h3>
                      <p className="text-sm text-muted-foreground">24/7, including holidays</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Live Chat</h3>
                      <p className="text-sm text-muted-foreground">24/7, including holidays</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Email Response Time</h3>
                      <p className="text-sm text-muted-foreground">Within 24 hours</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Office Hours</h3>
                      <p className="text-sm text-muted-foreground">Monday - Friday: 9:00 AM - 5:00 PM</p>
                      <p className="text-sm text-muted-foreground">Saturday - Sunday: Closed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" /> Urgent Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    For urgent issues requiring immediate attention, please use our 24/7 Live Chat service 
                    or call our emergency support line.
                  </p>
                  
                  <div className="bg-bet-primary/10 border border-bet-primary/30 rounded-lg p-4 mb-4">
                    <h3 className="font-medium mb-1">Emergency Support Line</h3>
                    <p className="text-sm">+250 7XX XXX XXX</p>
                  </div>
                  
                  <Button className="w-full">Start Live Chat</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
