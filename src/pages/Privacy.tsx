
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Shield, Lock, Eye, Database, Share2, AlertTriangle } from "lucide-react";

const Privacy = () => {
  const { toast } = useToast();
  
  const handleClick = () => {
    toast({
      title: "Cookie Preferences Saved",
      description: "Your cookie preferences have been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-bet-primary">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Last updated: March 15, 2025
            </p>
            <div className="flex items-center justify-center mt-4">
              <Badge variant="outline" className="mr-2 border-bet-primary text-bet-primary">GDPR Compliant</Badge>
              <Badge variant="outline" className="border-bet-accent text-bet-accent">Data Protection</Badge>
            </div>
          </div>
          
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-bet-primary" />
                    Privacy at a Glance
                  </div>
                </CardTitle>
                <CardDescription>Key points of our privacy practices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="mr-4 p-2 rounded-full bg-bet-primary/10">
                      <Lock className="h-5 w-5 text-bet-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Data Security</h3>
                      <p className="text-sm text-muted-foreground">We use advanced encryption and security measures to protect your data.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 p-2 rounded-full bg-bet-primary/10">
                      <Database className="h-5 w-5 text-bet-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Data Collection</h3>
                      <p className="text-sm text-muted-foreground">We collect only necessary information to provide our services.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 p-2 rounded-full bg-bet-primary/10">
                      <Share2 className="h-5 w-5 text-bet-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Data Sharing</h3>
                      <p className="text-sm text-muted-foreground">Your data is never sold to third parties without your consent.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 p-2 rounded-full bg-bet-primary/10">
                      <Eye className="h-5 w-5 text-bet-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Your Rights</h3>
                      <p className="text-sm text-muted-foreground">You have the right to access, correct, and delete your data.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <ScrollArea className="h-[500px] border border-border rounded-lg p-6 mb-8">
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-bold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground mb-4">
                  Urban Bet ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
                  use, disclose, and safeguard your information when you use our website, mobile application, and services.
                </p>
                <p className="text-muted-foreground">
                  Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not 
                  access our services.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-bold mb-4">2. Information We Collect</h2>
                <h3 className="text-lg font-semibold mb-2">2.1 Personal Information</h3>
                <p className="text-muted-foreground mb-4">
                  We may collect personal information that you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                  <li>Contact information (name, email address, phone number)</li>
                  <li>Account information (username, password)</li>
                  <li>Identity verification information (date of birth, identification documents)</li>
                  <li>Financial information (payment details, transaction history)</li>
                  <li>Profile information (preferences, betting history)</li>
                  <li>Communications (when you contact our customer support)</li>
                </ul>
                
                <h3 className="text-lg font-semibold mb-2">2.2 Automatically Collected Information</h3>
                <p className="text-muted-foreground mb-4">
                  When you use our services, we may automatically collect certain information, including:
                </p>
                <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                  <li>Device information (IP address, device type, operating system)</li>
                  <li>Browser information (browser type, settings)</li>
                  <li>Usage information (pages visited, time spent on pages, links clicked)</li>
                  <li>Location information (general location based on IP address)</li>
                  <li>Cookies and similar technologies (as described in our Cookie Policy)</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-bold mb-4">3. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                  <li>Providing and maintaining our services</li>
                  <li>Processing transactions and managing your account</li>
                  <li>Verifying your identity and preventing fraud</li>
                  <li>Complying with legal and regulatory requirements</li>
                  <li>Communicating with you about our services, updates, and promotions</li>
                  <li>Analyzing and improving our services</li>
                  <li>Customizing your experience and providing personalized content</li>
                  <li>Protecting our rights, property, and safety</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-bold mb-4">4. How We Share Your Information</h2>
                <p className="text-muted-foreground mb-4">
                  We may share your information with third parties in the following circumstances:
                </p>
                <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                  <li><strong>Service Providers:</strong> We may share your information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, and customer support.</li>
                  <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests from public authorities.</li>
                  <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</li>
                  <li><strong>With Your Consent:</strong> We may share your information with third parties when we have your consent to do so.</li>
                  <li><strong>Affiliates:</strong> We may share your information with our affiliates and subsidiaries for business purposes.</li>
                </ul>
                
                <div className="bg-bet-danger/10 border border-bet-danger/20 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-bet-danger mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-bet-danger mb-1">Important Notice</h4>
                      <p className="text-sm text-muted-foreground">
                        We do not sell, rent, or trade your personal information to third parties for their marketing purposes without your explicit consent.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-xl font-bold mb-4">5. Data Security</h2>
                <p className="text-muted-foreground mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information 
                  against unauthorized or unlawful processing, accidental loss, destruction, or damage. These measures include:
                </p>
                <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                  <li>Encryption of sensitive data</li>
                  <li>Regular security assessments</li>
                  <li>Access controls and authentication measures</li>
                  <li>Secure data storage practices</li>
                  <li>Staff training on data protection</li>
                </ul>
                <p className="text-muted-foreground">
                  However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect 
                  your information, we cannot guarantee its absolute security.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-bold mb-4">6. Your Rights</h2>
                <p className="text-muted-foreground mb-4">
                  Depending on your location, you may have certain rights regarding your personal information, including:
                </p>
                <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                  <li><strong>Access:</strong> You have the right to request access to the personal information we hold about you.</li>
                  <li><strong>Correction:</strong> You have the right to request correction of inaccurate or incomplete information.</li>
                  <li><strong>Deletion:</strong> You have the right to request deletion of your personal information in certain circumstances.</li>
                  <li><strong>Restriction:</strong> You have the right to request restriction of processing of your personal information.</li>
                  <li><strong>Data Portability:</strong> You have the right to receive your personal information in a structured, commonly used format.</li>
                  <li><strong>Objection:</strong> You have the right to object to processing of your personal information in certain circumstances.</li>
                </ul>
                <p className="text-muted-foreground">
                  To exercise these rights, please contact us using the information provided in the "Contact Us" section.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-bold mb-4">7. Cookies and Similar Technologies</h2>
                <p className="text-muted-foreground mb-4">
                  We use cookies and similar technologies to enhance your experience on our website, analyze usage patterns, 
                  and provide personalized content. You can control cookies through your browser settings.
                </p>
                <p className="text-muted-foreground">
                  For more information about our use of cookies, please see our Cookie Policy.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-bold mb-4">8. Children's Privacy</h2>
                <p className="text-muted-foreground">
                  Our services are not intended for individuals under the age of 18 (or the legal gambling age in your jurisdiction, 
                  whichever is higher). We do not knowingly collect personal information from children. If you believe a child has 
                  provided us with personal information, please contact us immediately.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-bold mb-4">9. International Data Transfers</h2>
                <p className="text-muted-foreground">
                  Your information may be transferred to, and processed in, countries other than the country in which you reside. 
                  These countries may have different data protection laws than your country. We ensure appropriate safeguards are in place 
                  to protect your information when transferred internationally.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-bold mb-4">10. Changes to this Privacy Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                  Privacy Policy on this page and updating the "Last updated" date. You are advised to review this 
                  Privacy Policy periodically for any changes.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-bold mb-4">11. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <p className="text-muted-foreground mt-2">
                  <strong>Email:</strong> privacy@urbanbet.com<br />
                  <strong>Address:</strong> 123 Urban Street, Kigali, Rwanda<br />
                  <strong>Phone:</strong> +250 7XX XXX XXX
                </p>
              </section>
            </div>
          </ScrollArea>
          
          <div className="border border-border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Cookie Preferences</h2>
            <p className="text-muted-foreground mb-6">
              You can customize your cookie preferences to control what data we collect. Essential cookies are required for basic 
              functionality and cannot be disabled.
            </p>
            
            <Accordion type="multiple" defaultValue={["essential"]} className="mb-6">
              <AccordionItem value="essential">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center">
                    Essential Cookies
                    <Badge className="ml-2 bg-bet-primary">Required</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground mb-2">
                    These cookies are necessary for the website to function properly. They enable basic functions like page 
                    navigation, secure areas access, and account management. The website cannot function properly without these cookies.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="performance">
                <AccordionTrigger className="text-left">Performance Cookies</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground mb-2">
                    These cookies help us understand how visitors interact with our website by collecting and reporting information 
                    anonymously. This helps us improve our website and services.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="functional">
                <AccordionTrigger className="text-left">Functional Cookies</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground mb-2">
                    These cookies enable enhanced functionality and personalization features. They may be set by us or by third-party 
                    providers whose services we have added to our pages.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="targeting">
                <AccordionTrigger className="text-left">Targeting Cookies</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground mb-2">
                    These cookies are used to show you relevant advertisements based on your interests. They also help measure the 
                    effectiveness of advertising campaigns.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="flex justify-center">
              <Button onClick={handleClick} className="px-8">Save Preferences</Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
