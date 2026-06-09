import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Layout from "@/components/Layout";
import CasinoGameCard from "@/components/CasinoGameCard";
import { dbFallback } from "@/utils/dbFallback";

// Mock data for casino games
const casinoGames = [
  {
    title: "Neon City Slots",
    imageSrc: "https://images.unsplash.com/photo-1596838132330-5211dbd5c461?q=80&w=2070&auto=format&fit=crop",
    provider: "NetPlay",
    isNew: true,
    category: "slots"
  },
  {
    title: "Royal Blackjack",
    imageSrc: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?q=80&w=2073&auto=format&fit=crop",
    provider: "Evolution Gaming",
    isPopular: true,
    category: "table"
  },
  {
    title: "Mega Fortune Wheel",
    imageSrc: "https://images.unsplash.com/photo-1629895218613-a532fd7a8313?q=80&w=1932&auto=format&fit=crop",
    provider: "PlayTech",
    isPopular: true,
    category: "wheel"
  },
  {
    title: "Mystic Gems",
    imageSrc: "https://images.unsplash.com/photo-1619967435599-80c18fb1604c?q=80&w=1974&auto=format&fit=crop",
    provider: "NetPlay",
    isNew: true,
    category: "slots"
  },
  {
    title: "Golden Poker",
    imageSrc: "https://images.unsplash.com/photo-1541278107931-e006523892df?q=80&w=2071&auto=format&fit=crop",
    provider: "Evolution Gaming",
    category: "table"
  },
  {
    title: "Asian Fortune",
    imageSrc: "https://images.unsplash.com/photo-1596838132330-5211dbd5c461?q=80&w=2070&auto=format&fit=crop",
    provider: "PlayTech",
    category: "slots"
  },
  {
    title: "Ultra Roulette",
    imageSrc: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=2071&auto=format&fit=crop",
    provider: "Evolution Gaming",
    isPopular: true,
    category: "table"
  },
  {
    title: "Crypto Miner",
    imageSrc: "https://images.unsplash.com/photo-1642794816460-74f3e2e1d9b5?q=80&w=1932&auto=format&fit=crop",
    provider: "NetPlay",
    isNew: true,
    category: "slots"
  },
  {
    title: "Live Dealer Blackjack",
    imageSrc: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=2070&auto=format&fit=crop",
    provider: "Evolution Gaming",
    isPopular: true,
    category: "live"
  },
  {
    title: "VIP Live Roulette",
    imageSrc: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=2070&auto=format&fit=crop",
    provider: "Evolution Gaming",
    isPopular: true,
    category: "live"
  },
  {
    title: "Mega Diamond Jackpot",
    imageSrc: "https://images.unsplash.com/photo-1596838132830-8535ef812c75?q=80&w=2070&auto=format&fit=crop",
    provider: "NetPlay",
    isNew: true,
    category: "jackpot"
  },
  {
    title: "Millionaire Maker",
    imageSrc: "https://images.unsplash.com/photo-1518893883800-45cd0954574b?q=80&w=1974&auto=format&fit=crop",
    provider: "PlayTech",
    isPopular: true,
    category: "jackpot"
  }
];

export default function Casino() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [games, setGames] = useState<any[]>([]);
  const location = useLocation();

  useEffect(() => {
    setGames(dbFallback.getCasinoGames());
  }, []);
  
  useEffect(() => {
    const path = location.pathname;
    if (path === "/casino/slots") {
      setActiveTab("slots");
    } else if (path === "/casino/table-games") {
      setActiveTab("table");
    } else if (path === "/casino/live-casino") {
      setActiveTab("live");
    } else if (path === "/casino/jackpots") {
      setActiveTab("jackpot");
    } else if (path === "/casino/game-shows") {
      setActiveTab("wheel");
    }
  }, [location.pathname]);
  
  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          game.provider.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = activeTab === "all";
    if (!matchesCategory) {
      if (activeTab === "table" && game.category === "table") {
        matchesCategory = true;
      } else if (activeTab === "slots" && game.category === "slots") {
        matchesCategory = true;
      } else if (activeTab === "wheel" && game.category === "wheel") {
        matchesCategory = true;
      } else if (activeTab === "jackpot" && game.category === "jackpot") {
        matchesCategory = true;
      } else if (activeTab === "live" && game.category === "live") {
        matchesCategory = true;
      }
    }
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout hideBettingSlip={true}>
      <div className="flex flex-col gap-6">
        {/* Header Title */}
        <div>
          <h1 className="text-2xl font-black uppercase text-white tracking-tight">Casino Games</h1>
          <p className="text-muted-foreground text-xs mt-1">
            Experience our premium slots, table games, and live dealers.
          </p>
        </div>
        
        {/* Search & Filter */}
        <div className="bg-card/40 border border-border/60 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4 items-center">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 h-4 w-4" />
            <Input 
              type="text" 
              placeholder="Search for games..." 
              className="pl-9 h-9 bg-bet-dark/60 border-border/50 text-sm focus-visible:ring-bet-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs 
            defaultValue="all" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-6 w-full md:w-auto bg-bet-dark/60 h-9 p-0.5 border border-border/50">
              <TabsTrigger value="all" className="text-xs font-bold py-1.5 px-3">All</TabsTrigger>
              <TabsTrigger value="slots" className="text-xs font-bold py-1.5 px-3">Slots</TabsTrigger>
              <TabsTrigger value="table" className="text-xs font-bold py-1.5 px-3">Table</TabsTrigger>
              <TabsTrigger value="live" className="text-xs font-bold py-1.5 px-3">Live</TabsTrigger>
              <TabsTrigger value="jackpot" className="text-xs font-bold py-1.5 px-3">Jackpots</TabsTrigger>
              <TabsTrigger value="wheel" className="text-xs font-bold py-1.5 px-3">Shows</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGames.length > 0 ? (
            filteredGames.map((game, index) => (
              <CasinoGameCard
                key={index}
                title={game.title}
                imageSrc={game.imageSrc}
                provider={game.provider}
                isNew={game.isNew}
                isPopular={game.isPopular}
                category={game.category}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16 border border-dashed border-border/60 rounded-xl bg-card/25">
              <p className="text-muted-foreground">No games found matching your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
