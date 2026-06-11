import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { isAuthenticated } from "@/utils/authUtils";
import Layout from "@/components/Layout";
import AIInsightCard from "@/components/AIInsightCard";
import { apiFetch } from "@/lib/api";

const AIPredictions = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [predictions, setPredictions] = useState<any[]>([]);
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication required",
        description: "Please login to access AI predictions.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    const fetchPredictions = async () => {
      setIsLoading(true);
      try {
        const data = await apiFetch('/predictions/');
        setPredictions(data || []);
      } catch (error) {
        console.error('Error fetching AI predictions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPredictions();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-32">
          <div className="w-8 h-8 border-4 border-bet-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }


  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-black uppercase text-white tracking-tight">AI Predictions</h1>
          <p className="text-muted-foreground text-xs mt-1">
            Our advanced AI analyzes thousands of data points to provide you with the most accurate predictions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {predictions.length > 0 ? (
            predictions.map((prediction, index) => (
              <AIInsightCard
                key={prediction.id || index}
                match={prediction.match}
                prediction={prediction.prediction}
                confidence={prediction.confidence}
                analysis={prediction.analysis}
                trend={prediction.trend}
                odds={prediction.odds}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16 border border-dashed border-border/60 rounded-xl bg-card/25">
              <p className="text-muted-foreground">No AI predictions available at the moment</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AIPredictions;
