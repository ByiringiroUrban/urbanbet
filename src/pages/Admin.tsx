import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAdmin } from "@/utils/authUtils";
import AdminEvents from "@/components/admin/AdminEvents";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminBets from "@/components/admin/AdminBets";
import AdminSetup from "@/components/admin/AdminSetup";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminRisk from "@/components/admin/AdminRisk";
import AdminTransactions from "@/components/admin/AdminTransactions";
import AdminCasinoGames from "@/components/admin/AdminCasinoGames";
import AdminPredictions from "@/components/admin/AdminPredictions";
import AdminSports from "@/components/admin/AdminSports";
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
          
          <div className="bg-[#0c1122] border border-slate-850 p-4 rounded-lg text-left space-y-3 text-xs text-slate-300">
            <p className="font-bold text-white">How to get Admin Access:</p>
            <p>1. Open your terminal in the backend directory.</p>
            <p>2. Create a superuser account in Django:</p>
            <pre className="bg-[#05070d] p-2 rounded text-bet-primary font-mono text-[11px] overflow-x-auto">
              python manage.py createsuperuser
            </pre>
            <p>3. Register or log in with that email/password on the login page.</p>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={enableDevMode} className="bg-bet-primary hover:bg-bet-primary/85 text-black font-black w-full">
              Enable Development Mode (Preview)
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
      case "sports":
        return <AdminSports />;
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

