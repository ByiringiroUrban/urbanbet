import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import UpcomingMatchCard from "@/components/UpcomingMatchCard";
import { sportsCategories } from "@/data/sportsData";
import { isAuthenticated } from "@/utils/authUtils";
import { apiFetch } from "@/lib/api";

// Define TypeScript interfaces for our data structure
interface BaseMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  time: string;
  date: string;
  homeOdds: number;
  awayOdds: number;
  isLive?: boolean;
  leagueId?: string;
}

interface MatchWithDraw extends BaseMatch {
  drawOdds: number;
}

function hasDrawOdds(match: BaseMatch): match is MatchWithDraw {
  return 'drawOdds' in match;
}

export default function Sports() {
  const { sport = "football", country, league } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [matchesView, setMatchesView] = useState("all");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [allEvents, setAllEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await apiFetch('/sports/events/');
        const mapped = (data || []).map((evt: any) => ({
          id: String(evt.id),
          homeTeam: evt.home_team,
          awayTeam: evt.away_team,
          league: evt.league_name,
          time: new Date(evt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date(evt.start_time).toLocaleDateString([], { day: '2-digit', month: 'short' }),
          homeOdds: Number(evt.home_odds),
          drawOdds: evt.draw_odds ? Number(evt.draw_odds) : undefined,
          awayOdds: Number(evt.away_odds),
          isLive: evt.is_live,
          sportId: evt.sport_name?.toLowerCase(),
          country: evt.country_name?.toLowerCase(),
          startTime: evt.start_time,
          leagueId: evt.league_name?.toLowerCase().replace(/\s+/g, '-')
        }));
        setAllEvents(mapped);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);


  const validSport = ["football", "basketball", "tennis"].includes(sport) ? sport : "football";
  let matches = allEvents.filter(match => match.sportId === validSport);
  
  if (league) {
    matches = matches.filter(match => 
      (match as any).leagueId === league || 
      match.league?.toLowerCase().replace(/\s+/g, '-') === league
    );
  } else if (country) {
    const sportCategory = sportsCategories.find(sc => sc.id === validSport);
    if (sportCategory) {
      const countryData = sportCategory.countries.find(c => c.id === country);
      if (countryData) {
        const leagueIds = countryData.leagues.map(l => l.id);
        matches = matches.filter(match => 
          leagueIds.includes((match as any).leagueId || '') || 
          match.country?.toLowerCase() === country
        );
      }
    }
  }
  
  const filteredMatches = matches.filter(match => {
    const matchesSearch = 
      match.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) || 
      match.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.league.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesViewFilter = 
      matchesView === "all" || 
      (matchesView === "live" && match.isLive === true) || 
      (matchesView === "upcoming" && match.isLive !== true);
    
    return matchesSearch && matchesViewFilter;
  });

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const getPageTitle = () => {
    if (league) {
      const sportCategory = sportsCategories.find(sc => sc.id === validSport);
      if (sportCategory) {
        for (const countryData of sportCategory.countries) {
          const leagueData = countryData.leagues.find(l => l.id === league);
          if (leagueData) {
            return leagueData.name;
          }
        }
      }
      return league.replace(/-/g, ' ');
    }
    
    if (country) {
      const sportCategory = sportsCategories.find(sc => sc.id === validSport);
      if (sportCategory) {
        const countryData = sportCategory.countries.find(c => c.id === country);
        if (countryData) {
          return `${countryData.name} ${sportCategory.name}`;
        }
      }
      return country.replace(/-/g, ' ');
    }
    
    const sportCategory = sportsCategories.find(sc => sc.id === validSport);
    return sportCategory ? sportCategory.name : validSport.replace(/-/g, ' ');
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        {/* Header Title */}
        <div>
          <h1 className="text-2xl font-black uppercase text-white tracking-tight">{getPageTitle()}</h1>
          <p className="text-muted-foreground text-xs mt-1">
            Browse available matches and place your bets
          </p>
        </div>
        
        {/* View Options */}
        <div className="bg-card/40 border border-border/60 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4 items-center">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 h-4 w-4" />
            <Input 
              type="text" 
              placeholder="Search for matches..." 
              className="pl-9 h-9 bg-bet-dark/60 border-border/50 text-sm focus-visible:ring-bet-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs 
            defaultValue="all" 
            value={matchesView}
            onValueChange={setMatchesView}
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-3 w-full md:w-auto bg-bet-dark/60 h-9 p-0.5 border border-border/50">
              <TabsTrigger value="all" className="text-xs font-bold py-1.5 px-3">All Matches</TabsTrigger>
              <TabsTrigger value="live" className="text-xs font-bold py-1.5 px-3">Live Now</TabsTrigger>
              <TabsTrigger value="upcoming" className="text-xs font-bold py-1.5 px-3">Upcoming</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Matches Stack */}
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-8 h-8 border-4 border-bet-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredMatches.length > 0 ? (
            filteredMatches.map((match, index) => (
              <UpcomingMatchCard
                key={match.id || `${validSport}-${index}`}
                id={match.id || `${validSport}-${index}`}
                homeTeam={match.homeTeam}
                awayTeam={match.awayTeam}
                league={match.league}
                time={match.time}
                date={match.date}
                homeOdds={match.homeOdds}
                drawOdds={hasDrawOdds(match) ? match.drawOdds : undefined}
                awayOdds={match.awayOdds}
                isLive={match.isLive}
              />
            ))
          ) : (
            <div className="text-center py-16 border border-dashed border-border/60 rounded-xl bg-card/25">
              <p className="text-sm text-muted-foreground">No matches found matching your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
