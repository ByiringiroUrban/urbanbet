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
      {/* Full viewport height, no page-level scroll */}
      <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
        {/* Fixed top navbar */}
        <Navbar />

        {/* Remaining height row: left sidebar | scrollable content | right betslip */}
        <div className="flex flex-1 overflow-hidden w-full max-w-[1600px] mx-auto">

          {/* ───── LEFT SIDEBAR — always visible & sticky ───── */}
          <aside className="hidden lg:flex lg:flex-col w-60 xl:w-64 shrink-0 overflow-y-auto no-scrollbar border-r border-border bg-sidebar">
            <LeftSidebar embedded />
          </aside>

          {/* ───── MAIN CONTENT — only this column scrolls ───── */}
          <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
            <Footer />
          </main>

          {/* ───── RIGHT BETSLIP — always visible & sticky ───── */}
          {!hideBettingSlip && (
            <div className="hidden xl:flex xl:flex-col w-72 2xl:w-80 shrink-0 overflow-y-auto no-scrollbar border-l border-border bg-card/10">
              <BettingSlip isSidebar={true} />
            </div>
          )}
        </div>

        {/* Floating / Mobile Betting Slip Drawer */}
        {!hideBettingSlip && <BettingSlip />}
      </div>
    </BettingProvider>
  );
};

export default Layout;
