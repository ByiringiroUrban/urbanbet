
import { useState, useEffect } from 'react';
import { Plane } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface AviatorGameProps {
  onClose: () => void;
}

export default function AviatorGame({ onClose }: AviatorGameProps) {
  const [multiplier, setMultiplier] = useState(1);
  const [isFlying, setIsFlying] = useState(false);
  const [hasCrashed, setHasCrashed] = useState(false);
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isFlying && !hasCrashed) {
      interval = setInterval(() => {
        setMultiplier(prev => {
          const newValue = prev + 0.01;
          // Random crash point between 1.1x and 10x
          if (Math.random() < 0.02 || newValue > 10) {
            setHasCrashed(true);
            setIsFlying(false);
            return prev;
          }
          return newValue;
        });
      }, 50);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isFlying, hasCrashed]);

  const handleStart = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login to play Aviator",
      });
      return;
    }
    
    setIsFlying(true);
    setHasCrashed(false);
    setMultiplier(1);
  };

  return (
    <div className="w-full h-full min-h-[400px] bg-bet-primary relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center z-10">
          {!isFlying && !hasCrashed && (
            <Button 
              onClick={handleStart}
              size="lg" 
              className="bg-bet-primary hover:bg-bet-primary/90"
            >
              Start Flight
            </Button>
          )}
          
          {isFlying && (
            <div className="space-y-4">
              <div className="text-6xl font-bold text-bet-primary animate-pulse">
                {multiplier.toFixed(2)}x
              </div>
              <Button 
                onClick={() => setIsFlying(false)}
                variant="outline"
                size="lg"
              >
                Cash Out
              </Button>
            </div>
          )}
          
          {hasCrashed && (
            <div className="space-y-4">
              <div className="text-4xl font-bold text-red-500">
                Crashed at {multiplier.toFixed(2)}x
              </div>
              <Button 
                onClick={handleStart}
                size="lg" 
                className="bg-bet-primary hover:bg-bet-primary/90"
              >
                Play Again
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Animated plane */}
      <div className={`absolute left-1/4 transition-all duration-300 ${
        isFlying ? 'animate-pulse' : hasCrashed ? 'animate-bounce' : ''
      }`} style={{
        bottom: isFlying ? '75%' : hasCrashed ? '10%' : '30%',
        transform: hasCrashed ? 'rotate(180deg)' : 'rotate(-15deg)'
      }}>
        <Plane size={48} className="text-bet-primary" />
      </div>
    </div>
  );
}
