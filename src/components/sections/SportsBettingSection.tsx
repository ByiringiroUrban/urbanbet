
import { Match } from "@/types";
import UpcomingMatchCard from "@/components/UpcomingMatchCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SportsBettingSectionProps {
  upcomingMatches: Match[];
}

export default function SportsBettingSection({ upcomingMatches }: SportsBettingSectionProps) {
  const navigate = useNavigate();
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  
  // This function handles expanding only one match at a time
  const handleExpandMarket = (matchId: string | null) => {
    setExpandedMatchId(matchId);
  };

  return (
    <section className="py-12 px-4 bg-bet-dark/20 border-t border-border/40">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Sports Betting</h2>
            <p className="text-muted-foreground mt-2">Upcoming matches with AI-enhanced odds</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/sports")}>
            View All Sports <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-col gap-4">
          {upcomingMatches.map((match) => (
            <UpcomingMatchCard
              key={match.id}
              id={match.id}
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
              league={match.league}
              time={match.time}
              date={match.date}
              homeOdds={match.homeOdds}
              drawOdds={match.drawOdds}
              awayOdds={match.awayOdds}
              isLive={match.isLive}
              isExpanded={expandedMatchId === match.id}
              onExpandMarket={handleExpandMarket}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
