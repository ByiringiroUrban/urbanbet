import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, X, ChevronDown, ChevronUp, CircleDollarSign, Info } from "lucide-react";
import { useBetting } from "@/contexts/BettingContext";
import { cn } from "@/lib/utils";
import { isAuthenticated } from "@/utils/authUtils";
import { useToast } from "@/hooks/use-toast";

interface BettingSlipProps {
  isSidebar?: boolean;
}

export default function BettingSlip({ isSidebar = false }: BettingSlipProps) {
  const [isOpen, setIsOpen] = useState(isSidebar);
  const [betAmount, setBetAmount] = useState<string>("");
  const { 
    betItems, 
    removeBet, 
    clearBets, 
    placeBet, 
    currency,
    setCurrency,
    convertAmount 
  } = useBetting();
  const { toast } = useToast();

  const toggleOpen = () => setIsOpen(!isOpen);

  const calculateTotalOdds = (): string => {
    if (betItems.length === 0) return "0.00";
    return betItems.reduce((acc, bet) => acc * bet.odds, 1).toFixed(2);
  };

  const calculatePotentialWinnings = () => {
    const amount = parseFloat(betAmount) || 0;
    const totalOdds = parseFloat(calculateTotalOdds());
    return (amount * totalOdds).toFixed(2);
  };

  const handlePlaceBet = async () => {
    if (!isAuthenticated()) {
      toast({
        title: "Please log in to place a bet",
        description: "Create an account or log in to place bets.",
        variant: "destructive",
      });
      return;
    }
    
    if (parseFloat(betAmount) <= 0 || isNaN(parseFloat(betAmount))) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid bet amount",
        variant: "destructive",
      });
      return;
    }
    
    const minBet = currency === "RWF" ? 1000 : 1;
    if (parseFloat(betAmount) < minBet) {
      toast({
        title: "Minimum bet required",
        description: `Minimum bet amount is ${currency === "RWF" ? "RWF 1,000" : "$1"}`,
        variant: "destructive",
      });
      return;
    }
    
    await placeBet(parseFloat(betAmount));
    setBetAmount("");
  };

  const toggleCurrency = () => {
    setCurrency(currency === "USD" ? "RWF" : "USD");
    if (betAmount) {
      const amount = parseFloat(betAmount);
      if (!isNaN(amount)) {
        setBetAmount(convertAmount(amount, currency, currency === "USD" ? "RWF" : "USD").toFixed(0));
      }
    }
  };

  useEffect(() => {
    if (betItems.length > 0 && !isOpen) {
      setIsOpen(true);
    }
  }, [betItems.length]);

  if (isSidebar) {
    return (
      <div className="w-full bg-card/20 flex flex-col h-full select-none border-l border-border">
        {/* Header */}
        <div className="px-4 py-4 border-b border-border bg-bet-dark-accent/20 flex items-center justify-between">
          <h3 className="text-xs font-bold tracking-wider uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-bet-primary animate-pulse inline-block" />
            Betslip
            <Badge 
              variant="outline" 
              className="ml-1 bg-bet-primary/10 text-bet-primary border-bet-primary/20 rounded-full"
            >
              {betItems.length}
            </Badge>
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs font-normal"
            onClick={toggleCurrency}
          >
            {currency === "RWF" ? "RWF" : "USD"}
          </Button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 border-b border-border text-center text-xs font-semibold">
          <button className="py-2.5 border-b-2 border-bet-primary text-bet-primary bg-bet-primary/5">
            Single
          </button>
          <button className="py-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/5 transition-colors">
            Combo
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[220px]">
          {betItems.length > 0 ? (
            <div className="space-y-3">
              {betItems.map(bet => (
                <div 
                  key={bet.id} 
                  className="relative rounded-lg p-3 border border-border bg-card/40 group transition-all hover:border-bet-primary/30"
                >
                  <button 
                    className="absolute top-2 right-2 text-muted-foreground hover:text-bet-danger transition-colors"
                    onClick={() => removeBet(bet.id)}
                  >
                    <X size={14} className="opacity-70 group-hover:opacity-100" />
                  </button>
                  <div className="text-xs font-bold text-bet-primary mb-1">{bet.selection}</div>
                  <div className="text-sm font-semibold pr-4 leading-tight">{bet.event}</div>
                  <div className="mt-2.5 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Odds</span>
                    <span className="font-bold text-sm text-foreground">
                      {bet.odds.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground flex flex-col items-center gap-3">
              <CircleDollarSign className="text-bet-primary/25" size={44} />
              <div className="font-bold text-sm text-foreground">Betslip Empty</div>
              <p className="text-xs max-w-[200px] mx-auto text-muted-foreground/75 leading-relaxed">
                Select odds from any match to start placing bets.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {betItems.length > 0 && (
          <div className="p-4 border-t border-border bg-bet-dark-accent/10 flex flex-col gap-3">
            <div className="flex justify-between w-full text-xs font-semibold">
              <span className="text-muted-foreground">Total Odds:</span>
              <span className="text-foreground text-sm">
                {calculateTotalOdds()}
              </span>
            </div>
            
            <div className="w-full">
              <div className="flex justify-between mb-1.5 text-xs font-medium">
                <span className="text-muted-foreground">Bet Amount:</span>
                <span className="text-muted-foreground">{currency}</span>
              </div>
              <Input
                type="number"
                min="1"
                placeholder={`Enter amount...`}
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full h-9 bg-bet-dark/40 border-border/50 focus-visible:ring-bet-primary"
              />
              {currency === "RWF" && (
                <p className="text-[10px] text-muted-foreground/70 mt-1">Min: 1,000 RWF</p>
              )}
            </div>
            
            {betAmount && (
              <div className="flex justify-between w-full text-xs font-semibold">
                <span className="text-muted-foreground">Potential Win:</span>
                <span className="text-bet-primary">
                  {currency === "RWF" ? "RWF " : "$"}
                  {calculatePotentialWinnings()}
                </span>
              </div>
            )}
            
            <div className="flex w-full gap-2 mt-1">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 border-border text-muted-foreground hover:bg-muted/15"
                onClick={() => clearBets()}
              >
                Clear
              </Button>
              <Button 
                size="sm" 
                className="flex-1 bg-bet-primary text-bet-primary-foreground font-bold hover:bg-bet-primary/90"
                disabled={!betAmount || parseFloat(betAmount) <= 0 || betItems.length === 0 || !isAuthenticated()}
                onClick={handlePlaceBet}
              >
                Place Bet
              </Button>
            </div>
            
            {!isAuthenticated() && (
              <div className="text-[10px] text-muted-foreground/80 text-center bg-bet-primary/5 p-2 rounded border border-bet-primary/10">
                Log in to place your bets
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Fallback (floating modal mode) for mobile and tablet
  return (
    <div className="fixed bottom-0 right-0 z-40 w-full md:w-80 md:mr-4 md:mb-4 md:rounded-lg glass border border-bet-primary/30 shadow-lg transition-all duration-300 xl:hidden">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer md:hidden bg-bet-dark-accent rounded-t-lg"
        onClick={toggleOpen}
      >
        <div className="flex items-center space-x-2">
          <span className="font-medium">Betting Slip</span>
          <Badge 
            variant="outline" 
            className="bg-bet-primary/20 text-bet-primary border-bet-primary/30 hover:bg-bet-primary/30"
          >
            {betItems.length}
          </Badge>
        </div>
        {isOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
      </div>

      <div className={`${isOpen ? 'block' : 'hidden md:block'}`}>
        <CardHeader className="hidden md:block px-4 py-3 border-b border-border bg-bet-dark-accent rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center">
              Betting Slip
              <Badge 
                variant="outline" 
                className="ml-2 bg-bet-primary/20 text-bet-primary border-bet-primary/30 hover:bg-bet-primary/30"
              >
                {betItems.length}
              </Badge>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs font-normal"
              onClick={toggleCurrency}
            >
              {currency === "RWF" ? "RWF" : "USD"}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 max-h-[60vh] overflow-y-auto">
          {betItems.length > 0 ? (
            <div className="space-y-3">
              {betItems.map(bet => (
                <div 
                  key={bet.id} 
                  className="relative rounded-lg p-3 border border-border/50 group transition-all hover:border-bet-primary/30 bg-bet-primary to-bet-primary/5"
                >
                  <button 
                    className="absolute top-2 right-2 text-muted-foreground hover:text-bet-danger transition-colors"
                    onClick={() => removeBet(bet.id)}
                  >
                    <X size={16} className="opacity-70 group-hover:opacity-100" />
                  </button>
                  <div className="text-sm font-medium">{bet.event}</div>
                  <div className="text-sm text-muted-foreground">{bet.selection}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Odds</span>
                    <span className="text-sm font-semibold bg-bet-primary bg-clip-text text-transparent">
                      {bet.odds.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
              <CircleDollarSign className="text-bet-primary/40" size={32} />
              <p>Your betting slip is empty. Select some odds to start betting.</p>
            </div>
          )}
        </CardContent>
        
        {betItems.length > 0 && (
          <CardFooter className="flex flex-col p-4 border-t border-border space-y-3">
            <div className="flex justify-between w-full">
              <span className="text-sm">Total Odds:</span>
              <span className="font-semibold bg-bet-primary bg-clip-text text-transparent">
                {calculateTotalOdds()}
              </span>
            </div>
            
            <div className="w-full">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Bet Amount:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 px-2 text-xs font-normal -mr-2"
                  onClick={toggleCurrency}
                >
                  {currency}
                </Button>
              </div>
              <Input
                type="number"
                min="1"
                placeholder={`Enter amount in ${currency}`}
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full"
              />
              {currency === "RWF" && (
                <p className="text-xs text-muted-foreground mt-1">Min: 1,000 RWF</p>
              )}
            </div>
            
            {betAmount && (
              <div className="flex justify-between w-full">
                <span className="text-sm">Potential Winnings:</span>
                <span className="font-semibold text-bet-secondary">
                  {currency === "RWF" ? "RWF " : "$"}
                  {calculatePotentialWinnings()}
                </span>
              </div>
            )}
            
            <div className="flex w-full space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className={cn(
                  "flex-1 border-bet-danger/70 text-bet-danger hover:bg-bet-danger/10 transition-all",
                  betItems.length === 0 && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => clearBets()}
                disabled={betItems.length === 0}
              >
                <Trash2 size={16} className="mr-1" /> Clear
              </Button>
              <Button 
                size="sm" 
                className="flex-1 bg-bet-primary hover:bg-bet-primary/90 transition-all"
                disabled={!betAmount || parseFloat(betAmount) <= 0 || betItems.length === 0 || !isAuthenticated()}
                onClick={handlePlaceBet}
              >
                Place Bet
              </Button>
            </div>
            
            {!isAuthenticated() && (
              <div className="flex items-center mt-2 p-2 rounded-md bg-bet-primary/10 border border-bet-primary/20 text-xs">
                <Info size={14} className="text-bet-primary mr-2 shrink-0" />
                <span>Please log in to place bets</span>
              </div>
            )}
          </CardFooter>
        )}
      </div>
    </div>
  );
}
