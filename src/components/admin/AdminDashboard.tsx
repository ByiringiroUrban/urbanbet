
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, CircleDollarSign, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBets: 0,
    activeEvents: 0,
    revenue: 0,
    weeklyChange: 5.25, // Mock data
    monthlyChange: -2.5  // Mock data
  });
  
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("week");
  const { toast } = useToast();
  
  // Mock data for charts
  const dailyData = [
    { name: "Mon", bets: 45, revenue: 125000 },
    { name: "Tue", bets: 52, revenue: 145000 },
    { name: "Wed", bets: 49, revenue: 132000 },
    { name: "Thu", bets: 63, revenue: 165000 },
    { name: "Fri", bets: 78, revenue: 200000 },
    { name: "Sat", bets: 95, revenue: 250000 },
    { name: "Sun", bets: 82, revenue: 215000 },
  ];
  
  const weeklyData = [
    { name: "Week 1", bets: 325, revenue: 950000 },
    { name: "Week 2", bets: 342, revenue: 980000 },
    { name: "Week 3", bets: 356, revenue: 1050000 },
    { name: "Week 4", bets: 375, revenue: 1150000 },
  ];
  
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const { apiFetch, toArray } = await import("@/lib/api");
      
      // 1. Fetch users list from admin users endpoint
      const usersData = await apiFetch('/auth/admin/users/');
      const totalUsers = usersData?.count ?? toArray(usersData).length;
      
      // 2. Fetch bet statistics from admin stats endpoint
      const betStatsData = await apiFetch('/bets/admin/stats/');
      const totalBets = betStatsData?.summary?.total_bets || 0;
      const totalWagered = Number(betStatsData?.summary?.total_wagered || 0);
      
      // 3. Fetch active events count
      const eventsData = await apiFetch('/sports/events/');
      const activeEvents = eventsData?.count ?? toArray(eventsData).length;
      
      setStats({
        totalUsers,
        totalBets,
        activeEvents,
        revenue: totalWagered,
        weeklyChange: 5.25, // Mock change metric
        monthlyChange: -2.5  // Mock change metric
      });
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data from database.",
        variant: "destructive",
      });
      
      // Set fallbacks if server has issues
      setStats({
        totalUsers: 0,
        totalBets: 0,
        activeEvents: 0,
        revenue: 0,
        weeklyChange: 0,
        monthlyChange: 0
      });
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h2>
          <p className="text-muted-foreground mt-1">Welcome back, here is what's happening today.</p>
        </div>
      </div>
      
      {loading ? (
        <div className="flex flex-col justify-center items-center py-20 space-y-4">
          <div className="w-10 h-10 border-4 border-bet-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground animate-pulse">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-bet-dark-accent/80 to-bet-dark/90 border-white/5 shadow-lg hover:-translate-y-1 hover:shadow-bet-primary/10 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="h-4 w-4 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {stats.weeklyChange > 0 ? (
                    <span className="text-emerald-500 flex items-center font-medium">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      {stats.weeklyChange}% from last week
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center font-medium">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      {Math.abs(stats.weeklyChange)}% from last week
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-bet-dark-accent/80 to-bet-dark/90 border-white/5 shadow-lg hover:-translate-y-1 hover:shadow-bet-primary/10 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Bets</CardTitle>
                <div className="p-2 bg-bet-primary/10 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-bet-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.totalBets.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {stats.weeklyChange > 0 ? (
                    <span className="text-emerald-500 flex items-center font-medium">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      {stats.weeklyChange}% from last week
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center font-medium">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      {Math.abs(stats.weeklyChange)}% from last week
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-bet-dark-accent/80 to-bet-dark/90 border-white/5 shadow-lg hover:-translate-y-1 hover:shadow-bet-primary/10 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Active Events</CardTitle>
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Calendar className="h-4 w-4 text-orange-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.activeEvents.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-2 font-medium">Events currently active</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-bet-dark-accent/80 to-bet-dark/90 border-white/5 shadow-lg hover:-translate-y-1 hover:shadow-bet-primary/10 transition-all duration-300 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-bet-primary/10 rounded-full blur-2xl"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <CircleDollarSign className="h-4 w-4 text-emerald-400" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-white">{stats.revenue.toLocaleString()} <span className="text-lg text-bet-primary">RWF</span></div>
                <p className="text-xs text-muted-foreground mt-2">
                  {stats.monthlyChange > 0 ? (
                    <span className="text-emerald-500 flex items-center font-medium">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      {stats.monthlyChange}% from last month
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center font-medium">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      {Math.abs(stats.monthlyChange)}% from last month
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <Card className="bg-gradient-to-b from-bet-dark-accent/50 to-bet-dark/80 border-white/5 shadow-xl mt-8">
            <CardHeader className="pb-0">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="text-xl">Performance Metrics</CardTitle>
                  <CardDescription>Overview of revenue and betting activity</CardDescription>
                </div>
                <Tabs defaultValue="revenue" className="w-full md:w-auto">
                  <TabsList className="grid grid-cols-2 w-full md:w-[240px] bg-black/40 border border-white/5">
                    <TabsTrigger value="revenue" className="data-[state=active]:bg-bet-primary data-[state=active]:text-black">Revenue</TabsTrigger>
                    <TabsTrigger value="bets" className="data-[state=active]:bg-bet-primary data-[state=active]:text-black">Bets</TabsTrigger>
                  </TabsList>
                  
                  <div className="mt-6 h-[400px]">
                    <TabsContent value="revenue" className="h-full mt-0">
                      <div className="flex justify-end mb-4">
                        <div className="bg-black/30 rounded-lg p-1 border border-white/5 inline-flex">
                          <button 
                            onClick={() => setTimeRange("week")}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${timeRange === "week" ? "bg-white/10 text-white shadow-sm" : "text-muted-foreground hover:text-white"}`}
                          >
                            Daily
                          </button>
                          <button 
                            onClick={() => setTimeRange("month")}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${timeRange === "month" ? "bg-white/10 text-white shadow-sm" : "text-muted-foreground hover:text-white"}`}
                          >
                            Weekly
                          </button>
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height="90%">
                        <LineChart
                          data={timeRange === "week" ? dailyData : weeklyData}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#a3e635" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#a3e635" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis 
                            stroke="#888888" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                            tickFormatter={(value) => `${value / 1000}k`}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#20222a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: number) => [`${value.toLocaleString()} RWF`, "Revenue"]}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="revenue" 
                            name="Revenue" 
                            stroke="#a3e635" 
                            strokeWidth={3}
                            dot={{ r: 4, fill: "#20222a", strokeWidth: 2, stroke: "#a3e635" }}
                            activeDot={{ r: 6, fill: "#a3e635", stroke: "#fff", strokeWidth: 2 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </TabsContent>
                    
                    <TabsContent value="bets" className="h-full mt-0">
                      <div className="flex justify-end mb-4">
                        <div className="bg-black/30 rounded-lg p-1 border border-white/5 inline-flex">
                          <button 
                            onClick={() => setTimeRange("week")}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${timeRange === "week" ? "bg-white/10 text-white shadow-sm" : "text-muted-foreground hover:text-white"}`}
                          >
                            Daily
                          </button>
                          <button 
                            onClick={() => setTimeRange("month")}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${timeRange === "month" ? "bg-white/10 text-white shadow-sm" : "text-muted-foreground hover:text-white"}`}
                          >
                            Weekly
                          </button>
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height="90%">
                        <BarChart
                          data={timeRange === "week" ? dailyData : weeklyData}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#20222a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                          />
                          <Bar 
                            dataKey="bets" 
                            name="Number of Bets" 
                            fill="#10B981" 
                            radius={[4, 4, 0, 0]} 
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </CardHeader>
          </Card>
        </>
      )}
    </div>
  );
}
