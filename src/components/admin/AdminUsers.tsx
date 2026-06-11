import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiFetch, toArray } from "@/lib/api";
import { UserPlus, Shield, Search, ArrowUp, ArrowDown } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/auth/admin/users/');
      setUsers(toArray(data));
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMakeAdmin = async (userId: string) => {
    try {
      setUpdatingUser(userId);
      await apiFetch(`/auth/admin/users/${userId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ role: 'admin' })
      });
      
      toast({
        title: "Success",
        description: "User role has been updated to admin.",
      });
      
      loadUsers();
    } catch (error) {
      console.error('Error making user an admin:', error);
      toast({
        title: "Error",
        description: "Failed to make user an admin.",
        variant: "destructive",
      });
    } finally {
      setUpdatingUser(null);
    }
  };

  const handleAdjustBalance = async (userId: string, isDeposit: boolean) => {
    const amountStr = adjustAmount[userId];
    if (!amountStr || isNaN(Number(amountStr)) || Number(amountStr) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to adjust.",
        variant: "destructive",
      });
      return;
    }

    const value = isDeposit ? Number(amountStr) : -Number(amountStr);

    try {
      setUpdatingUser(userId);
      await apiFetch(`/auth/admin/users/${userId}/balance/`, {
        method: 'POST',
        body: JSON.stringify({ amount: value })
      });

      toast({
        title: "Success",
        description: `Successfully adjusted balance by ${isDeposit ? '+' : ''}${value.toLocaleString()} RWF.`,
      });

      setAdjustAmount({
        ...adjustAmount,
        [userId]: ""
      });

      loadUsers();
    } catch (error) {
      console.error('Error adjusting balance:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to adjust balance.",
        variant: "destructive",
      });
    } finally {
      setUpdatingUser(null);
    }
  };

  const filteredUsers = users.filter(user => 
    (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <h2 className="text-xl font-black uppercase text-white tracking-tight mb-6">Manage Users</h2>
      
      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 bg-[#0a0e1b] border-slate-800"
        />
      </div>
      
      {/* Users Table */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#070a13]">
        <Table>
          <TableHeader className="bg-[#0a0e1b]">
            <TableRow className="border-slate-800">
              <TableHead className="text-slate-400">User</TableHead>
              <TableHead className="text-slate-400">Email</TableHead>
              <TableHead className="text-slate-400">Balance</TableHead>
              <TableHead className="text-slate-400">Role</TableHead>
              <TableHead className="text-slate-400">Adjust Balance (RWF)</TableHead>
              <TableHead className="text-right text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-slate-800">
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-bet-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map(user => {
                const isUserAdmin = user.role === 'admin';
                return (
                  <TableRow key={user.id} className="border-slate-800 hover:bg-slate-900/30">
                    <TableCell className="font-bold text-white text-xs">{user.name || 'Anonymous'}</TableCell>
                    <TableCell className="text-xs text-slate-300">{user.email || 'No email'}</TableCell>
                    <TableCell className="text-xs font-mono text-bet-primary font-bold">
                      {user.balance !== null ? `${Number(user.balance).toLocaleString()} ${user.currency || 'RWF'}` : 'N/A'}
                    </TableCell>
                    <TableCell className="text-xs">
                      {isUserAdmin ? (
                        <div className="flex items-center text-bet-primary font-bold">
                          <Shield className="h-4 w-4 mr-1 text-bet-primary" />
                          <span>Admin</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">User</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="flex items-center gap-2">
                        <Input 
                          placeholder="Amount" 
                          type="number"
                          value={adjustAmount[user.id] || ""}
                          onChange={(e) => setAdjustAmount({ ...adjustAmount, [user.id]: e.target.value })}
                          className="h-8 w-24 bg-[#0a0e1b] border-slate-800 text-xs text-white"
                        />
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAdjustBalance(user.id, true)}
                          disabled={updatingUser === String(user.id)}
                          className="h-8 px-2 border-slate-800 hover:bg-bet-primary/10 hover:text-bet-primary"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAdjustBalance(user.id, false)}
                          disabled={updatingUser === String(user.id)}
                          className="h-8 px-2 border-slate-800 hover:bg-red-500/10 hover:text-red-400"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {!isUserAdmin && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleMakeAdmin(user.id)}
                          disabled={updatingUser !== null}
                          className="border-slate-800 hover:bg-slate-850 hover:text-white"
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Make Admin
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow className="border-slate-800">
                <TableCell colSpan={6} className="text-center py-6 text-slate-400 text-xs">No users found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
