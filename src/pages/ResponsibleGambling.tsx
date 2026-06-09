import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Clock, ShieldCheck, UserCheck, Wallet, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsibleGamblingQuiz } from "@/components/ResponsibleGamblingQuiz";

const ResponsibleGambling = () => {
  const [quizOpen, setQuizOpen] = useState(false);

  const supportContacts = [
    {
      name: "National Problem Gambling Helpline",
      phone: "+250 788 XXXXX",
      description: "24/7 confidential support for gambling addiction"
    },
    {
      name: "Urban Bet Support",
      phone: "+250 788 XXXXX",
      description: "Dedicated line for responsible gambling support"
    }
  ];

  const responsibleGamblingTips = [
    {
      icon: <Clock className="h-6 w-6 text-bet-primary" />,
      title: "Set Time Limits",
      description: "Use our built-in time management tools to control your gambling duration."
    },
    {
      icon: <Wallet className="h-6 w-6 text-bet-primary" />,
      title: "Deposit Limits",
      description: "Set daily, weekly, and monthly deposit limits to manage your spending."
    },
    {
      icon: <UserCheck className="h-6 w-6 text-bet-primary" />,
      title: "Self-Assessment",
      description: "Take our responsible gambling quiz to understand your gambling behavior."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-bet-primary" />,
      title: "Self-Exclusion",
      description: "Temporarily or permanently suspend your account if you feel you need a break."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-bet-primary">
              Responsible Gambling
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              At Urban Bet, we're committed to providing a safe and enjoyable betting experience. 
              Your well-being is our top priority.
            </p>
          </div>

          <section className="mb-12">
            <div className="grid md:grid-cols-2 gap-6">
              {responsibleGamblingTips.map((tip, index) => (
                <Card key={index} className="hover:shadow-lg transition-all">
                  <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    {tip.icon}
                    <CardTitle>{tip.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{tip.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mb-12 bg-bet-primary/10 rounded-lg p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold mb-2 text-bet-primary">
                  Are You Gambling Responsibly?
                </h2>
                <p className="text-muted-foreground">
                  Take our quick self-assessment to understand your gambling habits.
                </p>
              </div>
              <Button onClick={() => setQuizOpen(true)}>
                Take Assessment
              </Button>
            </div>
          </section>

          <section className="mb-12">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-bet-accent/10 flex items-center justify-center mb-4">
                    <AlertCircle className="h-6 w-6 text-bet-accent" />
                  </div>
                  <CardTitle>Signs of Problem Gambling</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Gambling more than you can afford to lose</li>
                    <li>Borrowing money to gamble</li>
                    <li>Neglecting work, family, or personal responsibilities</li>
                    <li>Feeling restless or irritable when not gambling</li>
                    <li>Chasing losses</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-bet-primary/10 flex items-center justify-center mb-4">
                    <HelpCircle className="h-6 w-6 text-bet-primary" />
                  </div>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  {supportContacts.map((contact, index) => (
                    <div key={index} className="mb-4 border-b pb-4 last:border-b-0">
                      <h3 className="font-semibold mb-1">{contact.name}</h3>
                      <p className="text-muted-foreground mb-2">{contact.description}</p>
                      <Button variant="outline" size="sm">
                        Call {contact.phone}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </section>

          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              Remember: Gambling Should Be Fun, Not a Way to Make Money
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              If gambling is no longer enjoyable or is causing stress, it's time to stop. 
              Urban Bet supports responsible gambling and provides tools to help you stay in control.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />

      <ResponsibleGamblingQuiz 
        open={quizOpen} 
        onOpenChange={setQuizOpen}
      />
    </div>
  );
};

export default ResponsibleGambling;
