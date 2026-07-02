import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Mail, ArrowLeft, CheckCircle2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { forgotPassword } from "@/services/authService";
import { ApiError } from "@/lib/api";

export default function ForgotPassword() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [devResetLink, setDevResetLink] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (emailStr: string): boolean => {
    return emailRegex.test(emailStr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);
    setDevResetLink("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await forgotPassword(email);
      setSuccess(true);
      
      toast({
        title: "Reset link sent!",
        description: "Please check your email for instructions to reset your password.",
      });

      // Retrieve developer testing link if returned from API (under settings.DEBUG)
      if (response && response.reset_link) {
        setDevResetLink(response.reset_link);
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "An unexpected error occurred. Please try again.";
      setError(message);
      
      toast({
        title: "Request failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6 text-white">Password Recovery</h1>
          
          <Card className="w-full card-highlight bg-card border-border/50 shadow-2xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl font-bold">Forgot Password?</CardTitle>
              <CardDescription className="text-muted-foreground mt-1.5">
                {!success 
                  ? "Enter your email address and we'll send you a recovery link to reset your password."
                  : "We've sent a password reset link to your email."
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-4">
              {!success ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="Email Address"
                        className={`pl-10 ${!validateEmail(email) && email ? 'border-red-500' : ''}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    {!validateEmail(email) && email && (
                      <p className="text-xs text-red-500 mt-1 text-left">Please enter a valid email address</p>
                    )}
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm text-left font-medium">
                      {error}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-bet-primary hover:bg-bet-primary/90 text-bet-primary-foreground font-bold"
                    disabled={isSubmitting || !validateEmail(email)}
                  >
                    {isSubmitting ? "Sending Link..." : "Send Reset Link"}
                    {!isSubmitting && <ArrowRight size={16} className="ml-1.5" />}
                  </Button>
                </form>
              ) : (
                <div className="space-y-6 py-4 text-center">
                  <div className="flex justify-center">
                    <CheckCircle2 className="h-16 w-16 text-bet-primary animate-pulse" />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-white">Check Your Inbox</p>
                    <p className="text-xs text-muted-foreground">
                      An email has been sent to <span className="font-bold text-white">{email}</span>. Click the link inside the email to choose a new password.
                    </p>
                  </div>

                  {devResetLink && (
                    <div className="p-4 rounded-lg bg-bet-primary/10 border border-bet-primary/30 text-left space-y-2 mt-4 animate-fade-in">
                      <p className="text-[10px] font-black text-bet-primary uppercase tracking-wider">Developer Sandbox Helper</p>
                      <p className="text-[11px] text-muted-foreground">
                        Since DEBUG mode is enabled, here is the generated link for immediate testing:
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-bet-primary/30 text-bet-primary hover:bg-bet-primary/20 hover:text-bet-primary"
                        asChild
                      >
                        <a href={devResetLink}>
                          Open Password Reset Form
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-center border-t border-border pt-4">
              <Link 
                to="/login" 
                className="inline-flex items-center text-sm text-bet-primary hover:underline"
              >
                <ArrowLeft size={14} className="mr-1.5" /> Back to Log In
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
