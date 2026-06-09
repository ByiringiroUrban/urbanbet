import { Brain, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBetting } from "@/contexts/BettingContext";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AIInsightCardProps {
  match: string;
  prediction: string;
  confidence: number;
  analysis: string;
  trend?: string;
  odds: string;
}

export default function AIInsightCard({ 
  match, 
  prediction, 
  confidence, 
  analysis, 
  trend,
  odds
}: AIInsightCardProps) {
  const betting = useBetting();
  const [isAdded, setIsAdded] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  // Determine confidence color text and bg
  const getConfidenceStyle = () => {
    if (confidence >= 75) return "bg-green-500/10 text-green-500 border-green-500/20";
    if (confidence >= 60) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-red-500/10 text-red-500 border-red-500/20";
  };
  
  // Handle adding to betting slip
  const handleAddToBettingSlip = () => {
    const numericOdds = parseFloat(odds.split(' ')[0]);
    
    if (!isNaN(numericOdds)) {
      betting.addBet({
        event: match,
        selection: prediction,
        odds: numericOdds
      });
      
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    }
  };

  return (
    <Card className="overflow-hidden hover:border-bet-primary/30 transition-all duration-300 bg-card border-border/60 p-4 flex flex-col gap-3">
      {/* Top Header: Match & Confidence Pill */}
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-sm font-bold text-white tracking-tight leading-tight">{match}</h3>
        <Badge className={cn("text-[9px] font-black shrink-0 px-2 py-0.5 rounded border shadow-none", getConfidenceStyle())}>
          {confidence}% CONF
        </Badge>
      </div>

      {/* Main Prediction and Betting Trigger Row */}
      <div className="flex items-center justify-between gap-4 bg-bet-dark/25 p-2.5 rounded-lg border border-border/40">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">AI TIP</span>
          <span className="text-xs font-black text-white">{prediction}</span>
        </div>
        
        {/* Odds Button */}
        <button
          onClick={handleAddToBettingSlip}
          className={cn(
            "h-8 px-4 rounded text-xs font-black tracking-wide transition-all active:scale-95 flex items-center justify-center gap-1 min-w-[70px]",
            isAdded
              ? "bg-green-500 text-white font-bold"
              : "bg-bet-primary text-bet-primary-foreground hover:bg-bet-primary/90"
          )}
        >
          {isAdded ? (
            <span>ADDED ✓</span>
          ) : (
            <>
              <span className="opacity-70 text-[9px] mr-0.5 font-bold">ODDS</span>
              <span>{parseFloat(odds).toFixed(2)}</span>
            </>
          )}
        </button>
      </div>

      {/* Toggle Analysis Link */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAnalysis(!showAnalysis)}
          className="text-[10px] font-bold text-muted-foreground hover:text-white flex items-center gap-0.5 transition-colors"
        >
          <span>{showAnalysis ? "Hide Details" : "Why this tip?"}</span>
          {showAnalysis ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {/* Expandable Analysis Body */}
      {showAnalysis && (
        <div className="text-[11px] text-muted-foreground/90 border-t border-border/30 pt-2.5 flex flex-col gap-2 animate-accordion-down">
          <div>
            <span className="font-bold text-white block mb-0.5">AI Analysis:</span>
            <p className="leading-relaxed">{analysis}</p>
          </div>
          
          {trend && (
            <div className="flex items-center gap-1 bg-bet-primary/5 p-2 rounded border border-bet-primary/10 text-bet-primary font-semibold">
              <TrendingUp size={12} className="shrink-0" />
              <span>{trend}</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
