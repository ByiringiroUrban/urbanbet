
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BettingProviderRoot } from "@/contexts/BettingContext";
import GlobalBettingSlip from "@/components/GlobalBettingSlip";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AIPredictions from "./pages/AIPredictions";
import Casino from "./pages/Casino";
import Sports from "./pages/Sports";
import LiveBetting from "./pages/LiveBetting";
import NotFound from "./pages/NotFound";
import Account from "./pages/Account";
import Wallet from "./pages/Wallet";
import Admin from "./pages/Admin";
import ResponsibleGambling from "./pages/ResponsibleGambling";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import { ProtectedAdminRoute, ProtectedUserRoute } from "./components/ProtectedRoutes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BettingProviderRoot>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <GlobalBettingSlip />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedUserRoute><Dashboard /></ProtectedUserRoute>} />
            <Route path="/ai-predictions" element={<AIPredictions />} />
            <Route path="/casino" element={<Casino />} />
            <Route path="/casino/slots" element={<Casino />} />
            <Route path="/casino/table-games" element={<Casino />} />
            <Route path="/casino/live-casino" element={<Casino />} />
            <Route path="/casino/jackpots" element={<Casino />} />
            <Route path="/casino/game-shows" element={<Casino />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/sports/:sport" element={<Sports />} />
            <Route path="/sports/:sport/:country" element={<Sports />} />
            <Route path="/sports/:sport/:country/:league" element={<Sports />} />
            <Route path="/live" element={<LiveBetting />} />
            <Route path="/account" element={<ProtectedUserRoute><Account /></ProtectedUserRoute>} />
            <Route path="/wallet" element={<ProtectedUserRoute><Wallet /></ProtectedUserRoute>} />
            <Route path="/admin" element={<ProtectedAdminRoute><Admin /></ProtectedAdminRoute>} />
            <Route path="/responsible-gambling" element={<ResponsibleGambling />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </BettingProviderRoot>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
