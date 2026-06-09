import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, Zap, Trophy, ArrowRight } from "lucide-react";
import { isAuthenticated } from "@/utils/authUtils";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      subtitle: "CHAMPIONS LEAGUE",
      title: "BIG MATCH TONIGHT",
      cta: "Bet Live Now",
      link: "/live",
      image: "https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?q=80&w=1600&auto=format&fit=crop",
      icon: <Zap size={16} className="mr-1.5 text-bet-primary" />
    },
    {
      subtitle: "PREDICTIONS",
      title: "AI-POWERED INSIGHTS",
      cta: "Explore AI Tips",
      link: "/ai-predictions",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1600&auto=format&fit=crop",
      icon: <Brain size={16} className="mr-1.5 text-bet-primary" />
    },
    {
      subtitle: "CASINO GAMES",
      title: "WIN BIG IN AVIATOR",
      cta: "Play Aviator",
      link: "/casino",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1600&auto=format&fit=crop",
      icon: <Trophy size={16} className="mr-1.5 text-bet-primary" />
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative h-60 md:h-64 w-full overflow-hidden rounded-xl border border-border bg-card">
      {/* Background Images with Fade Transition */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: currentSlide === index ? 1 : 0,
            backgroundColor: "rgba(5, 7, 15, 0.82)",
            backgroundImage: `url(${slide.image})`,
            backgroundBlendMode: "overlay",
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            zIndex: currentSlide === index ? 1 : 0
          }}
        />
      ))}
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-start justify-center px-6 md:px-10 text-left">
        <div className="max-w-xl">
          <span className="text-[10px] font-extrabold tracking-widest text-bet-primary uppercase bg-bet-primary/10 px-2 py-0.5 rounded">
            {slides[currentSlide].subtitle}
          </span>
          <h1 className="text-2xl md:text-3.5xl font-black mb-3 mt-2 text-white uppercase tracking-tight">
            {slides[currentSlide].title}
          </h1>
          <div className="flex gap-3 mt-4">
            <Button 
              size="sm" 
              className="bg-bet-primary text-bet-primary-foreground font-black tracking-wide hover:bg-bet-primary/90 rounded text-[11px] h-8 px-4"
              asChild
            >
              <Link to={slides[currentSlide].link} className="flex items-center">
                {slides[currentSlide].icon}
                {slides[currentSlide].cta}
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-6 md:left-10 flex space-x-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                currentSlide === index
                  ? "bg-bet-primary w-4"
                  : "bg-white/20 hover:bg-white/40 w-1.5"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
