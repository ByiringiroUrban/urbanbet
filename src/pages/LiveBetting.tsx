import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, BarChart2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import UpcomingMatchCard from "@/components/UpcomingMatchCard";
import { dbFallback } from "@/utils/dbFallback";

export default function LiveBetting() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSport, setActiveSport] = useState("all");
  const [activeMatches, setActiveMatches] = useState<any[]>([]);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  
  const handleExpandMarket = (matchId: string | null) => {
    setExpandedMatchId(matchId);
  };
  
  useEffect(() => {
    const liveEvents = dbFallback.getEvents().filter(event => event.isLive === true);
    let filtered = liveEvents;
    
    if (searchQuery) {
      filtered = filtered.filter(match => 
        match.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) || 
        match.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.league.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (activeSport !== "all") {
      filtered = filtered.filter(match => match.sportId === activeSport);
    }
    
    setActiveMatches(filtered);
  }, [searchQuery, activeSport]);

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        {/* Header Title */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black uppercase text-white tracking-tight flex items-center gap-2">
              Live Betting
              <Badge className="bg-red-600 text-white animate-pulse font-black text-[10px] px-2 h-5 rounded">LIVE</Badge>
            </h1>
            <p className="text-muted-foreground text-xs mt-1">
              Experience the thrill of in-play betting with real-time odds.
            </p>
          </div>
        </div>
        
        {/* Search & Filter Header block */}
        <div className="bg-card/40 border border-border/60 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4 items-center">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 h-4 w-4" />
            <Input 
              type="text" 
              placeholder="Search live matches..." 
              className="pl-9 h-9 bg-bet-dark/60 border-border/50 text-sm focus-visible:ring-bet-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs 
            defaultValue="all" 
            value={activeSport}
            onValueChange={setActiveSport}
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-3 w-full md:w-auto bg-bet-dark/60 h-9 p-0.5 border border-border/50">
              <TabsTrigger value="all" className="text-xs font-bold py-1.5 px-3">All Sports</TabsTrigger>
              <TabsTrigger value="football" className="text-xs font-bold py-1.5 px-3">Football</TabsTrigger>
              <TabsTrigger value="basketball" className="text-xs font-bold py-1.5 px-3">Basketball</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Live Statistics Overview Bar */}
        <div className="bg-card/25 border border-border/50 rounded-xl p-3 flex justify-around text-xs font-bold text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="text-bet-primary" size={14} />
            <span>{activeMatches.length} Live Events</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart2 className="text-bet-primary" size={14} />
            <span>Real-time Odds Updates</span>
          </div>
        </div>
        
        {/* Matches stack */}
        <div className="flex flex-col gap-4">
          {activeMatches.length > 0 ? (
            activeMatches.map((match) => (
              <UpcomingMatchCard
                key={match.id}
                id={match.id}
                homeTeam={match.homeTeam}
                awayTeam={match.awayTeam}
                league={match.league}
                time={match.time || "Live"}
                date={match.date || "Live"}
                homeOdds={match.homeOdds}
                drawOdds={match.drawOdds}
                awayOdds={match.awayOdds}
                isLive={match.isLive}
                isExpanded={expandedMatchId === match.id}
                onExpandMarket={handleExpandMarket}
              />
            ))
          ) : (
            <div className="text-center py-16 border border-dashed border-border/60 rounded-xl bg-card/25">
              <p className="text-sm text-muted-foreground">No live events matching your criteria at the moment</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
