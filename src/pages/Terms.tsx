
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Terms = () => {
  const { toast } = useToast();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  const handleAcceptTerms = () => {
    if (acceptedTerms) {
      toast({
        title: "Terms Accepted",
        description: "Thank you for accepting our Terms and Conditions.",
      });
    } else {
      toast({
        title: "Please accept terms",
        description: "You must accept the terms and conditions to continue.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-bet-primary">Terms and Conditions</h1>
            <p className="text-muted-foreground">
              Last updated: March 15, 2025
            </p>
          </div>
          
          <div className="border border-border rounded-lg overflow-hidden mb-8">
            <div className="bg-card p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Table of Contents</h2>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                <li>
                  <a href="#introduction" className="text-bet-primary hover:underline">1. Introduction</a>
                </li>
                <li>
                  <a href="#definitions" className="text-bet-primary hover:underline">2. Definitions</a>
                </li>
                <li>
                  <a href="#account" className="text-bet-primary hover:underline">3. Account Rules</a>
                </li>
                <li>
                  <a href="#betting" className="text-bet-primary hover:underline">4. Betting Rules</a>
                </li>
                <li>
                  <a href="#deposits" className="text-bet-primary hover:underline">5. Deposits and Withdrawals</a>
                </li>
                <li>
                  <a href="#responsible" className="text-bet-primary hover:underline">6. Responsible Gambling</a>
                </li>
                <li>
                  <a href="#liability" className="text-bet-primary hover:underline">7. Limitation of Liability</a>
                </li>
                <li>
                  <a href="#intellectual" className="text-bet-primary hover:underline">8. Intellectual Property</a>
                </li>
                <li>
                  <a href="#termination" className="text-bet-primary hover:underline">9. Termination</a>
                </li>
                <li>
                  <a href="#misc" className="text-bet-primary hover:underline">10. Miscellaneous</a>
                </li>
              </ul>
            </div>
          </div>
          
          <ScrollArea className="h-[500px] border border-border rounded-lg p-6 mb-8">
            <div className="space-y-8">
              <section id="introduction">
                <h2 className="text-xl font-bold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground mb-4">
                  These Terms and Conditions govern your use of the Urban Bet website and services. By 
                  registering an account with Urban Bet or using our services, you agree to be bound by these Terms and 
                  Conditions. If you do not agree with any part of these terms, you must not use our services.
                </p>
                <p className="text-muted-foreground">
                  Urban Bet reserves the right to amend these Terms and Conditions at any time. Any changes will be 
                  effective immediately upon posting on the website. Your continued use of our services after any such changes 
                  constitutes your acceptance of the new Terms and Conditions.
                </p>
              </section>
              
              <section id="definitions">
                <h2 className="text-xl font-bold mb-4">2. Definitions</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>"Account"</strong> means the account registered by the User to access and use the Services.</li>
                  <li><strong>"Services"</strong> means all products, services, content, features, technologies, or functions 
                  offered by Urban Bet.</li>
                  <li><strong>"User"</strong> or <strong>"you"</strong> means the individual who registers an Account 
                  and uses the Services.</li>
                  <li><strong>"Website"</strong> means the Urban Bet website and any mobile applications or other online 
                  services that link to these Terms and Conditions.</li>
                  <li><strong>"Bet"</strong> means a wager placed by a User on a specific outcome of an event.</li>
                </ul>
              </section>
              
              <section id="account">
                <h2 className="text-xl font-bold mb-4">3. Account Rules</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>3.1. To use our services, you must register an account and provide accurate, complete, and current information.</li>
                  <li>3.2. You must be at least 18 years old (or the legal gambling age in your jurisdiction, whichever is higher) to register an account.</li>
                  <li>3.3. You may only register one account. Multiple accounts per person, household, IP address, or device are not permitted.</li>
                  <li>3.4. You are responsible for maintaining the confidentiality of your account details and password.</li>
                  <li>3.5. You must not share your account with any other person or allow any other person to access or use your account.</li>
                  <li>3.6. Urban Bet reserves the right to verify your identity at any time and request documentation for verification purposes.</li>
                  <li>3.7. Urban Bet may suspend or close your account if we suspect fraud, money laundering, or any violation of these Terms and Conditions.</li>
                </ul>
              </section>
              
              <section id="betting">
                <h2 className="text-xl font-bold mb-4">4. Betting Rules</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>4.1. All bets are subject to the specific rules of the sport or event on which the bet is placed.</li>
                  <li>4.2. Urban Bet reserves the right to refuse any bet at its sole discretion.</li>
                  <li>4.3. Once a bet is placed and confirmed, it cannot be cancelled or changed by the User.</li>
                  <li>4.4. Urban Bet may void bets in cases of obvious errors in odds, technical failures, or suspicion of match-fixing.</li>
                  <li>4.5. Winnings will be credited to your account after the official result of the event is confirmed.</li>
                  <li>4.6. Urban Bet's decision regarding the outcome of a bet is final.</li>
                  <li>4.7. Minimum and maximum stake limits apply and may vary by event and market.</li>
                </ul>
              </section>
              
              <section id="deposits">
                <h2 className="text-xl font-bold mb-4">5. Deposits and Withdrawals</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>5.1. The minimum deposit amount is RWF 1,000 or equivalent in your currency.</li>
                  <li>5.2. The minimum withdrawal amount is RWF 5,000 or equivalent in your currency.</li>
                  <li>5.3. Urban Bet reserves the right to request verification documents before processing withdrawals.</li>
                  <li>5.4. Withdrawals will be processed using the same payment method used for deposits where possible.</li>
                  <li>5.5. Urban Bet is not responsible for any fees charged by payment providers.</li>
                  <li>5.6. Urban Bet reserves the right to set maximum withdrawal limits.</li>
                  <li>5.7. Funds must be used for betting purposes and not as a means of transferring money.</li>
                  <li>5.8. Urban Bet may delay or refuse withdrawals if we suspect fraud or money laundering.</li>
                </ul>
              </section>
              
              <section id="responsible">
                <h2 className="text-xl font-bold mb-4">6. Responsible Gambling</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>6.1. Urban Bet is committed to promoting responsible gambling.</li>
                  <li>6.2. Users can set deposit limits, loss limits, and self-exclusion periods through their account settings.</li>
                  <li>6.3. Urban Bet reserves the right to close or suspend accounts of Users who show signs of gambling addiction.</li>
                  <li>6.4. Urban Bet provides information and resources for Users who may have gambling problems.</li>
                  <li>6.5. If you suspect you have a gambling problem, we encourage you to seek help from professional organizations.</li>
                </ul>
              </section>
              
              <section id="liability">
                <h2 className="text-xl font-bold mb-4">7. Limitation of Liability</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>7.1. Urban Bet provides its services "as is" and does not guarantee uninterrupted access to the website or services.</li>
                  <li>7.2. Urban Bet is not liable for any direct, indirect, incidental, special, or consequential damages arising from the use of its services.</li>
                  <li>7.3. Urban Bet is not responsible for any errors or omissions in the information provided on the website.</li>
                  <li>7.4. Urban Bet's maximum liability to any User shall not exceed the amount in that User's account.</li>
                </ul>
              </section>
              
              <section id="intellectual">
                <h2 className="text-xl font-bold mb-4">8. Intellectual Property</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>8.1. All content on the Urban Bet website, including logos, trademarks, text, graphics, and software, is the property of Urban Bet or its licensors.</li>
                  <li>8.2. Users may not copy, reproduce, distribute, or create derivative works from any content on the website without express written permission.</li>
                  <li>8.3. Users grant Urban Bet a worldwide, royalty-free license to use any content they submit to the website.</li>
                </ul>
              </section>
              
              <section id="termination">
                <h2 className="text-xl font-bold mb-4">9. Termination</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>9.1. Urban Bet reserves the right to terminate or suspend your account at any time for any reason, including violation of these Terms and Conditions.</li>
                  <li>9.2. Users may close their account at any time by contacting customer support.</li>
                  <li>9.3. Upon termination, any remaining balance in your account will be returned to you, subject to verification checks.</li>
                  <li>9.4. Termination of your account does not affect any rights or obligations that accrued prior to termination.</li>
                </ul>
              </section>
              
              <section id="misc">
                <h2 className="text-xl font-bold mb-4">10. Miscellaneous</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>10.1. These Terms and Conditions are governed by the laws of Rwanda.</li>
                  <li>10.2. Any disputes arising from these Terms and Conditions shall be subject to the exclusive jurisdiction of the courts of Rwanda.</li>
                  <li>10.3. If any provision of these Terms and Conditions is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.</li>
                  <li>10.4. Urban Bet's failure to enforce any right or provision of these Terms and Conditions shall not constitute a waiver of such right or provision.</li>
                  <li>10.5. These Terms and Conditions constitute the entire agreement between you and Urban Bet regarding the use of our services.</li>
                </ul>
              </section>
            </div>
          </ScrollArea>
          
          <div className="flex flex-col items-center space-y-4 border-t border-border pt-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I have read and agree to the Terms and Conditions
              </label>
            </div>
            <Button onClick={handleAcceptTerms} disabled={!acceptedTerms}>
              Accept Terms
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
