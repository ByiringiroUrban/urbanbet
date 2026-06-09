
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/utils/authUtils";

export default function CallToActionSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(isAuthenticated());
    };
    
    checkAuth();
    
    // Listen for auth changes
    window.addEventListener('authChange', checkAuth);
    window.addEventListener('storage', checkAuth); // For cross-tab sync
    
    return () => {
      window.removeEventListener('authChange', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  if (isLoggedIn) return null;

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      <div 
        className="absolute inset-0" 
        style={{
          backgroundColor: "rgba(17, 24, 39, 0.8)",
          backgroundImage: "url('https://images.unsplash.com/photo-1562016600-ece13e8ba570?q=80&w=1600&auto=format&fit=crop')",
          backgroundBlendMode: "overlay",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1
        }}
      />
      
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-bet-primary">Ready to Experience Smarter Betting?</h2>
        <p className="text-lg text-white/80 mb-8">Join Urban Bet today and get access to AI-powered predictions, competitive odds, and a secure betting platform.</p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="bg-bet-primary hover:bg-bet-primary/90" asChild>
            <Link to="/register">
              Create Account <ArrowRight size={16} className="ml-1" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10" asChild>
            <Link to="/login">
              Login
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
