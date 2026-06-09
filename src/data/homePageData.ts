import { Match, CasinoGame, AIInsight } from "@/types";

export const aiInsights: AIInsight[] = [
  {
    match: "Manchester United vs Liverpool",
    prediction: "Liverpool to win",
    confidence: 78,
    analysis: "Based on recent form, Liverpool has won 4 out of their last 5 matches, while Manchester United has struggled with consistency.",
    trend: "Liverpool has won the last 3 head-to-head matches",
    odds: "1.95"
  },
  {
    match: "Lakers vs Warriors",
    prediction: "Over 220.5 points",
    confidence: 65,
    analysis: "Both teams have been scoring at a high rate in their recent games, with an average of 225 points in their last 5 meetings.",
    trend: "4 out of 5 recent games went over 220 points",
    odds: "1.87"
  },
  {
    match: "Novak Djokovic vs Carlos Alcaraz",
    prediction: "Alcaraz to win",
    confidence: 55,
    analysis: "Alcaraz has shown excellent form on this surface, while Djokovic is returning from a minor injury.",
    odds: "2.10"
  }
];

export const upcomingMatches: Match[] = [
  {
    id: "match1",
    homeTeam: "Man City",
    awayTeam: "Liverpool",
    league: "Premier League",
    country: "England",
    time: "20:00",
    date: "Today",
    homeOdds: 2.10,
    drawOdds: 3.50,
    awayOdds: 3.20,
    isLive: true
  },
  {
    id: "match2",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    league: "La Liga",
    country: "Spain",
    time: "22:00",
    date: "Today",
    homeOdds: 2.30,
    drawOdds: 3.40,
    awayOdds: 2.90
  },
  {
    id: "match3",
    homeTeam: "LA Lakers",
    awayTeam: "GS Warriors",
    league: "NBA",
    country: "USA",
    time: "03:00",
    date: "Today",
    homeOdds: 1.65,
    drawOdds: 0,
    awayOdds: 2.25
  },
  {
    id: "match4",
    homeTeam: "Bayern Munich",
    awayTeam: "Dortmund",
    league: "Bundesliga",
    country: "Germany",
    time: "Tomorrow",
    date: "Tomorrow",
    homeOdds: 1.60,
    drawOdds: 4.20,
    awayOdds: 5.50
  }
];

export const casinoGames: CasinoGame[] = [
  {
    title: "Aviator",
    imageSrc: "https://images.unsplash.com/photo-1436891620584-47fd0e565afb?q=80&w=1000&auto=format&fit=crop",
    provider: "Urban Games",
    isNew: true,
    isPopular: true,
    category: "aviator"
  },
  {
    title: "Fortune Tiger",
    imageSrc: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=500&auto=format&fit=crop",
    provider: "PG Soft",
    isNew: true,
    category: "slots"
  },
  {
    title: "Lightning Roulette",
    imageSrc: "https://images.unsplash.com/photo-1559582930-bb01987cf4dd?q=80&w=500&auto=format&fit=crop",
    provider: "Evolution",
    isPopular: true,
    category: "table"
  },
  {
    title: "Sweet Bonanza",
    imageSrc: "https://images.unsplash.com/photo-1586899028174-e7098604235b?q=80&w=500&auto=format&fit=crop",
    provider: "Pragmatic Play",
    isPopular: true,
    category: "slots"
  },
  {
    title: "Blackjack VIP",
    imageSrc: "https://images.unsplash.com/photo-1601370690183-1c7964158180?q=80&w=500&auto=format&fit=crop",
    provider: "Evolution",
    category: "table"
  }
];
