
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";

export default function AdminSetup() {
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleMakeAdmin = async () => {
    if (!userEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Fetch the users list to search for the user by email
      const users = await apiFetch('/auth/admin/users/');
      const targetUser = users.find((u: any) => u.email?.toLowerCase() === userEmail.toLowerCase());
      
      if (!targetUser) {
        toast({
          title: "User Not Found",
          description: "No user found with that email address",
          variant: "destructive",
        });
        return;
      }
      
      const userId = targetUser.id;
      
      // Call Django admin update role endpoint
      await apiFetch(`/auth/admin/users/${userId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ role: 'admin' }),
      });
      
      toast({
        title: "Success",
        description: "User has been made an admin successfully",
      });
      setUserEmail("");
    } catch (error) {
      console.error('Error making user an admin:', error);
      toast({
        title: "Error",
        description: "Failed to make user an admin. Make sure you are logged in as an administrator.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Setup</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#0a0e1b] border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Admin Privileges Guide</CardTitle>
            <CardDescription className="text-slate-400">
              How to obtain and manage admin status on the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-300">
            <p>
              To create an administrator account, use Django's command-line interface on the host machine:
            </p>
            <pre className="bg-[#05070d] p-3 rounded text-bet-primary font-mono text-xs overflow-x-auto">
              python manage.py createsuperuser
            </pre>
            <p>
              This creates a user with `admin` role and superuser permissions, allowing you to access all dashboard modules.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0a0e1b] border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Add Another Admin</CardTitle>
            <CardDescription className="text-slate-400">
              Grant admin privileges to another user by email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="User Email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="bg-[#05070d] border-slate-800 text-white"
            />
            <Button 
              onClick={handleMakeAdmin} 
              disabled={loading || !userEmail}
              className="w-full bg-bet-primary hover:bg-bet-primary/85 text-black font-bold"
            >
              {loading ? "Processing..." : "Make Admin"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
