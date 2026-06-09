import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { dbFallback, TransactionRecord } from "@/utils/dbFallback";
import { ArrowUpRight, ArrowDownRight, Search, CreditCard } from "lucide-react";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    setLoading(true);
    try {
      const data = dbFallback.getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const approveTransaction = (id: string) => {
    try {
      dbFallback.approveTransaction(id);
      toast({
        title: "Transaction Approved",
        description: `Transaction has been approved and user balance updated.`,
      });
      loadTransactions();
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to approve transaction.",
        variant: "destructive"
      });
    }
  };

  const rejectTransaction = (id: string) => {
    try {
      dbFallback.rejectTransaction(id);
      toast({
        title: "Transaction Rejected",
        description: `Transaction has been rejected.`,
        variant: "destructive",
      });
      loadTransactions();
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to reject transaction.",
        variant: "destructive"
      });
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    if (typeFilter !== "all" && tx.type !== typeFilter) {
      return false;
    }
    if (statusFilter !== "all" && tx.status !== statusFilter) {
      return false;
    }
    if (searchTerm) {
      return (
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.reference && tx.reference.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return true;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return "secondary";
      case 'failed':
        return "destructive";
      default:
        return "default";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      case 'bet_win':
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'bet_loss':
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  return (
    <div>
      <h2 className="text-xl font-black uppercase text-white tracking-tight mb-6">Transaction History</h2>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by ID or reference"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-[#0a0e1b] border-slate-800"
          />
        </div>
        
        {/* Type Filter */}
        <div className="w-full sm:w-auto">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-[#0a0e1b] border-slate-800">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="deposit">Deposits</SelectItem>
              <SelectItem value="withdrawal">Withdrawals</SelectItem>
              <SelectItem value="bet_win">Bet Wins</SelectItem>
              <SelectItem value="bet_loss">Bet Losses</SelectItem>
            </SelectContent>
          </Select>
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
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Transactions Table */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#070a13]">
        <Table>
          <TableHeader className="bg-[#0a0e1b]">
            <TableRow className="border-slate-800">
              <TableHead className="text-slate-400">Type</TableHead>
              <TableHead className="text-slate-400">User ID</TableHead>
              <TableHead className="text-slate-400">Amount</TableHead>
              <TableHead className="text-slate-400">Method</TableHead>
              <TableHead className="text-slate-400">Reference</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
              <TableHead className="text-slate-400">Date</TableHead>
              <TableHead className="text-right text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-slate-800">
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-bet-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredTransactions.length > 0 ? (
              filteredTransactions.map(transaction => (
                <TableRow key={transaction.id} className="border-slate-800 hover:bg-slate-900/30">
                  <TableCell>
                    <div className="flex items-center text-xs">
                      {getTypeIcon(transaction.type)}
                      <span className="ml-2 capitalize">
                        {transaction.type === 'bet_win' ? 'Bet Win' : 
                         transaction.type === 'bet_loss' ? 'Bet Loss' : 
                         transaction.type}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-300 font-mono">{transaction.userId.substring(0, 8)}...</TableCell>
                  <TableCell className="text-xs font-mono">
                    <span className={transaction.type === 'deposit' || transaction.type === 'bet_win' ? 'text-green-500 font-bold' : 
                      transaction.type === 'withdrawal' || transaction.type === 'bet_loss' ? 'text-red-500 font-bold' : ''}>
                      {transaction.type === 'deposit' || transaction.type === 'bet_win' ? '+' : '-'}
                      {transaction.amount.toLocaleString()} {transaction.currency}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs">{transaction.method || 'N/A'}</TableCell>
                  <TableCell className="text-xs font-mono text-slate-400">{transaction.reference || 'N/A'}</TableCell>
                  <TableCell className="text-xs">
                    <Badge variant={getStatusBadgeVariant(transaction.status)}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-400">{new Date(transaction.timestamp).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    {transaction.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => approveTransaction(transaction.id)}
                          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white h-7 py-0 text-[10px]"
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => rejectTransaction(transaction.id)}
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white h-7 py-0 text-[10px]"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-slate-800">
                <TableCell colSpan={8} className="text-center py-6 text-slate-400 text-xs">No transactions found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
