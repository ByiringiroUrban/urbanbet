import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import { Ticket, Search, ChevronDown, ChevronUp, Check, X, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminBets() {
  const [bets, setBets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedBet, setExpandedBet] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadBets();
  }, []);

  const loadBets = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/bets/admin/all/');
      const formattedBets = (data || []).map((bet: any) => ({
        id: String(bet.id),
        userId: String(bet.user),
        userEmail: bet.user_email,
        items: bet.items,
        totalOdds: Number(bet.total_odds),
        amount: Number(bet.amount),
        potentialWinnings: Number(bet.potential_winnings),
        timestamp: bet.created_at,
        status: bet.status,
        currency: bet.currency
      }));
      
      setBets(formattedBets);
    } catch (error) {
      console.error('Error loading bets:', error);
      toast({
        title: "Error",
        description: "Failed to load bets.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (betId: string, status: 'won' | 'lost' | 'cancelled') => {
    try {
      setUpdatingId(betId);
      await apiFetch(`/bets/admin/${betId}/status/`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      
      toast({
        title: "Success",
        description: `Bet status updated to ${status} successfully.`,
      });
      loadBets();
    } catch (error) {
      console.error('Error settling bet:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update bet status.",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpandBet = (betId: string) => {
    if (expandedBet === betId) {
      setExpandedBet(null);
    } else {
      setExpandedBet(betId);
    }
  };

  const filteredBets = bets.filter(bet => {
    if (statusFilter !== "all" && bet.status !== statusFilter) {
      return false;
    }
    
    return (
      bet.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bet.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bet.userEmail && bet.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      bet.items.some((item: any) => 
        item.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.selection.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'won':
        return "secondary";
      case 'lost':
        return "destructive";
      case 'cancelled':
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div>
      <h2 className="text-xl font-black uppercase text-white tracking-tight mb-6">Manage Bets</h2>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search bets by ID, User, or Event"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-[#0a0e1b] border-slate-800"
          />
        </div>
        
        {/* Status Filter */}
        <div className="w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-[#0a0e1b] border-slate-800">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="won">Won</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Bets Table */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#070a13]">
        <Table>
          <TableHeader className="bg-[#0a0e1b]">
            <TableRow className="border-slate-800">
              <TableHead className="text-slate-400">Bet ID</TableHead>
              <TableHead className="text-slate-400">User / Email</TableHead>
              <TableHead className="text-slate-400">Amount</TableHead>
              <TableHead className="text-slate-400">Total Odds</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
              <TableHead className="text-slate-400">Date</TableHead>
              <TableHead className="text-right text-slate-400">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-slate-800">
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-bet-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredBets.length > 0 ? (
              filteredBets.map(bet => (
                <React.Fragment key={bet.id}>
                  <TableRow className="cursor-pointer hover:bg-slate-900/30 border-slate-800" onClick={() => toggleExpandBet(bet.id)}>
                    <TableCell>
                      <div className="flex items-center">
                        <Ticket className="h-4 w-4 mr-2 text-slate-400" />
                        <span className="font-mono text-xs">{bet.id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="text-white font-semibold">ID: {bet.userId}</div>
                      <div className="text-slate-400">{bet.userEmail || 'No Email'}</div>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-white">
                      {Number(bet.amount).toLocaleString()} {bet.currency}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-bet-primary font-bold">{bet.totalOdds.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(bet.status)}>
                        {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-400">{new Date(bet.timestamp).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      {expandedBet === bet.id ? <ChevronUp size={16} className="inline text-slate-400" /> : <ChevronDown size={16} className="inline text-slate-400" />}
                    </TableCell>
                  </TableRow>
                  
                  {/* Expanded Bet Details */}
                  {expandedBet === bet.id && (
                    <TableRow className="border-slate-800 bg-[#0a0e1b]/40">
                      <TableCell colSpan={7} className="p-4">
                        <div className="space-y-4">
                          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Bet Selection Items</h4>
                          <div className="rounded-md border border-slate-800 overflow-hidden">
                            <Table>
                              <TableHeader className="bg-[#0a0e1b]">
                                <TableRow className="border-slate-800">
                                  <TableHead className="text-slate-400 h-8 text-[11px] uppercase">Event</TableHead>
                                  <TableHead className="text-slate-400 h-8 text-[11px] uppercase">Selection</TableHead>
                                  <TableHead className="text-slate-400 h-8 text-[11px] uppercase">Odds</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {bet.items.map((item: any, idx: number) => (
                                  <TableRow key={idx} className="border-slate-800 hover:bg-transparent">
                                    <TableCell className="text-xs text-white py-2">{item.event}</TableCell>
                                    <TableCell className="text-xs text-bet-primary font-bold py-2">{item.selection}</TableCell>
                                    <TableCell className="text-xs text-white font-mono py-2">{Number(item.odds).toFixed(2)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          
                          <div className="flex flex-wrap justify-between items-center bg-[#070a13] p-4 rounded-xl border border-slate-800 gap-4">
                            <div className="flex gap-8 text-xs">
                              <div>
                                <p className="text-slate-400 font-semibold mb-0.5">Stake Amount</p>
                                <p className="font-bold text-white font-mono">{Number(bet.amount).toLocaleString()} {bet.currency}</p>
                              </div>
                              <div>
                                <p className="text-slate-400 font-semibold mb-0.5">Potential Winnings</p>
                                <p className="font-bold text-bet-secondary font-mono">{Number(bet.potentialWinnings).toLocaleString()} {bet.currency}</p>
                              </div>
                              <div>
                                <p className="text-slate-400 font-semibold mb-0.5">Bet Placed At</p>
                                <p className="font-medium text-white">{new Date(bet.timestamp).toLocaleString()}</p>
                              </div>
                            </div>
                            
                            {/* Settlement Actions */}
                            {bet.status === 'pending' && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mr-2">Settle Bet:</span>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleUpdateStatus(bet.id, 'won')}
                                  disabled={updatingId !== null}
                                  className="h-8 bg-bet-secondary text-black font-black hover:bg-bet-secondary/80 text-xs"
                                >
                                  <Check className="h-3.5 w-3.5 mr-1" /> Mark Won
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleUpdateStatus(bet.id, 'lost')}
                                  disabled={updatingId !== null}
                                  className="h-8 bg-red-600 text-white font-black hover:bg-red-700 text-xs"
                                >
                                  <X className="h-3.5 w-3.5 mr-1" /> Mark Lost
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleUpdateStatus(bet.id, 'cancelled')}
                                  disabled={updatingId !== null}
                                  className="h-8 border-slate-700 text-slate-300 font-bold hover:bg-slate-800 text-xs"
                                >
                                  <Ban className="h-3.5 w-3.5 mr-1" /> Cancel
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow className="border-slate-800">
                <TableCell colSpan={7} className="text-center py-6 text-slate-400 text-xs">No bets found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
