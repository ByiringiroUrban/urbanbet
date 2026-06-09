import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import AIInsightsSection from "@/components/sections/AIInsightsSection";
import SportsBettingSection from "@/components/sections/SportsBettingSection";
import CasinoGamesSection from "@/components/sections/CasinoGamesSection";
import CallToActionSection from "@/components/sections/CallToActionSection";
import { aiInsights, upcomingMatches, casinoGames } from "@/data/homePageData";
import { useAuth } from "@/hooks/useAuth";
import { Match } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { initializeDatabase } from "@/services/supabaseService";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const [dbInitialized, setDbInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check Supabase connection and initialize database when the app starts
    const initDB = async () => {
      try {
        console.log("Initializing application data...");
        setIsLoading(true);
        
        // Test Supabase connection
        const { data, error } = await supabase.from('sports').select('count');
        
        if (error) {
          console.log('Using mock data due to Supabase connection error:', error.message);
          // Continue with mock data initialization
        } else {
          console.log('Successfully connected to Supabase:', data);
        }
        
        const success = await initializeDatabase();
        
        if (success) {
          setDbInitialized(true);
          console.log("Successfully initialized with data");
          
          toast({
            title: "Urban Bet Ready",
            description: "Welcome to Urban Bet!",
          });
        } else {
          toast({
            title: "Data Initialization",
            description: "Using mock data for demonstration",
          });
        }
      } catch (error) {
        console.error("Error initializing data:", error);
        toast({
          title: "Using Demo Mode",
          description: "Urban Bet is running with demonstration data",
        });
      } finally {
        // Always end loading state, even if there's an error
        setIsLoading(false);
      }
    };
    
    initDB();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bet-dark">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Urban Bet...</h2>
          <p className="text-muted-foreground">Setting up your betting experience</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Hero />
      <AIInsightsSection aiInsights={aiInsights} />
      <SportsBettingSection upcomingMatches={upcomingMatches as Match[]} />
      <CasinoGamesSection casinoGames={casinoGames} />
      {!isLoggedIn && <CallToActionSection />}
    </Layout>
  );
};

export default Index;
