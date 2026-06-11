import React, { useState, useEffect, useRef } from "react";
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
  Minimize,
  Moon,
  Sun,
  Menu,
  X,
  UserCheck,
  LogOut,
  ChevronDown,
  CheckCheck,
  AlertCircle,
  Info,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { logout } from "@/utils/authUtils";
import { useToast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NOTIFICATIONS = [
  { id: 1, icon: AlertCircle, color: "text-yellow-400", bg: "bg-yellow-400/10", title: "High-risk bet detected", body: "User #4821 placed a RWF 500,000 bet on Arsenal vs Chelsea.", time: "2 min ago", unread: true },
  { id: 2, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10", title: "New user registered", body: "Mugisha Jean joined via email signup.", time: "15 min ago", unread: true },
  { id: 3, icon: CheckCheck, color: "text-emerald-400", bg: "bg-emerald-400/10", title: "Withdrawal approved", body: "RWF 200,000 sent to Kalisa Diane.", time: "1 hour ago", unread: false },
  { id: 4, icon: Info, color: "text-slate-400", bg: "bg-slate-400/10", title: "System backup complete", body: "Nightly database backup finished successfully.", time: "3 hours ago", unread: false },
];

export default function AdminLayout({ children, activeTab, setActiveTab }: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const userName = localStorage.getItem("userName") || "Administrator";
  const userEmail = localStorage.getItem("userEmail") || "admin@urbanbet.rw";
  const userInitials = userName.split(" ").map((n) => n[0]).join("").toUpperCase();
  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fullscreen API
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  // Logout
  const handleLogout = async () => {
    await logout();
    toast({ title: "Signed out", description: "You have been logged out of the admin panel." });
    navigate("/login");
  };

  // Mark all read
  const markAllRead = () => setNotifications((n) => n.map((x) => ({ ...x, unread: false })));

  // Search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({ title: "Search", description: `Searching for: "${searchQuery}"` });
    }
  };

  const menuGroups = [
    {
      title: "DASHBOARD",
      items: [{ id: "dashboard", label: "Overview", icon: LayoutDashboard }],
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
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { id: "risk", label: "Risk Management", icon: ShieldAlert },
        { id: "setup", label: "System Setup", icon: Settings },
      ],
    },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const SidebarNav = () => (
    <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      {menuGroups.map((group, i) => (
        <div key={i} className="space-y-1.5">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3">{group.title}</h4>
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
                    <Icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-bet-primary" : "text-slate-400 group-hover:text-white")} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className={cn("min-h-screen flex bg-[#03050a] text-slate-100 antialiased", darkMode ? "dark" : "")}>

      {/* ─── Sidebar Desktop ─── */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-[#070a13] border-r border-slate-800/80 sticky top-0 h-screen z-20">
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

        <SidebarNav />

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

      {/* ─── Sidebar Mobile Drawer ─── */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative flex flex-col w-72 max-w-[80%] bg-[#070a13] border-r border-slate-800 h-full z-10 p-5">
            <button className="absolute top-5 right-5 text-slate-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-6 w-6" />
            </button>
            <div className="mb-8 mt-2">
              <span className="text-xl font-black uppercase tracking-wider text-white">URBAN <span className="text-bet-primary">BET</span></span>
              <span className="ml-2 text-[10px] bg-bet-primary/15 text-bet-primary border border-bet-primary/30 px-1.5 py-0.5 rounded font-black tracking-widest uppercase">ADMIN</span>
            </div>
            <SidebarNav />
            <div className="pt-4 border-t border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setMobileMenuOpen(false); navigate("/sports"); }}
                className="w-full border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60 text-xs font-bold gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Sportsbook
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* ─── Main Content Area ─── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ═══ HEADER ═══ */}
        <header className="h-16 px-4 md:px-6 bg-[#070a13] border-b border-slate-800/80 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">

          {/* Left: Mobile toggle + Search */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Search */}
            <form onSubmit={handleSearch} className="relative w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, users, or tickets..."
                className="w-full bg-[#0a0e1b] border-slate-800 text-xs text-white pl-9 pr-4 h-9 rounded-lg focus-visible:ring-bet-primary placeholder:text-slate-500"
              />
            </form>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 md:gap-3">

            {/* Region */}
            <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg hidden sm:flex items-center gap-1.5 transition-colors">
              <Globe className="h-4 w-4" />
              <span className="text-[10px] font-black tracking-wider uppercase">RWANDA (RWF)</span>
            </button>

            {/* ── Notifications ── */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="relative p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 h-4 w-4 bg-bet-primary text-[9px] font-black text-black rounded-full flex items-center justify-center leading-none">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-[#070a13] border border-slate-800 rounded-xl shadow-2xl shadow-black/60 z-50 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                    <span className="text-sm font-black text-white">Notifications</span>
                    <button onClick={markAllRead} className="text-[10px] font-bold text-bet-primary hover:text-bet-primary/80 transition-colors">
                      Mark all read
                    </button>
                  </div>
                  {/* Items */}
                  <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto">
                    {notifications.map((n) => {
                      const Icon = n.icon;
                      return (
                        <div
                          key={n.id}
                          className={cn("flex gap-3 px-4 py-3 hover:bg-slate-800/30 cursor-pointer transition-colors", n.unread && "bg-slate-800/20")}
                          onClick={() => setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, unread: false } : x))}
                        >
                          <div className={cn("mt-0.5 p-1.5 rounded-lg shrink-0", n.bg)}>
                            <Icon className={cn("h-3.5 w-3.5", n.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white leading-snug flex items-center gap-1.5">
                              {n.title}
                              {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-bet-primary shrink-0" />}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-2">{n.body}</p>
                            <p className="text-[10px] text-slate-500 mt-1">{n.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="px-4 py-2.5 border-t border-slate-800 text-center">
                    <button className="text-[10px] font-bold text-slate-400 hover:text-white transition-colors">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg hidden sm:block transition-colors"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg hidden sm:block transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </button>

            {/* Divider */}
            <span className="h-8 w-px bg-slate-800 hidden sm:block" />

            {/* ── Profile Dropdown ── */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-800/50 transition-colors group"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-bet-primary/10 border border-bet-primary/30 flex items-center justify-center relative shrink-0">
                  <span className="text-[11px] font-black text-bet-primary">{userInitials}</span>
                  <span className="absolute bottom-0 right-0 h-2 w-2 bg-emerald-500 rounded-full border border-[#070a13]" />
                </div>
                {/* Name */}
                <div className="text-left hidden md:block">
                  <p className="text-xs font-black text-white leading-none">{userName}</p>
                  <p className="text-[9px] text-bet-primary font-bold mt-0.5 uppercase tracking-wider">Super Administrator</p>
                </div>
                <ChevronDown className={cn("h-3.5 w-3.5 text-slate-400 hidden md:block transition-transform duration-200", profileOpen && "rotate-180")} />
              </button>

              {/* Profile dropdown panel */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-[#070a13] border border-slate-800 rounded-xl shadow-2xl shadow-black/60 z-50 overflow-hidden">
                  {/* User card */}
                  <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-bet-primary/10 border border-bet-primary/30 flex items-center justify-center shrink-0">
                        <span className="text-sm font-black text-bet-primary">{userInitials}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-white leading-none truncate">{userName}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">{userEmail}</p>
                        <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-black text-bet-primary bg-bet-primary/10 border border-bet-primary/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
                          <Shield className="h-2.5 w-2.5" /> Super Admin
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1.5">
                    <button
                      onClick={() => { setActiveTab("setup"); setProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors text-left"
                    >
                      <Settings className="h-4 w-4 text-slate-400" />
                      System Settings
                    </button>
                    <button
                      onClick={() => { setActiveTab("users"); setProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors text-left"
                    >
                      <UserCheck className="h-4 w-4 text-slate-400" />
                      Manage Users
                    </button>
                    <button
                      onClick={() => { navigate("/sports"); setProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors text-left"
                    >
                      <ArrowLeft className="h-4 w-4 text-slate-400" />
                      Back to Sportsbook
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-800 py-1.5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* ─── Main Panel Content ─── */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
