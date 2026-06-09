import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAdmin, addAdmin } from "@/utils/authUtils";
import { supabase } from "@/integrations/supabase/client";
import AdminEvents from "@/components/admin/AdminEvents";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminBets from "@/components/admin/AdminBets";
import AdminSetup from "@/components/admin/AdminSetup";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminRisk from "@/components/admin/AdminRisk";
import AdminTransactions from "@/components/admin/AdminTransactions";
import AdminCasinoGames from "@/components/admin/AdminCasinoGames";
import AdminPredictions from "@/components/admin/AdminPredictions";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [devModeActive, setDevModeActive] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      setLoading(true);
      const adminStatus = await isAdmin();
      setIsAdminUser(adminStatus);
      
      if (!adminStatus) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin dashboard.",
          variant: "destructive",
        });
      }
      
      setLoading(false);
    };
    
    checkAdminStatus();
  }, [toast]);

  const enableDevMode = async () => {
    setDevModeActive(true);
    toast({
      title: "Development Mode Activated",
      description: "You now have temporary access to the admin dashboard.",
    });
  };

  const makeSelfAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to perform this action",
          variant: "destructive",
        });
        return;
      }
      
      const result = await addAdmin(user.id);
      
      if (result) {
        toast({
          title: "Success",
          description: "You are now an admin. Please refresh the page.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to make you an admin. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error making self admin:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#03050a] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-white">Checking permissions...</h2>
          <div className="w-8 h-8 border-4 border-bet-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!isAdminUser && !devModeActive) {
    return (
      <div className="min-h-screen bg-[#03050a] flex flex-col items-center justify-center p-6 text-slate-100">
        <div className="max-w-md w-full bg-[#070a13] border border-slate-800 rounded-xl p-8 text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase text-white tracking-tight">Access Denied</h2>
            <p className="text-slate-400 text-xs">You don't have permission to access the admin dashboard.</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={enableDevMode} className="bg-bet-primary hover:bg-bet-primary/85 text-black font-black w-full">
              Enable Development Mode
            </Button>
            <Button onClick={makeSelfAdmin} variant="outline" className="border-slate-800 hover:bg-slate-800 text-white w-full">
              Make Me an Admin
            </Button>
            <Button 
              variant="outline" 
              className="border-slate-800 hover:bg-slate-800 text-white w-full"
              onClick={async () => {
                try {
                  const { data: { user } } = await supabase.auth.getUser();
                  if (!user) {
                    toast({
                      title: "Error",
                      description: "You must be logged in to perform this action",
                      variant: "destructive",
                    });
                    return;
                  }
                  
                  const { data, error } = await supabase.rpc('create_first_admin', {
                    admin_user_id: user.id
                  });
                  
                  if (error) throw error;
                  
                  if (data === true) {
                    toast({
                      title: "Success",
                      description: "You are now the first admin. Please refresh the page.",
                    });
                  } else {
                    toast({
                      title: "Not First Admin",
                      description: "Admin roles already exist in the system.",
                    });
                  }
                } catch (error) {
                  console.error("Error:", error);
                  toast({
                    title: "Error",
                    description: "An unexpected error occurred",
                    variant: "destructive",
                  });
                }
              }}
            >
              Try to Become First Admin
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render correct component based on activeTab state
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard />;
      case "events":
        return <AdminEvents />;
      case "casino":
        return <AdminCasinoGames />;
      case "predictions":
        return <AdminPredictions />;
      case "bets":
        return <AdminBets />;
      case "users":
        return <AdminUsers />;
      case "transactions":
        return <AdminTransactions />;
      case "risk":
        return <AdminRisk />;
      case "setup":
        return <AdminSetup />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {devModeActive && !isAdminUser && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-lg p-3 text-xs font-semibold flex items-center justify-between">
          <span>Development Preview Mode Active (Temporary admin access granted)</span>
          <Button size="sm" variant="ghost" onClick={() => setDevModeActive(false)} className="h-7 text-yellow-500 hover:text-white hover:bg-yellow-500/20">
            Exit Preview
          </Button>
        </div>
      )}
      <div className="bg-[#070a13] border border-slate-800 rounded-xl p-6 md:p-8">
        {renderTabContent()}
      </div>
    </AdminLayout>
  );
}

