import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useBetting } from "@/contexts/BettingContext";
import { cn } from "@/lib/utils";
import { mongoService } from "@/services/mongoService";
import { useToast } from "@/hooks/use-toast";

interface UpcomingMatchCardProps {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  time: string;
  date: string;
  homeOdds: number;
  drawOdds?: number;
  awayOdds: number;
  isLive?: boolean;
  onExpandMarket?: (matchId: string | null) => void;
  isExpanded?: boolean;
}

export default function UpcomingMatchCard({
  id,
  homeTeam,
  awayTeam,
  league,
  time,
  date,
  homeOdds,
  drawOdds,
  awayOdds,
  isLive = false,
  onExpandMarket,
  isExpanded = false
}: UpcomingMatchCardProps) {
  const { addBet } = useBetting();
  const { toast } = useToast();
  const [showMoreMarkets, setShowMoreMarkets] = useState(isExpanded);
  const [isLoadingMarkets, setIsLoadingMarkets] = useState(false);
  const [markets, setMarkets] = useState<any[]>([]);
  const [selectedOdds, setSelectedOdds] = useState<string | null>(null);

  useEffect(() => {
    setShowMoreMarkets(isExpanded);
  }, [isExpanded]);

  const addToBettingSlip = (selection: string, odds: number) => {
    addBet({
      event: `${homeTeam} vs ${awayTeam}`,
      selection,
      odds
    });
    setSelectedOdds(selection);
    
    toast({
      title: "Added to Bet Slip",
      description: `${selection} - ${homeTeam} vs ${awayTeam}`,
    });
  };

  const handleShowMoreMarkets = async () => {
    if (showMoreMarkets) {
      setShowMoreMarkets(false);
      if (onExpandMarket) {
        onExpandMarket(null);
      }
      return;
    }
    
    if (onExpandMarket) {
      onExpandMarket(id);
    }
    
    setIsLoadingMarkets(true);
    try {
      const eventId = `${homeTeam.toLowerCase().replace(/\s/g, '')}-${awayTeam.toLowerCase().replace(/\s/g, '')}`;
      const marketsData = await mongoService.getMarkets(eventId);
      
      const marketsWithFixedOdds = marketsData.map(market => {
        return {
          ...market,
          options: market.options.map((option: string, index: number) => {
            const seed = (id.charCodeAt(0) + option.length + index) % 100;
            const fixedOdds = 1.5 + (seed / 100 * 3);
            return {
              label: option,
              odds: parseFloat(fixedOdds.toFixed(2))
            };
          })
        };
      });
      
      setMarkets(marketsWithFixedOdds);
      setShowMoreMarkets(true);
    } catch (error) {
      toast({
        title: "Error loading markets",
        description: "Could not load additional markets for this event",
        variant: "destructive"
      });
    } finally {
      setIsLoadingMarkets(false);
    }
  };

  // Map team names to color circles for premium dashboard aesthetics
  const getTeamColor = (teamName: string): string => {
    const name = teamName.toLowerCase();
    if (name.includes("city")) return "bg-sky-400";
    if (name.includes("liverpool")) return "bg-red-600";
    if (name.includes("real")) return "bg-slate-200 border border-slate-400/50";
    if (name.includes("barcelona")) return "bg-blue-800";
    if (name.includes("lakers")) return "bg-purple-600";
    if (name.includes("warriors")) return "bg-amber-400";
    if (name.includes("bayern")) return "bg-rose-600";
    if (name.includes("dortmund")) return "bg-yellow-400";
    if (name.includes("arsenal")) return "bg-red-500";
    if (name.includes("chelsea")) return "bg-blue-600";
    if (name.includes("united")) return "bg-red-700";
    return "bg-bet-primary";
  };

  return (
    <div className="bg-card/40 hover:bg-card/75 border border-border/60 rounded-xl transition-all duration-300 p-4 flex flex-col gap-3">
      {/* Card Header Row */}
      <div className="flex justify-between items-center text-xs font-bold text-muted-foreground/80 tracking-wide pb-2 border-b border-border/40">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-bet-primary" />
          <span>{league.toUpperCase()}</span>
          {isLive && (
            <Badge className="h-5 bg-red-600/15 text-red-500 border border-red-500/20 hover:bg-red-600/20 text-[9px] font-black animate-pulse px-1.5 rounded ml-2">
              LIVE
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Clock size={11} className="text-muted-foreground/50" />
          <span>{time}</span>
        </div>
      </div>

      {/* Card Body - Horizontal Grid */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Teams Stack */}
        <div className="flex flex-col gap-2 min-w-[140px]">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", getTeamColor(homeTeam))} />
            <span>{homeTeam}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", getTeamColor(awayTeam))} />
            <span>{awayTeam}</span>
          </div>
        </div>

        {/* Center: Odds Buttons */}
        <div className="flex items-center gap-2 flex-grow max-w-md">
          {/* Outcome 1 */}
          <button
            onClick={() => addToBettingSlip(`${homeTeam} to win`, homeOdds)}
            className={cn(
              "flex-1 flex items-center justify-between px-4 py-2.5 rounded-lg border text-xs font-bold transition-all duration-200 bg-bet-dark/40",
              selectedOdds === `${homeTeam} to win`
                ? "border-bet-primary text-bet-primary bg-bet-primary/10"
                : "border-border/60 hover:border-bet-primary hover:bg-bet-primary/5 text-muted-foreground hover:text-foreground"
            )}
          >
            <span>1</span>
            <span className="text-foreground font-black">{homeOdds.toFixed(2)}</span>
          </button>

          {/* Draw (if exists) */}
          {drawOdds && drawOdds > 0 ? (
            <button
              onClick={() => addToBettingSlip("Draw", drawOdds)}
              className={cn(
                "flex-1 flex items-center justify-between px-4 py-2.5 rounded-lg border text-xs font-bold transition-all duration-200 bg-bet-dark/40",
                selectedOdds === "Draw"
                  ? "border-bet-primary text-bet-primary bg-bet-primary/10"
                  : "border-border/60 hover:border-bet-primary hover:bg-bet-primary/5 text-muted-foreground hover:text-foreground"
              )}
            >
              <span>X</span>
              <span className="text-foreground font-black">{drawOdds.toFixed(2)}</span>
            </button>
          ) : null}

          {/* Outcome 2 */}
          <button
            onClick={() => addToBettingSlip(`${awayTeam} to win`, awayOdds)}
            className={cn(
              "flex-1 flex items-center justify-between px-4 py-2.5 rounded-lg border text-xs font-bold transition-all duration-200 bg-bet-dark/40",
              selectedOdds === `${awayTeam} to win`
                ? "border-bet-primary text-bet-primary bg-bet-primary/10"
                : "border-border/60 hover:border-bet-primary hover:bg-bet-primary/5 text-muted-foreground hover:text-foreground"
            )}
          >
            <span>2</span>
            <span className="text-foreground font-black">{awayOdds.toFixed(2)}</span>
          </button>
        </div>

        {/* Right: Expand markets toggle */}
        <div className="flex justify-end items-center shrink-0">
          <button
            onClick={handleShowMoreMarkets}
            disabled={isLoadingMarkets}
            className="text-[11px] font-bold text-bet-primary hover:underline flex items-center gap-1 transition-all"
          >
            <span>{showMoreMarkets ? "Hide Markets" : (isLoadingMarkets ? "Loading..." : "+12 Markets >")}</span>
          </button>
        </div>
      </div>

      {/* Expanded Additional Markets */}
      {showMoreMarkets && (
        <div className="mt-2 pt-3 border-t border-border/40 space-y-3">
          {markets.length > 0 ? (
            markets.map((market) => (
              <div key={market.id} className="space-y-1.5">
                <h4 className="text-xs font-bold text-muted-foreground/80">{market.name}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {market.options.map((option: {label: string, odds: number}, index: number) => {
                    const selectionKey = `${market.name}: ${option.label}`;
                    return (
                      <button
                        key={index}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded border text-xs transition-all duration-200 bg-bet-dark/30",
                          selectedOdds === selectionKey 
                            ? "border-bet-primary text-bet-primary bg-bet-primary/10" 
                            : "border-border/40 hover:border-bet-primary hover:bg-bet-primary/5"
                        )}
                        onClick={() => addToBettingSlip(selectionKey, option.odds)}
                      >
                        <span className="text-muted-foreground">{option.label}</span>
                        <span className="font-bold text-foreground">{option.odds.toFixed(2)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-2 text-xs text-muted-foreground">
              Loading additional markets...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
