
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { dbFallback, UserProfile } from "@/utils/dbFallback";
import { UserPlus, Shield, Search } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setLoading(true);
    try {
      const userList = dbFallback.getUsers();
      setUsers(userList);
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

  const handleMakeAdmin = (userId: string) => {
    try {
      setAddingAdmin(true);
      dbFallback.makeUserAdmin(userId);
      
      toast({
        title: "Success",
        description: "User has been made an admin.",
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
      setAddingAdmin(false);
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
              <TableHead className="text-right text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-slate-800">
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-bet-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <TableRow key={user.id} className="border-slate-800 hover:bg-slate-900/30">
                  <TableCell className="font-bold text-white text-xs">{user.name || 'Anonymous'}</TableCell>
                  <TableCell className="text-xs text-slate-300">{user.email || 'No email'}</TableCell>
                  <TableCell className="text-xs font-mono text-bet-primary font-bold">{user.balance !== null ? `${user.balance.toLocaleString()} RWF` : 'N/A'}</TableCell>
                  <TableCell className="text-xs">
                    {user.isAdmin ? (
                      <div className="flex items-center text-bet-primary font-bold">
                        <Shield className="h-4 w-4 mr-1 text-bet-primary" />
                        <span>Admin</span>
                      </div>
                    ) : (
                      <span className="text-slate-400">User</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {!user.isAdmin && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleMakeAdmin(user.id)}
                        disabled={addingAdmin}
                        className="border-slate-800 hover:bg-slate-850 hover:text-white"
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Make Admin
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-slate-800">
                <TableCell colSpan={5} className="text-center py-6 text-slate-400 text-xs">No users found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

