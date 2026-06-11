
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import UserProfile from "@/components/dashboard/UserProfile";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import { getBetHistory } from "@/services/bettingService";
import { getAIPredictions } from "@/services/predictionsService";
import { useAuth } from "@/hooks/useAuth";
import { BetRecord } from "@/services/database/types";
import Layout from "@/components/Layout";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isLoggedIn, user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [betHistory, setBetHistory] = useState<BetRecord[]>([]);
  const [aiPredictions, setAiPredictions] = useState<any[]>([]);
  const [loadingBets, setLoadingBets] = useState(true);
  const [loadingPredictions, setLoadingPredictions] = useState(true);
  
  // Check if user is authenticated
  useEffect(() => {
    if (authLoading) {
      return; // Wait for auth to complete
    }
    
    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please login to access your dashboard.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    setIsLoading(false);
    toast({
      title: "Welcome back!",
      description: "You've successfully logged into your dashboard.",
    });
    
    // Fetch bet history from backend API
    const fetchBetHistory = async () => {
      if (user?.token) {
        setLoadingBets(true);
        try {
          const history = await getBetHistory(user.token);
          setBetHistory(history);
        } catch (error) {
          console.error("Error fetching bet history:", error);
        } finally {
          setLoadingBets(false);
        }
      }
    };
    
    // Fetch AI predictions from backend API
    const fetchAIPredictions = async () => {
      setLoadingPredictions(true);
      try {
        if (user?.token) {
          const predictions = await getAIPredictions(user.token);
          setAiPredictions(predictions);
        }
      } finally {
        setLoadingPredictions(false);
      }
    };
    
    fetchBetHistory();
    fetchAIPredictions();
  }, [navigate, toast, isLoggedIn, user?.token, authLoading]);

  // Get user data
  const userData = {
    name: user?.name || "User",
    email: user?.email || "user@example.com",
    provider: user?.provider ? `${user.provider.charAt(0).toUpperCase() + user.provider.slice(1)}` : "Email",
    balance: user?.balance ? (user.currency === 'USD' ? `$${(user.balance / 1200).toFixed(2)}` : `RWF ${user.balance.toLocaleString()}`) : "$0.00",
  };

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bet-dark">
        <div className="animate-pulse text-center">
          <h2 className="text-2xl font-bold mb-2">Loading Dashboard...</h2>
          <p className="text-muted-foreground">Retrieving your betting information</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="w-full md:w-1/4">
          <UserProfile userData={userData} />
        </div>
        
        <div className="w-full md:w-3/4">
          <DashboardTabs 
            betHistory={betHistory}
            loadingBets={loadingBets}
            aiPredictions={aiPredictions}
            loadingPredictions={loadingPredictions}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
