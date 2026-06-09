import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  Gamepad2, 
  BrainCircuit, 
  Ticket, 
  Users, 
  ArrowLeftRight, 
  ShieldAlert, 
  Settings, 
  ArrowLeft,
  Search,
  Bell,
  Globe,
  Maximize,
  Moon,
  Sun,
  Menu,
  X,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminLayout({ children, activeTab, setActiveTab }: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  const menuGroups = [
    {
      title: "DASHBOARD",
      items: [
        { id: "dashboard", label: "Overview", icon: LayoutDashboard },
      ]
    },
    {
      title: "MANAGEMENT",
      items: [
        { id: "events", label: "Events / Matches", icon: Calendar },
        { id: "casino", label: "Casino Games", icon: Gamepad2 },
        { id: "predictions", label: "AI Predictions", icon: BrainCircuit },
        { id: "bets", label: "Bet Slips", icon: Ticket },
        { id: "users", label: "Users & Accounts", icon: Users },
        { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
      ]
    },
    {
      title: "SYSTEM",
      items: [
        { id: "risk", label: "Risk Management", icon: ShieldAlert },
        { id: "setup", label: "System Setup", icon: Settings },
      ]
    }
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div className={cn("min-h-screen flex bg-[#03050a] text-slate-100 antialiased", darkMode ? "dark" : "")}>
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-[#070a13] border-r border-slate-800/80 sticky top-0 h-screen z-20">
        {/* Brand/Logo */}
        <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-lg font-black uppercase tracking-wider text-white">
              URBAN <span className="text-bet-primary">BET</span>
            </span>
            <span className="text-[10px] bg-bet-primary/15 text-bet-primary border border-bet-primary/30 px-1.5 py-0.5 rounded font-black tracking-widest uppercase">
              ADMIN
            </span>
          </Link>
        </div>

        {/* Navigation Scroll Area */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1.5">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3">
                {group.title}
              </h4>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleTabClick(item.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 group text-left",
                          isActive 
                            ? "bg-bet-primary/10 text-bet-primary border-l-2 border-bet-primary" 
                            : "text-slate-400 hover:text-white hover:bg-slate-800/30 border-l-2 border-transparent"
                        )}
                      >
                        <Icon className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          isActive ? "text-bet-primary" : "text-slate-400 group-hover:text-white"
                        )} />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/10">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/sports")}
            className="w-full justify-start border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60 text-xs font-bold gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sportsbook
          </Button>
        </div>
      </aside>

      {/* Sidebar - Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <aside className="relative flex flex-col w-72 max-w-[80%] bg-[#070a13] border-r border-slate-800 h-full z-10 p-5">
            <button 
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>

            {/* Brand Logo */}
            <div className="mb-8 mt-2">
              <span className="text-xl font-black uppercase tracking-wider text-white">
                URBAN <span className="text-bet-primary">BET</span>
              </span>
              <span className="ml-2 text-[10px] bg-bet-primary/15 text-bet-primary border border-bet-primary/30 px-1.5 py-0.5 rounded font-black tracking-widest uppercase">
                ADMIN
              </span>
            </div>

            <nav className="flex-grow overflow-y-auto space-y-6">
              {menuGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3">
                    {group.title}
                  </h4>
                  <ul className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <li key={item.id}>
                          <button
                            onClick={() => handleTabClick(item.id)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 text-left",
                              isActive 
                                ? "bg-bet-primary/10 text-bet-primary border-l-2 border-bet-primary" 
                                : "text-slate-400 hover:text-white hover:bg-slate-800/30 border-l-2 border-transparent"
                            )}
                          >
                            <Icon className={cn("h-4 w-4", isActive ? "text-bet-primary" : "text-slate-400")} />
                            <span>{item.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>

            <div className="pt-4 border-t border-slate-800">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/sports");
                }}
                className="w-full border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60 text-xs font-bold gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sportsbook
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header - Flowkit Inspired */}
        <header className="h-16 px-4 md:px-6 bg-[#070a13] border-b border-slate-800/80 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md bg-opacity-90">
          
          {/* Left: Mobile Toggle & Search */}
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Search Bar */}
            <div className="relative w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                type="text" 
                placeholder="Search events, users, or tickets..." 
                className="w-full bg-[#0a0e1b] border-slate-800 text-xs text-white pl-9 pr-4 h-9 rounded-lg focus-visible:ring-bet-primary"
              />
            </div>
          </div>

          {/* Right: Actions & User Info */}
          <div className="flex items-center gap-4">
            
            {/* Country flag indicator */}
            <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg hidden sm:flex items-center gap-1.5">
              <Globe className="h-4 w-4" />
              <span className="text-[10px] font-black tracking-wider uppercase">RWANDA (RWF)</span>
            </button>

            {/* Notifications trigger */}
            <button className="relative p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-bet-primary rounded-full animate-pulse" />
            </button>

            {/* Dark mode toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg hidden sm:block"
            >
              {darkMode ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Maximize */}
            <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg hidden sm:block">
              <Maximize className="h-4 w-4" />
            </button>

            {/* Divider */}
            <span className="h-8 w-px bg-slate-800 hidden sm:block" />

            {/* Profile pill */}
            <div className="flex items-center gap-2.5 pl-1.5">
              <div className="w-8 h-8 rounded-full bg-bet-primary/10 border border-bet-primary/30 flex items-center justify-center relative">
                <UserCheck className="h-4 w-4 text-bet-primary" />
                <span className="absolute bottom-0 right-0 h-2 w-2 bg-emerald-500 rounded-full border border-[#070a13]" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-black text-white leading-none">Byiringiro Urban</p>
                <p className="text-[9px] text-bet-primary font-bold mt-0.5 uppercase tracking-wider">Super Administrator</p>
              </div>
            </div>

          </div>
        </header>

        {/* Main Panel Content Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
