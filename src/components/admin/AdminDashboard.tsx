
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
      const { apiFetch } = await import("@/lib/api");
      
      // 1. Fetch users list from admin users endpoint
      const usersData = await apiFetch('/auth/admin/users/');
      const totalUsers = Array.isArray(usersData) ? usersData.length : 0;
      
      // 2. Fetch bet statistics from admin stats endpoint
      const betStatsData = await apiFetch('/bets/admin/stats/');
      const totalBets = betStatsData?.summary?.total_bets || 0;
      const totalWagered = Number(betStatsData?.summary?.total_wagered || 0);
      
      // 3. Fetch active events count
      const eventsData = await apiFetch('/sports/events/');
      const activeEvents = Array.isArray(eventsData) ? eventsData.length : 0;
      
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
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-bet-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.weeklyChange > 0 ? (
                    <span className="text-green-500 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      {stats.weeklyChange}% from last week
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      {Math.abs(stats.weeklyChange)}% from last week
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Bets</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBets.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.weeklyChange > 0 ? (
                    <span className="text-green-500 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      {stats.weeklyChange}% from last week
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      {Math.abs(stats.weeklyChange)}% from last week
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeEvents.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Events in next 24 hours</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.revenue.toLocaleString()} RWF</div>
                <p className="text-xs text-muted-foreground">
                  {stats.monthlyChange > 0 ? (
                    <span className="text-green-500 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      {stats.monthlyChange}% from last month
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      {Math.abs(stats.monthlyChange)}% from last month
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <Tabs defaultValue="revenue" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="bets">Bets</TabsTrigger>
            </TabsList>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex justify-end mb-2">
                <TabsList>
                  <TabsTrigger 
                    value="daily" 
                    onClick={() => setTimeRange("week")}
                    className={timeRange === "week" ? "bg-bet-primary text-white" : ""}
                  >
                    Daily
                  </TabsTrigger>
                  <TabsTrigger 
                    value="weekly" 
                    onClick={() => setTimeRange("month")}
                    className={timeRange === "month" ? "bg-bet-primary text-white" : ""}
                  >
                    Weekly
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="revenue" className="h-[350px] mt-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={timeRange === "week" ? dailyData : weeklyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toLocaleString()} RWF`, "Revenue"]}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" name="Revenue (RWF)" stroke="#7c3aed" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="bets" className="h-[350px] mt-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={timeRange === "week" ? dailyData : weeklyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="bets" name="Number of Bets" fill="#7c3aed" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </div>
          </Tabs>
        </>
      )}
    </div>
  );
}
