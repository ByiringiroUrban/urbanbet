
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BetRecord } from "@/services/database/types";
import { useNavigate } from "react-router-dom";

interface ActiveBetsProps {
  betHistory: BetRecord[];
  loading: boolean;
}

const ActiveBets = ({ betHistory, loading }: ActiveBetsProps) => {
  const navigate = useNavigate();
  const activeBets = betHistory.filter(bet => bet.status === 'pending');
  
  const renderBetStatus = (status: 'pending' | 'won' | 'lost' | 'cancelled') => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case 'won':
        return <Badge className="bg-green-500 hover:bg-green-600">Won</Badge>;
      case 'lost':
        return <Badge className="bg-red-500 hover:bg-red-600">Lost</Badge>;
      case 'cancelled':
        return <Badge>Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Bets</CardTitle>
        <CardDescription>You have {activeBets.length} active bets</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <Skeleton key={i} className="w-full h-32 rounded-md" />
            ))}
          </div>
        ) : activeBets.length > 0 ? (
          <div className="space-y-4">
            {activeBets.map((bet) => (
              <Card key={bet.id} className="bg-background/50 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">Bet #{bet.id.substring(0, 8)}</div>
                    <div>{renderBetStatus(bet.status)}</div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {bet.items.map((item, index) => (
                      <div key={index} className="px-2 py-1 bg-muted/50 rounded">
                        <div>{item.event}</div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{item.selection}</span>
                          <span>{item.odds.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-border">
                    <div>
                      <div className="text-xs text-muted-foreground">Total Stake</div>
                      <div className="font-medium">{bet.currency === 'RWF' ? 'RWF' : '$'} {bet.amount.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Potential Win</div>
                      <div className="font-medium text-bet-secondary">
                        {bet.currency === 'RWF' ? 'RWF' : '$'} {bet.potentialWinnings.toLocaleString(undefined, {maximumFractionDigits: 2})}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-muted/50 p-4 rounded-md text-center">
            <p>You don't have any active bets</p>
            <Button variant="outline" className="mt-2" onClick={() => navigate('/sports')}>
              Place a Bet
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveBets;
