import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import UpcomingMatchCard from "@/components/UpcomingMatchCard";
import { sportsCategories } from "@/data/sportsData";
import { isAuthenticated } from "@/utils/authUtils";
import { dbFallback } from "@/utils/dbFallback";

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

// Mock data for sports matches
const sportsData: Record<string, (BaseMatch | MatchWithDraw)[]> = {
  football: [
    {
      id: "match1",
      homeTeam: "Arsenal",
      awayTeam: "Chelsea",
      league: "Premier League",
      leagueId: "premier-league",
      time: "20:00",
      date: "Today",
      homeOdds: 2.10,
      drawOdds: 3.40,
      awayOdds: 3.75,
      isLive: true
    },
    {
      id: "match2",
      homeTeam: "Barcelona",
      awayTeam: "Real Madrid",
      league: "La Liga",
      leagueId: "la-liga",
      time: "21:00",
      date: "Tomorrow",
      homeOdds: 1.90,
      drawOdds: 3.50,
      awayOdds: 4.10
    },
    {
      id: "match3",
      homeTeam: "Bayern Munich",
      awayTeam: "Borussia Dortmund",
      league: "Bundesliga",
      time: "19:30",
      date: "Sat, 25 Jun",
      homeOdds: 1.75,
      drawOdds: 3.80,
      awayOdds: 4.50
    },
    {
      id: "match4",
      homeTeam: "PSG",
      awayTeam: "Marseille",
      league: "Ligue 1",
      leagueId: "ligue-1",
      time: "20:45",
      date: "Sun, 26 Jun",
      homeOdds: 1.65,
      drawOdds: 3.90,
      awayOdds: 5.20
    },
    {
      id: "match5",
      homeTeam: "APR FC",
      awayTeam: "Rayon Sports",
      league: "Rwanda Premier League",
      leagueId: "rwanda-premier",
      time: "15:00",
      date: "Tomorrow",
      homeOdds: 2.20,
      drawOdds: 3.10,
      awayOdds: 3.50
    },
    {
      id: "match6",
      homeTeam: "Manchester United",
      awayTeam: "Liverpool",
      league: "Premier League",
      leagueId: "premier-league",
      time: "16:30",
      date: "Sun, 26 Jun",
      homeOdds: 2.80,
      drawOdds: 3.40,
      awayOdds: 2.50
    },
    {
      id: "match7",
      homeTeam: "Real Madrid",
      awayTeam: "Bayern Munich",
      league: "UEFA Champions League",
      leagueId: "champions-league",
      time: "20:00",
      date: "Tue, 28 Jun",
      homeOdds: 2.10,
      drawOdds: 3.50,
      awayOdds: 3.30
    }
  ],
  basketball: [
    {
      id: "bball1",
      homeTeam: "Lakers",
      awayTeam: "Celtics",
      league: "NBA",
      leagueId: "nba",
      time: "22:00",
      date: "Today",
      homeOdds: 1.85,
      awayOdds: 2.05,
      isLive: true
    },
    {
      id: "bball2",
      homeTeam: "Warriors",
      awayTeam: "Nets",
      league: "NBA",
      leagueId: "nba",
      time: "23:30",
      date: "Tomorrow",
      homeOdds: 1.75,
      awayOdds: 2.15
    },
    {
      id: "bball3",
      homeTeam: "Bulls",
      awayTeam: "Heat",
      league: "NBA",
      leagueId: "nba",
      time: "21:00",
      date: "Sat, 25 Jun",
      homeOdds: 2.25,
      awayOdds: 1.70
    },
    {
      id: "bball4",
      homeTeam: "Patriots BBC",
      awayTeam: "REG",
      league: "Rwanda Basketball League",
      leagueId: "rwanda-basketball",
      time: "18:00",
      date: "Tomorrow",
      homeOdds: 2.40,
      awayOdds: 1.60
    }
  ],
  tennis: [
    {
      id: "tennis1",
      homeTeam: "Djokovic",
      awayTeam: "Nadal",
      league: "Grand Slams",
      leagueId: "grand-slams",
      time: "15:00",
      date: "Tomorrow",
      homeOdds: 1.90,
      awayOdds: 2.00
    },
    {
      id: "tennis2",
      homeTeam: "Alcaraz",
      awayTeam: "Medvedev",
      league: "US Open",
      leagueId: "grand-slams",
      time: "18:30",
      date: "Sat, 25 Jun",
      homeOdds: 1.85,
      awayOdds: 2.05
    },
    {
      id: "tennis3",
      homeTeam: "Mugisha",
      awayTeam: "Hakizimana",
      league: "Rwandan Open",
      leagueId: "rwandan-open",
      time: "14:00",
      date: "Today",
      homeOdds: 2.10,
      awayOdds: 1.80
    }
  ]
};

export default function Sports() {
  const { sport = "football", country, league } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [matchesView, setMatchesView] = useState("all");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [allEvents, setAllEvents] = useState<any[]>([]);

  useEffect(() => {
    setAllEvents(dbFallback.getEvents());
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
          {filteredMatches.length > 0 ? (
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
