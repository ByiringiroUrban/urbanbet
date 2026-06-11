import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import AIInsightsSection from "@/components/sections/AIInsightsSection";
import SportsBettingSection from "@/components/sections/SportsBettingSection";
import CasinoGamesSection from "@/components/sections/CasinoGamesSection";
import CallToActionSection from "@/components/sections/CallToActionSection";
import { useAuth } from "@/hooks/useAuth";
import { Match, CasinoGame, AIInsight } from "@/types";
import { apiFetch } from "@/lib/api";

const Index = () => {
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [casinoGames, setCasinoGames] = useState<CasinoGame[]>([]);

  useEffect(() => {
    const fetchHomepageData = async () => {
      setIsLoading(true);

      // Fetch all three data sources in parallel
      const [predictionsRes, eventsRes, gamesRes] = await Promise.allSettled([
        apiFetch('/predictions/'),
        apiFetch('/sports/events/'),
        apiFetch('/casino/games/'),
      ]);

      // Map AI Predictions
      if (predictionsRes.status === 'fulfilled') {
        const mapped: AIInsight[] = (predictionsRes.value || [])
          .filter((p: any) => p.is_featured)
          .slice(0, 3)
          .map((p: any) => ({
            match: p.match,
            prediction: p.prediction,
            confidence: p.confidence,
            analysis: p.analysis,
            trend: p.trend || undefined,
            odds: String(p.odds),
          }));
        setAiInsights(mapped);
      }

      // Map Sports Events
      if (eventsRes.status === 'fulfilled') {
        const mapped: Match[] = (eventsRes.value || [])
          .slice(0, 4)
          .map((e: any) => ({
            id: String(e.id),
            homeTeam: e.home_team,
            awayTeam: e.away_team,
            league: e.league_name || e.league || '',
            country: e.country_name || e.country || '',
            time: e.start_time
              ? new Date(e.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '--:--',
            date: e.start_time
              ? new Date(e.start_time).toLocaleDateString([], { month: 'short', day: 'numeric' })
              : '',
            homeOdds: parseFloat(e.home_odds) || 0,
            drawOdds: e.draw_odds ? parseFloat(e.draw_odds) : undefined,
            awayOdds: parseFloat(e.away_odds) || 0,
            isLive: e.status === 'live' || e.is_live === true,
          }));
        setUpcomingMatches(mapped);
      }

      // Map Casino Games
      if (gamesRes.status === 'fulfilled') {
        const mapped: CasinoGame[] = (gamesRes.value || [])
          .filter((g: any) => g.is_popular)
          .slice(0, 4)
          .map((g: any) => ({
            title: g.title,
            imageSrc: g.image_url || `https://picsum.photos/seed/${encodeURIComponent(g.title)}/400/300`,
            provider: g.provider,
            isNew: g.is_new || false,
            isPopular: g.is_popular || false,
            category: g.category || 'other',
          }));
        setCasinoGames(mapped);
      }

      setIsLoading(false);
    };

    fetchHomepageData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bet-dark">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-bet-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-2xl font-bold">Loading Urban Bet...</h2>
          <p className="text-muted-foreground">Fetching live data from the server</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Hero />
      <AIInsightsSection aiInsights={aiInsights} />
      <SportsBettingSection upcomingMatches={upcomingMatches} />
      <CasinoGamesSection casinoGames={casinoGames} />
      {!isLoggedIn && <CallToActionSection />}
    </Layout>
  );
};

export default Index;
