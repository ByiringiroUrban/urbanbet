import { useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search, Star, Trophy, Activity, Dribbble, Target, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LeftSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sport, league } = useParams();
  const [searchVal, setSearchVal] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/sports?search=${encodeURIComponent(searchVal)}`);
    }
  };

  const topLeagues = [
    { name: "Premier League", id: "premier-league", sport: "football", country: "england" },
    { name: "La Liga", id: "la-liga", sport: "football", country: "spain" },
  ];

  const sportsList = [
    { name: "Football", id: "football", icon: Trophy },
    { name: "Basketball", id: "basketball", icon: Dribbble },
    { name: "American Football", id: "american-football", icon: Target },
    { name: "Tennis", id: "tennis", icon: Activity },
    { name: "MMA / UFC", id: "mma-ufc", icon: Shield },
  ];

  return (
    <aside className="w-full lg:w-64 bg-card/25 border-b lg:border-b-0 lg:border-r border-border p-4 flex flex-col gap-6 select-none shrink-0">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search..." 
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className="pl-9 bg-bet-dark/60 border-border/50 text-sm focus-visible:ring-bet-primary focus-visible:border-bet-primary" 
        />
      </form>

      {/* Top Leagues */}
      <div className="flex flex-col gap-2">
        <div className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase px-2 mb-1">
          Top Leagues
        </div>
        {topLeagues.map((item) => {
          const isActive = league === item.id;
          return (
            <Link
              key={item.id}
              to={`/sports/${item.sport}/${item.country}/${item.id}`}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 hover:bg-muted/50",
                isActive 
                  ? "bg-bet-primary/10 text-bet-primary font-semibold border-l-2 border-bet-primary pl-2 rounded-l-none" 
                  : "text-foreground"
              )}
            >
              <Star className={cn("h-4 w-4 shrink-0", isActive ? "fill-bet-primary text-bet-primary" : "text-muted-foreground/60")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* All Sports */}
      <div className="flex flex-col gap-2">
        <div className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase px-2 mb-1">
          All Sports
        </div>
        {sportsList.map((item) => {
          const isActive = sport === item.id || (location.pathname === "/" && item.id === "football" && !sport);
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={`/sports/${item.id}`}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 hover:bg-muted/50",
                isActive 
                  ? "bg-bet-primary/10 text-bet-primary font-semibold border-l-2 border-bet-primary pl-2 rounded-l-none" 
                  : "text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-bet-primary" : "text-muted-foreground/60")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
