import { SportEvent, AIprediction } from "@/services/database/types";

export interface CasinoGame {
  id: string;
  title: string;
  provider: string;
  imageSrc: string;
  category: string;
  isNew: boolean;
  isPopular: boolean;
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  balance: number;
  isAdmin: boolean;
}

export interface TransactionRecord {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'bet_win' | 'bet_loss';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  method?: string;
  reference?: string;
}

// Initial Events Mock
const initialEvents: SportEvent[] = [
  // Football
  {
    id: "match1",
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    league: "Premier League",
    time: "20:00",
    date: "Today",
    homeOdds: 2.10,
    drawOdds: 3.40,
    awayOdds: 3.75,
    isLive: true,
    sportId: "football",
    country: "england",
    startTime: new Date().toISOString()
  },
  {
    id: "match2",
    homeTeam: "Barcelona",
    awayTeam: "Real Madrid",
    league: "La Liga",
    time: "21:00",
    date: "Tomorrow",
    homeOdds: 1.90,
    drawOdds: 3.50,
    awayOdds: 4.10,
    isLive: false,
    sportId: "football",
    country: "spain",
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
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
    awayOdds: 4.50,
    isLive: false,
    sportId: "football",
    country: "germany",
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "match4",
    homeTeam: "PSG",
    awayTeam: "Marseille",
    league: "Ligue 1",
    time: "20:45",
    date: "Sun, 26 Jun",
    homeOdds: 1.65,
    drawOdds: 3.90,
    awayOdds: 5.20,
    isLive: false,
    sportId: "football",
    country: "france",
    startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "match5",
    homeTeam: "APR FC",
    awayTeam: "Rayon Sports",
    league: "Rwanda Premier League",
    time: "15:00",
    date: "Tomorrow",
    homeOdds: 2.20,
    drawOdds: 3.10,
    awayOdds: 3.50,
    isLive: false,
    sportId: "football",
    country: "rwanda",
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  },
  // Basketball
  {
    id: "bball1",
    homeTeam: "Lakers",
    awayTeam: "Celtics",
    league: "NBA",
    time: "22:00",
    date: "Today",
    homeOdds: 1.85,
    awayOdds: 2.05,
    isLive: true,
    sportId: "basketball",
    country: "usa",
    startTime: new Date().toISOString()
  },
  {
    id: "bball2",
    homeTeam: "Warriors",
    awayTeam: "Nets",
    league: "NBA",
    time: "23:30",
    date: "Tomorrow",
    homeOdds: 1.75,
    awayOdds: 2.15,
    isLive: false,
    sportId: "basketball",
    country: "usa",
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "bball3",
    homeTeam: "Bulls",
    awayTeam: "Heat",
    league: "NBA",
    time: "21:00",
    date: "Sat, 25 Jun",
    homeOdds: 2.25,
    awayOdds: 1.70,
    isLive: false,
    sportId: "basketball",
    country: "usa",
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "bball4",
    homeTeam: "Patriots BBC",
    awayTeam: "REG",
    league: "Rwanda Basketball League",
    time: "18:00",
    date: "Tomorrow",
    homeOdds: 2.40,
    awayOdds: 1.60,
    isLive: false,
    sportId: "basketball",
    country: "rwanda",
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  },
  // Tennis
  {
    id: "tennis1",
    homeTeam: "Djokovic",
    awayTeam: "Nadal",
    league: "Grand Slams",
    time: "15:00",
    date: "Tomorrow",
    homeOdds: 1.90,
    awayOdds: 2.00,
    isLive: false,
    sportId: "tennis",
    country: "international",
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "tennis2",
    homeTeam: "Alcaraz",
    awayTeam: "Medvedev",
    league: "US Open",
    time: "18:30",
    date: "Sat, 25 Jun",
    homeOdds: 1.85,
    awayOdds: 2.05,
    isLive: false,
    sportId: "tennis",
    country: "international",
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Initial Casino Games Mock
const initialCasinoGames: CasinoGame[] = [
  {
    id: "1",
    title: "Neon City Slots",
    imageSrc: "https://images.unsplash.com/photo-1596838132330-5211dbd5c461?q=80&w=2070&auto=format&fit=crop",
    provider: "NetPlay",
    isNew: true,
    isPopular: false,
    category: "slots"
  },
  {
    id: "2",
    title: "Royal Blackjack",
    imageSrc: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?q=80&w=2073&auto=format&fit=crop",
    provider: "Evolution Gaming",
    isNew: false,
    isPopular: true,
    category: "table"
  },
  {
    id: "3",
    title: "Mega Fortune Wheel",
    imageSrc: "https://images.unsplash.com/photo-1629895218613-a532fd7a8313?q=80&w=1932&auto=format&fit=crop",
    provider: "PlayTech",
    isNew: false,
    isPopular: true,
    category: "wheel"
  },
  {
    id: "4",
    title: "Mystic Gems",
    imageSrc: "https://images.unsplash.com/photo-1619967435599-80c18fb1604c?q=80&w=1974&auto=format&fit=crop",
    provider: "NetPlay",
    isNew: true,
    isPopular: false,
    category: "slots"
  },
  {
    id: "5",
    title: "Golden Poker",
    imageSrc: "https://images.unsplash.com/photo-1541278107931-e006523892df?q=80&w=2071&auto=format&fit=crop",
    provider: "Evolution Gaming",
    isNew: false,
    isPopular: false,
    category: "table"
  },
  {
    id: "6",
    title: "Live Dealer Blackjack",
    imageSrc: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=2070&auto=format&fit=crop",
    provider: "Evolution Gaming",
    isNew: false,
    isPopular: true,
    category: "live"
  }
];

// Initial AI Predictions Mock
const initialPredictions: AIprediction[] = [
  {
    id: "pred1",
    match: "Manchester City vs Liverpool",
    prediction: "Manchester City to win",
    confidence: 78,
    analysis: "Based on recent form and head-to-head statistics, Manchester City has a significant advantage in this fixture.",
    trend: "City won 7 of the last 10 meetings",
    odds: "1.85"
  },
  {
    id: "pred2",
    match: "Lakers vs Warriors",
    prediction: "Warriors to win",
    confidence: 65,
    analysis: "Warriors have shown better offensive efficiency and shooting percentage in recent games.",
    trend: "Warriors won last 3 away games",
    odds: "2.10"
  },
  {
    id: "pred3",
    match: "Djokovic vs Nadal",
    prediction: "Djokovic to win in straight sets",
    confidence: 82,
    analysis: "Djokovic has dominated hard court matches against Nadal in their recent encounters.",
    trend: "Djokovic won 5 of last 7 matches",
    odds: "1.75"
  },
  {
    id: "pred4",
    match: "Arsenal vs Tottenham",
    prediction: "Over 2.5 goals",
    confidence: 75,
    analysis: "North London derbies historically produce high-scoring games with both teams finding the net.",
    trend: "Last 6 meetings averaged 3.2 goals",
    odds: "1.90"
  },
  {
    id: "pred5",
    match: "Bayern Munich vs Dortmund",
    prediction: "Both teams to score",
    confidence: 80,
    analysis: "Der Klassiker consistently features goals from both sides regardless of venue or form.",
    trend: "BTTS hit in 8 of last 10 meetings",
    odds: "1.65"
  }
];

// Initial Users Mock
const initialUsers: UserProfile[] = [
  {
    id: "usr-admin",
    name: "Urban Superadmin",
    email: "admin@urbanbet.com",
    balance: 1500000,
    isAdmin: true
  },
  {
    id: "usr-1",
    name: "John Doe",
    email: "john@example.com",
    balance: 25000,
    isAdmin: false
  },
  {
    id: "usr-2",
    name: "Aline Keza",
    email: "keza@example.com",
    balance: 85000,
    isAdmin: false
  }
];

// Initial Transactions Mock
const initialTransactions: TransactionRecord[] = [
  {
    id: "tx-1",
    userId: "usr-1",
    type: "deposit",
    amount: 50000,
    currency: "RWF",
    status: "completed",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    method: "Mobile Money",
    reference: "MM-9831a2"
  },
  {
    id: "tx-2",
    userId: "usr-2",
    type: "withdrawal",
    amount: 25000,
    currency: "RWF",
    status: "pending",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    method: "Bank Transfer",
    reference: "BT-88421c"
  }
];

// Safe Storage helper
const getStored = <T>(key: string, initial: T): T => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return initial;
  }
};

const setStored = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Expose fallback APIs
export const dbFallback = {
  // Events CRUD
  getEvents: (): SportEvent[] => getStored('urbanbet_events', initialEvents),
  saveEvent: (event: Partial<SportEvent> & { id?: string }): SportEvent => {
    const events = dbFallback.getEvents();
    if (event.id) {
      // Update
      const index = events.findIndex(e => e.id === event.id);
      const updated = { ...events[index], ...event } as SportEvent;
      events[index] = updated;
      setStored('urbanbet_events', events);
      return updated;
    } else {
      // Create
      const newEvent = {
        ...event,
        id: "match-" + Math.random().toString(36).substring(2, 9),
        time: event.startTime ? new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "20:00",
        date: event.startTime ? new Date(event.startTime).toLocaleDateString([], { day: '2-digit', month: 'short' }) : "Today",
        homeOdds: event.homeOdds || 1.85,
        drawOdds: event.drawOdds || 3.25,
        awayOdds: event.awayOdds || 2.50,
      } as SportEvent;
      events.push(newEvent);
      setStored('urbanbet_events', events);
      return newEvent;
    }
  },
  deleteEvent: (id: string): void => {
    const events = dbFallback.getEvents();
    const filtered = events.filter(e => e.id !== id);
    setStored('urbanbet_events', filtered);
  },

  // Casino Games CRUD
  getCasinoGames: (): CasinoGame[] => getStored('urbanbet_casino_games', initialCasinoGames),
  saveCasinoGame: (game: Partial<CasinoGame> & { id?: string }): CasinoGame => {
    const games = dbFallback.getCasinoGames();
    if (game.id) {
      const index = games.findIndex(g => g.id === game.id);
      const updated = { ...games[index], ...game } as CasinoGame;
      games[index] = updated;
      setStored('urbanbet_casino_games', games);
      return updated;
    } else {
      const newGame = {
        ...game,
        id: "game-" + Math.random().toString(36).substring(2, 9),
        isNew: game.isNew || false,
        isPopular: game.isPopular || false
      } as CasinoGame;
      games.push(newGame);
      setStored('urbanbet_casino_games', games);
      return newGame;
    }
  },
  deleteCasinoGame: (id: string): void => {
    const games = dbFallback.getCasinoGames();
    const filtered = games.filter(g => g.id !== id);
    setStored('urbanbet_casino_games', filtered);
  },

  // AI Predictions CRUD
  getAIPredictions: (): AIprediction[] => getStored('urbanbet_ai_predictions', initialPredictions),
  saveAIPrediction: (pred: Partial<AIprediction> & { id?: string }): AIprediction => {
    const preds = dbFallback.getAIPredictions();
    if (pred.id) {
      const index = preds.findIndex(p => p.id === pred.id);
      const updated = { ...preds[index], ...pred } as AIprediction;
      preds[index] = updated;
      setStored('urbanbet_ai_predictions', preds);
      return updated;
    } else {
      const newPred = {
        ...pred,
        id: "pred-" + Math.random().toString(36).substring(2, 9)
      } as AIprediction;
      preds.push(newPred);
      setStored('urbanbet_ai_predictions', preds);
      return newPred;
    }
  },
  deleteAIPrediction: (id: string): void => {
    const preds = dbFallback.getAIPredictions();
    const filtered = preds.filter(p => p.id !== id);
    setStored('urbanbet_ai_predictions', filtered);
  },

  // Users CRUD
  getUsers: (): UserProfile[] => getStored('urbanbet_users', initialUsers),
  saveUser: (user: Partial<UserProfile> & { id?: string }): UserProfile => {
    const users = dbFallback.getUsers();
    if (user.id) {
      const index = users.findIndex(u => u.id === user.id);
      const updated = { ...users[index], ...user } as UserProfile;
      users[index] = updated;
      setStored('urbanbet_users', users);
      return updated;
    } else {
      const newUser = {
        ...user,
        id: "usr-" + Math.random().toString(36).substring(2, 9),
        balance: user.balance || 0,
        isAdmin: user.isAdmin || false
      } as UserProfile;
      users.push(newUser);
      setStored('urbanbet_users', users);
      return newUser;
    }
  },
  makeUserAdmin: (id: string): void => {
    const users = dbFallback.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index].isAdmin = true;
      setStored('urbanbet_users', users);
    }
  },

  // Transactions CRUD
  getTransactions: (): TransactionRecord[] => getStored('urbanbet_transactions', initialTransactions),
  saveTransaction: (tx: Partial<TransactionRecord>): TransactionRecord => {
    const txs = dbFallback.getTransactions();
    const newTx = {
      ...tx,
      id: "tx-" + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      status: tx.status || 'pending'
    } as TransactionRecord;
    txs.push(newTx);
    setStored('urbanbet_transactions', txs);
    
    // Also adjust user balance if transaction is completed
    if (tx.status === 'completed' && tx.userId && tx.amount) {
      const users = dbFallback.getUsers();
      const userIdx = users.findIndex(u => u.id === tx.userId);
      if (userIdx !== -1) {
        if (tx.type === 'deposit' || tx.type === 'bet_win') {
          users[userIdx].balance += tx.amount;
        } else {
          users[userIdx].balance = Math.max(0, users[userIdx].balance - tx.amount);
        }
        setStored('urbanbet_users', users);
      }
    }
    return newTx;
  },
  approveTransaction: (id: string): void => {
    const txs = dbFallback.getTransactions();
    const index = txs.findIndex(t => t.id === id);
    if (index !== -1 && txs[index].status === 'pending') {
      txs[index].status = 'completed';
      setStored('urbanbet_transactions', txs);

      // Adjust user balance
      const users = dbFallback.getUsers();
      const userIdx = users.findIndex(u => u.id === txs[index].userId);
      if (userIdx !== -1) {
        const amount = txs[index].amount;
        if (txs[index].type === 'deposit') {
          users[userIdx].balance += amount;
        } else if (txs[index].type === 'withdrawal') {
          users[userIdx].balance = Math.max(0, users[userIdx].balance - amount);
        }
        setStored('urbanbet_users', users);
      }
    }
  },
  rejectTransaction: (id: string): void => {
    const txs = dbFallback.getTransactions();
    const index = txs.findIndex(t => t.id === id);
    if (index !== -1 && txs[index].status === 'pending') {
      txs[index].status = 'failed';
      setStored('urbanbet_transactions', txs);
    }
  }
};
