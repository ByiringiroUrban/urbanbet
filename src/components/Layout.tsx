import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LeftSidebar from "./LeftSidebar";
import BettingSlip from "./BettingSlip";
import { BettingProvider } from "@/contexts/BettingContext";

interface LayoutProps {
  children: React.ReactNode;
  hideBettingSlip?: boolean;
}

const Layout = ({ children, hideBettingSlip = false }: LayoutProps) => {
  return (
    <BettingProvider>
      <div className="min-h-screen flex flex-col bg-bet-dark text-foreground">
        <Navbar />
        
        {/* Main Dashboard Layout wrapper */}
        <div className="flex-grow w-full max-w-7xl mx-auto flex flex-col lg:flex-row">
          {/* Left Column Sidebar */}
          <LeftSidebar />

          {/* Middle Column Main Content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0">
            {children}
          </main>

          {/* Right Column Betslip (Desktop Sidebar view) */}
          {!hideBettingSlip && (
            <div className="hidden xl:block w-80 shrink-0 sticky top-16 h-[calc(100vh-4rem)] bg-card/10 border-l border-border">
              <BettingSlip isSidebar={true} />
            </div>
          )}
        </div>

        {/* Floating/Mobile Betting Slip Drawer */}
        {!hideBettingSlip && <BettingSlip />}
        
        <Footer />
      </div>
    </BettingProvider>
  );
};

export default Layout;
