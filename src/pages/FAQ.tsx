import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  
  const faqs = {
    general: [
      {
        question: "What is Urban Bet?",
        answer: "Urban Bet is a premium online betting platform that offers sports betting, casino games, and AI-powered predictions. We provide a secure and enjoyable environment for users to place bets on various sports events and play casino games."
      },
      {
        question: "How do I create an account?",
        answer: "To create an account, click on the 'Sign Up' button at the top of the page. Fill in your personal details, create a password, and agree to our terms and conditions. Once registered, you can log in and start betting right away."
      },
      {
        question: "Is Urban Bet legal?",
        answer: "Yes, Urban Bet is a fully licensed betting platform that operates in compliance with all applicable laws and regulations in the jurisdictions where we offer our services. We hold valid gambling licenses and adhere to strict regulatory standards."
      },
      {
        question: "What age do I need to be to use Urban Bet?",
        answer: "You must be at least 18 years old to use Urban Bet's services. In some jurisdictions, the minimum age may be 21. We conduct age verification checks to ensure compliance with local laws."
      },
      {
        question: "How do I contact customer support?",
        answer: "You can contact our customer support team via live chat, email, or phone. Our support team is available 24/7 to assist you with any queries or concerns you may have."
      }
    ],
    account: [
      {
        question: "How do I reset my password?",
        answer: "To reset your password, click on the 'Forgot Password' link on the login page. Enter your registered email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password."
      },
      {
        question: "How do I verify my account?",
        answer: "Account verification requires submitting identification documents such as a government-issued ID, proof of address, and sometimes proof of payment method. Visit the 'Account Verification' section in your profile to upload these documents."
      },
      {
        question: "Can I have multiple accounts?",
        answer: "No, each user is allowed to have only one account on Urban Bet. Creating multiple accounts is against our terms of service and may result in account suspension or closure."
      },
      {
        question: "How do I update my personal information?",
        answer: "To update your personal information, go to your Account Settings. You can edit details such as your email address, phone number, and personal information. Some changes may require additional verification."
      },
      {
        question: "How can I close my account?",
        answer: "To close your account, please contact our customer support team. Alternatively, you can use the self-exclusion option in your account settings to temporarily or permanently restrict access to your account."
      }
    ],
    deposits: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept various payment methods including credit/debit cards, mobile money (MTN MoMo, Airtel Money), bank transfers, and selected e-wallets. The available methods may vary depending on your location."
      },
      {
        question: "What is the minimum deposit amount?",
        answer: "The minimum deposit amount is RWF 1,000 or equivalent in your currency. This may vary depending on the payment method you choose."
      },
      {
        question: "How long do deposits take?",
        answer: "Most deposits are processed instantly. However, bank transfers may take 1-3 business days to reflect in your account, depending on your bank's processing times."
      },
      {
        question: "Are there any fees for deposits?",
        answer: "Urban Bet does not charge any fees for deposits. However, your payment provider may apply transaction fees. Please check with your provider for more information."
      },
      {
        question: "Why was my deposit declined?",
        answer: "Deposits may be declined for various reasons including insufficient funds, card restrictions, or security measures. If your deposit is declined, please contact your payment provider first, then our customer support if the issue persists."
      }
    ],
    withdrawals: [
      {
        question: "How do I withdraw my winnings?",
        answer: "To withdraw your winnings, go to the Wallet section, select 'Withdraw', choose your preferred withdrawal method, enter the amount, and confirm the transaction. You may need to complete account verification before making your first withdrawal."
      },
      {
        question: "What is the minimum withdrawal amount?",
        answer: "The minimum withdrawal amount is RWF 5,000 or equivalent in your currency. This may vary depending on the withdrawal method you choose."
      },
      {
        question: "How long do withdrawals take to process?",
        answer: "Withdrawal processing times vary by method: Mobile money withdrawals typically take 1-24 hours, e-wallet withdrawals 24-48 hours, and bank transfers 3-5 business days. All withdrawals undergo a review process before approval."
      },
      {
        question: "Are there any fees for withdrawals?",
        answer: "Urban Bet does not charge withdrawal fees for standard processing times. However, expedited withdrawals or certain payment methods may incur fees. These will be clearly displayed before you confirm your withdrawal."
      },
      {
        question: "Why is my withdrawal pending?",
        answer: "Withdrawals may be pending due to account verification requirements, security checks, or processing times. If your withdrawal has been pending for longer than the expected timeframe, please contact customer support."
      }
    ],
    betting: [
      {
        question: "How do I place a bet?",
        answer: "To place a bet, browse the available events, click on the odds for your desired selection to add it to your bet slip, enter your stake amount, and confirm your bet. You can place single bets or combine multiple selections into accumulators."
      },
      {
        question: "What are the betting limits?",
        answer: "Betting limits vary depending on the sport, event, and market. The minimum bet amount is RWF 500, while maximum limits are displayed on your bet slip. These limits may be adjusted based on your betting history and account status."
      },
      {
        question: "Can I cancel a bet after placing it?",
        answer: "Generally, bets cannot be cancelled once confirmed. However, for certain events, we offer a 'Cash Out' feature that allows you to settle your bet before the event ends, either to secure a profit or minimize losses."
      },
      {
        question: "What happens if an event is postponed or cancelled?",
        answer: "If an event is postponed and rescheduled within 24 hours, your bet remains valid. For longer postponements or cancellations, bets on that specific event will be voided and stakes returned to your account."
      },
      {
        question: "What are AI predictions?",
        answer: "AI predictions are betting recommendations generated by our advanced machine learning algorithms. These predictions analyze vast amounts of data including team/player performance, historical data, and current form to suggest potential betting opportunities."
      }
    ]
  };
  
  const filteredFaqs = () => {
    if (!searchQuery.trim()) {
      return faqs[activeTab as keyof typeof faqs];
    }
    
    const query = searchQuery.toLowerCase();
    const allFaqs = Object.values(faqs).flat();
    
    return allFaqs.filter(faq => 
      faq.question.toLowerCase().includes(query) || 
      faq.answer.toLowerCase().includes(query)
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-bet-primary">Frequently Asked Questions</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about Urban Bet's services, account management, deposits, withdrawals, and betting.
            </p>
          </div>
          
          <div className="relative mb-8">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="pl-10"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2"
                onClick={() => setSearchQuery("")}
              >
                Clear
              </Button>
            )}
          </div>
          
          {!searchQuery && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="deposits">Deposits</TabsTrigger>
                <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
                <TabsTrigger value="betting">Betting</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs().map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
            
            {filteredFaqs().length === 0 && (
              <div className="text-center py-10">
                <p className="text-lg font-medium">No results found</p>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your search or browse the categories to find what you're looking for.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              </div>
            )}
          </Accordion>
          
          <div className="mt-12 text-center border-t border-border pt-8">
            <h3 className="text-xl font-semibold mb-4">Didn't find what you're looking for?</h3>
            <p className="text-muted-foreground mb-6">Our customer support team is available 24/7 to assist you</p>
            <Button asChild>
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
