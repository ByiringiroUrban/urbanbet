
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BetRecord } from "@/services/database/types";
import { useNavigate } from "react-router-dom";

interface BetHistoryProps {
  betHistory: BetRecord[];
  loading: boolean;
}

const BetHistory = ({ betHistory, loading }: BetHistoryProps) => {
  const navigate = useNavigate();
  
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
        <CardTitle>Betting History</CardTitle>
        <CardDescription>
          Win rate: {betHistory.length ? Math.round((betHistory.filter(bet => bet.status === 'won').length / betHistory.length) * 100) : 0}%
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="w-full h-24 rounded-md" />
            ))}
          </div>
        ) : betHistory.length > 0 ? (
          <div className="space-y-4">
            {betHistory.map((bet) => (
              <Card key={bet.id} className="bg-background/50 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">Bet #{bet.id.substring(0, 8)}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(bet.timestamp).toLocaleDateString()} at {new Date(bet.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <div>{renderBetStatus(bet.status)}</div>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Stake</div>
                      <div>{bet.currency === 'RWF' ? 'RWF' : '$'} {bet.amount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Total Odds</div>
                      <div>{bet.totalOdds.toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">
                        {bet.status === 'won' ? 'Won' : 'Potential Win'}
                      </div>
                      <div className={bet.status === 'won' ? 'font-medium text-bet-secondary' : ''}>
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
            <p>No betting history available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BetHistory;
