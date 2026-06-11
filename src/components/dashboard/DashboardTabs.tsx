
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActiveBets from "./ActiveBets";
import BetHistory from "./BetHistory";
import AIPredictionsTab from "./AIPredictionsTab";
import { BetRecord } from "@/services/database/types";

interface DashboardTabsProps {
  betHistory: BetRecord[];
  loadingBets: boolean;
  aiPredictions: any[];
  loadingPredictions: boolean;
}

const DashboardTabs = ({ 
  betHistory, 
  loadingBets,
  aiPredictions,
  loadingPredictions
}: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="bets">
      <TabsList className="grid grid-cols-3 w-full mb-6">
        <TabsTrigger value="bets">My Bets</TabsTrigger>
        <TabsTrigger value="history">Betting History</TabsTrigger>
        <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
      </TabsList>
      <TabsContent value="bets">
        <ActiveBets betHistory={betHistory} loading={loadingBets} />
      </TabsContent>
      <TabsContent value="history">
        <BetHistory betHistory={betHistory} loading={loadingBets} />
      </TabsContent>
      <TabsContent value="predictions">
        <AIPredictionsTab aiPredictions={aiPredictions} loading={loadingPredictions} />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
