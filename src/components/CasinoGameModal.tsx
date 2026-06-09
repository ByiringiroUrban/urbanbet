import { Play, X, Maximize2, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import AviatorGame from "./games/AviatorGame";

interface CasinoGameModalProps {
  open: boolean;
  onClose: () => void;
  game: {
    title: string;
    provider: string;
    imageSrc: string;
    category?: string;
  };
}

export default function CasinoGameModal({ open, onClose, game }: CasinoGameModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        toast({
          title: "Fullscreen Error",
          description: "Could not enter fullscreen mode",
          variant: "destructive",
        });
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handlePlayGame = () => {
    setIsLoading(false);
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login to play with real money",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] max-h-[90vh] p-0">
        <DialogHeader className="p-4 flex flex-row items-center justify-between bg-black/90 text-white">
          <DialogTitle>{game.title} - {game.provider}</DialogTitle>
          <div className="flex items-center gap-2">
            <Button 
              size="icon" 
              variant="ghost"
              onClick={() => setIsMuted(!isMuted)}
              className="text-white hover:bg-white/10"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </Button>
            <Button 
              size="icon" 
              variant="ghost"
              onClick={handleFullscreen}
              className="text-white hover:bg-white/10"
            >
              <Maximize2 size={18} />
            </Button>
            <DialogClose asChild>
              <Button 
                size="icon" 
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                <X size={18} />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
        
        <div className="relative w-full aspect-video bg-black">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
              <img 
                src={game.imageSrc} 
                alt={game.title}
                className="w-full h-full object-contain opacity-30"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <img 
                  src={game.imageSrc} 
                  alt={game.title}
                  className="w-1/3 h-auto object-contain mb-6 rounded-lg shadow-lg"
                />
                <h3 className="text-2xl font-bold text-white mb-6">{game.title}</h3>
                <p className="text-white/70 mb-8">Provided by {game.provider}</p>
                <Button 
                  onClick={handlePlayGame}
                  className="bg-bet-primary hover:bg-bet-primary/90 text-white px-8 py-6 text-lg"
                >
                  <Play size={24} className="mr-2" /> Play Now
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {(game.category === 'aviator' || game.title.toLowerCase().includes('aviator')) ? (
                <AviatorGame onClose={onClose} />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-bet-primary text-white">
                  <div className="text-center p-8 max-w-md">
                    <h3 className="text-2xl font-bold mb-4">Playing {game.title}</h3>
                    <p className="mb-4">In a production environment, this would load the actual game from {game.provider}.</p>
                    <p>The game would be embedded in an iframe with secure communication between the casino platform and the game provider's servers.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
