import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
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
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { resetPassword } from "@/services/authService";
import { ApiError } from "@/lib/api";

export default function ResetPassword() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const token = searchParams.get("token") || "";
  const uid = searchParams.get("uid") || "";

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Redirect countdown
  useEffect(() => {
    if (success) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/login");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [success, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!token || !uid) {
      setError("Reset token or user identification is missing. Please request a new recovery link.");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsSubmitting(false);
      return;
    }

    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      await resetPassword({
        uid,
        token,
        password,
        password_confirm: passwordConfirm,
      });

      setSuccess(true);
      toast({
        title: "Password updated!",
        description: "Your password has been successfully reset. Redirecting to login...",
      });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to reset password. The link might be expired.";
      setError(message);
      
      toast({
        title: "Reset failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasParams = !!token && !!uid;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6 text-white">Reset Password</h1>
          
          <Card className="w-full card-highlight bg-card border-border/50 shadow-2xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl font-bold">Choose New Password</CardTitle>
              <CardDescription className="text-muted-foreground mt-1.5">
                {!hasParams 
                  ? "Invalid link parameters" 
                  : !success 
                    ? "Enter your new credentials below to update your account password."
                    : "Password reset complete."
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-4">
              {!hasParams ? (
                <div className="space-y-4 text-center py-4">
                  <div className="flex justify-center">
                    <AlertCircle className="h-12 w-12 text-destructive" />
                  </div>
                  <p className="text-sm font-semibold text-white">Invalid Reset Link</p>
                  <p className="text-xs text-muted-foreground">
                    This password reset link is invalid or incomplete. Please request a new password recovery link.
                  </p>
                  <Button className="w-full bg-bet-primary hover:bg-bet-primary/90 text-bet-primary-foreground font-bold" asChild>
                    <Link to="/forgot-password">Request New Link</Link>
                  </Button>
                </div>
              ) : !success ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    {/* New Password */}
                    <div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="New Password (min 8 chars)"
                          className="pl-10 pr-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isSubmitting}
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    
                    {/* Confirm Password */}
                    <div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm New Password"
                          className="pl-10 pr-10"
                          value={passwordConfirm}
                          onChange={(e) => setPasswordConfirm(e.target.value)}
                          required
                          disabled={isSubmitting}
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm text-left font-medium">
                      {error}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-bet-primary hover:bg-bet-primary/90 text-bet-primary-foreground font-bold"
                    disabled={isSubmitting || password.length < 8 || password !== passwordConfirm}
                  >
                    {isSubmitting ? "Resetting Password..." : "Update Password"}
                    {!isSubmitting && <ArrowRight size={16} className="ml-1.5" />}
                  </Button>
                </form>
              ) : (
                <div className="space-y-6 py-4 text-center">
                  <div className="flex justify-center">
                    <CheckCircle2 className="h-16 w-16 text-bet-primary animate-pulse" />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-white">Password Updated Successfully</p>
                    <p className="text-xs text-muted-foreground">
                      Your password has been successfully reset. Redirecting to login in <span className="font-bold text-white">{countdown}</span> seconds...
                    </p>
                  </div>
                  
                  <Button 
                    className="w-full bg-bet-primary hover:bg-bet-primary/90 text-bet-primary-foreground font-bold"
                    onClick={() => navigate("/login")}
                  >
                    Go to Login Immediately
                  </Button>
                </div>
              )}
            </CardContent>
            
            {!success && (
              <CardFooter className="flex justify-center border-t border-border pt-4">
                <Link 
                  to="/login" 
                  className="inline-flex items-center text-sm text-bet-primary hover:underline"
                >
                  Cancel and Return to Login
                </Link>
              </CardFooter>
            )}
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
