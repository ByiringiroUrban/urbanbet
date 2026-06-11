import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Layout from "@/components/Layout";
import CasinoGameCard from "@/components/CasinoGameCard";
import { apiFetch } from "@/lib/api";

export default function Casino() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const data = await apiFetch('/casino/games/');
        const mapped = (data || []).map((game: any) => ({
          id: String(game.id),
          title: game.title,
          provider: game.provider,
          category: game.category,
          imageSrc: game.image_src || 'https://images.unsplash.com/photo-1596838132330-5211dbd5c461?q=80&w=2070&auto=format&fit=crop',
          isNew: game.is_new,
          isPopular: game.is_popular
        }));
        setGames(mapped);
      } catch (error) {
        console.error('Error fetching casino games:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
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
    <Layout>
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
          {loading ? (
            <div className="col-span-full flex justify-center items-center py-16">
              <div className="w-8 h-8 border-4 border-bet-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredGames.length > 0 ? (
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
