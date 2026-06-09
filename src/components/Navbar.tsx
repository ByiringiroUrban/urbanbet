
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Menu, 
  X, 
  ChevronDown, 
  Trophy, 
  Activity, 
  Zap, 
  Search, 
  Bell,
  LogOut,
  Wallet,
  Settings,
  Brain,
  Club
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { isAuthenticated, logout } from "@/utils/authUtils";
import { useBetting } from "@/contexts/BettingContext";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userBalance, setUserBalance] = useState("0");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { currency } = useBetting();

  // Mock notifications data
  const notifications = [
    { id: 1, message: "Your deposit was successful", time: "5 minutes ago", isRead: false },
    { id: 2, message: "Arsenal vs Chelsea match starts in 30 minutes", time: "30 minutes ago", isRead: false },
    { id: 3, message: "Congratulations! You won 25,000 RWF", time: "2 hours ago", isRead: true }
  ];

  useEffect(() => {
    // Check if user is logged in
    const authenticated = isAuthenticated();
    setIsLoggedIn(authenticated);
    
    if (authenticated) {
      setUserName(localStorage.getItem("userName") || "User");
      // In a real app, this would fetch the user's balance from an API
      setUserBalance(currency === "RWF" ? "1,500,000" : "1,250.00");
    }
  }, [location.pathname, currency]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    // Clear user data
    logout();
    
    setIsLoggedIn(false);
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    
    navigate("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search initiated",
        description: `Searching for: ${searchQuery}`,
      });
      // In a real app, this would navigate to search results page
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-bet-dark/95 border-b border-border select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white uppercase">
                URBAN <span className="text-bet-primary">BET</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Middle Centered Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/sports" 
              className={cn(
                "flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-all text-[10px] font-bold tracking-wider",
                location.pathname.startsWith("/sports") 
                  ? "text-bet-primary" 
                  : "text-muted-foreground hover:text-white"
              )}
            >
              <Trophy className="h-5 w-5" />
              <span>SPORTS</span>
            </Link>

            <Link 
              to="/casino" 
              className={cn(
                "flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-all text-[10px] font-bold tracking-wider",
                location.pathname.startsWith("/casino") 
                  ? "text-bet-primary" 
                  : "text-muted-foreground hover:text-white"
              )}
            >
              <Club className="h-5 w-5" />
              <span>CASINO</span>
            </Link>

            <Link 
              to="/live" 
              className={cn(
                "flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-all text-[10px] font-bold tracking-wider",
                location.pathname === "/live" 
                  ? "text-bet-primary" 
                  : "text-muted-foreground hover:text-white"
              )}
            >
              <Zap className="h-5 w-5" />
              <span>LIVE BETTING</span>
            </Link>

            <Link 
              to="/ai-predictions" 
              className={cn(
                "flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-all text-[10px] font-bold tracking-wider",
                location.pathname === "/ai-predictions" 
                  ? "text-bet-primary" 
                  : "text-muted-foreground hover:text-white"
              )}
            >
              <Brain className="h-5 w-5" />
              <span>AI PREDICTIONS</span>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-foreground hover:text-bet-primary transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Action Buttons / User Status */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* Balance & Dropdown */}
                <div className="flex items-center space-x-3 bg-bet-dark-accent/30 border border-border px-3 py-1.5 rounded-lg">
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Balance</span>
                    <span className="text-xs font-bold text-white">
                      {currency === "RWF" ? "RWF " : "$"}{parseFloat(userBalance.replace(/,/g, '')).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                      <Avatar className="h-7 w-7 hover:scale-105 transition-transform border border-border cursor-pointer">
                        {localStorage.getItem("userAvatar") ? (
                          <AvatarImage 
                            src={localStorage.getItem("userAvatar") || ""} 
                            className="object-cover" 
                          />
                        ) : null}
                        <AvatarFallback className="bg-bet-dark-accent text-[10px] text-white">
                          {userName.split(' ').map(name => name[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="cursor-pointer">
                          <Trophy size={14} className="mr-2" /> Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/account" className="cursor-pointer">
                          <Settings size={14} className="mr-2" /> Account Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/wallet" className="cursor-pointer">
                          <Wallet size={14} className="mr-2" /> Wallet
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          <Settings size={14} className="mr-2" /> Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-500 focus:text-red-500 cursor-pointer"
                        onClick={handleLogout}
                      >
                        <LogOut size={14} className="mr-2" /> Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Deposit Button */}
                <Button 
                  onClick={() => navigate("/wallet")}
                  className="bg-bet-primary text-bet-primary-foreground font-black tracking-wider hover:bg-bet-primary/90 transition-all rounded px-4 h-9 text-[11px]"
                >
                  DEPOSIT
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button className="bg-bet-primary text-bet-primary-foreground font-black hover:bg-bet-primary/90" size="sm" asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass py-4">
          <div className="px-4 space-y-3">
            <Link to="/sports" className="block font-medium hover:text-bet-primary" onClick={toggleMenu}>
              Sports
            </Link>
            <Link to="/casino" className="block font-medium hover:text-bet-primary" onClick={toggleMenu}>
              Casino
            </Link>
            <Link to="/live" className="block font-medium hover:text-bet-primary" onClick={toggleMenu}>
              Live Betting
            </Link>
            <Link to="/ai-predictions" className="block font-medium hover:text-bet-primary" onClick={toggleMenu}>
              AI Predictions
            </Link>
            
            <div className="pt-4 space-y-2">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-bet-accent">
                          {userName.split(' ').map(name => name[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {currency === "RWF" ? "RWF " : "$"}{userBalance}
                      </span>
                    </div>
                  </div>
                  <Link to="/dashboard" onClick={toggleMenu}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Trophy size={14} className="mr-2" /> Dashboard
                    </Button>
                  </Link>
                  <Link to="/account" onClick={toggleMenu}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings size={14} className="mr-2" /> Account Settings
                    </Button>
                  </Link>
                  <Link to="/wallet" onClick={toggleMenu}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Wallet size={14} className="mr-2" /> Wallet
                    </Button>
                  </Link>
                  <Link to="/admin" onClick={toggleMenu}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings size={14} className="mr-2" /> Admin Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-red-500 hover:text-red-600"
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                  >
                    <LogOut size={14} className="mr-2" /> Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/login" onClick={toggleMenu}>Log In</Link>
                  </Button>
                  <Button className="w-full bg-bet-primary hover:bg-bet-primary/90" asChild>
                    <Link to="/register" onClick={toggleMenu}>Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
