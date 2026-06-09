
import { useState } from "react";
import { Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CasinoGameModal from "./CasinoGameModal";
import { useToast } from "@/hooks/use-toast";

interface CasinoGameCardProps {
  title: string;
  imageSrc: string;
  provider: string;
  isNew?: boolean;
  isPopular?: boolean;
  category?: string; // Make category optional
}

export default function CasinoGameCard({
  title,
  imageSrc,
  provider,
  isNew = false,
  isPopular = false,
  category = 'other' // Provide a default category
}: CasinoGameCardProps) {
  const [isGameOpen, setIsGameOpen] = useState(false);
  const { toast } = useToast();

  const handlePlayGame = () => {
    setIsGameOpen(true);
    toast({
      title: "Starting Game",
      description: `Loading ${title} from ${provider}...`,
    });
  };

  return (
    <>
      <div className="group relative rounded-lg overflow-hidden hover-scale transition-all duration-300">
        {/* Game Image */}
        <div className="aspect-[4/3] w-full overflow-hidden rounded-lg">
          <img 
            src={imageSrc} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-bet-primary opacity-80 transition-opacity group-hover:opacity-100" />
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && (
            <Badge className="bg-bet-primary text-white">
              NEW
            </Badge>
          )}
          {isPopular && (
            <Badge className="bg-bet-accent text-white flex items-center">
              <Star size={12} className="mr-1" fill="currentColor" /> Popular
            </Badge>
          )}
        </div>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-semibold truncate">{title}</h3>
          <p className="text-white/70 text-xs">{provider}</p>
        </div>
        
        {/* Play Button (visible on hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            className="bg-bet-primary hover:bg-bet-primary/90"
            onClick={handlePlayGame}
          >
            <Play size={18} className="mr-1" /> Play Now
          </Button>
        </div>
      </div>

      {/* Game Modal */}
      <CasinoGameModal 
        open={isGameOpen} 
        onClose={() => setIsGameOpen(false)} 
        game={{
          title,
          provider,
          imageSrc,
          category // Include category here
        }}
      />
    </>
  );
}
