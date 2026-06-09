import { Link } from "react-router-dom";
import { 
  Zap, ShieldCheck, CreditCard, Heart, Twitter, Facebook, Instagram, Youtube, 
  Trophy, TrendingUp, Smartphone, Mail, MapPin, Phone
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-300 pt-16 pb-8 mt-12 border-t border-bet-primary/20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-bet-primary to-bet-accent" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-bet-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-bet-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand & About */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img src="/logo.png" alt="UrbanBet Logo" className="h-14 w-auto object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
            </Link>
            <p className="text-gray-400 leading-relaxed mb-8 pr-4">
              Urban Bet is the world's most advanced betting platform. We combine bleeding-edge AI analytics with premium sports markets and immersive casino experiences to deliver unmatched entertainment.
            </p>
            <div className="flex items-center space-x-5">
              <a href="#" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white transition-all transform hover:-translate-y-1">
                <Twitter size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1">
                <Facebook size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all transform hover:-translate-y-1">
                <Instagram size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-1">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Sports Betting */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-bet-primary" />
              Sports
            </h3>
            <ul className="space-y-3">
              <li><Link to="/sports/football" className="hover:text-bet-primary hover:translate-x-1 inline-block transition-all">Premier League</Link></li>
              <li><Link to="/sports/basketball" className="hover:text-bet-primary hover:translate-x-1 inline-block transition-all">NBA Markets</Link></li>
              <li><Link to="/sports/tennis" className="hover:text-bet-primary hover:translate-x-1 inline-block transition-all">Grand Slam Tennis</Link></li>
              <li><Link to="/sports/esports" className="hover:text-bet-primary hover:translate-x-1 inline-block transition-all">Esports Tournaments</Link></li>
              <li><Link to="/sports/all" className="hover:text-bet-primary hover:translate-x-1 inline-block transition-all text-bet-primary font-medium mt-2">View All Sports &rarr;</Link></li>
            </ul>
          </div>

          {/* Casino */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-purple-500" />
              Casino
            </h3>
            <ul className="space-y-3">
              <li><Link to="/casino/slots" className="hover:text-purple-400 hover:translate-x-1 inline-block transition-all">Premium Slots</Link></li>
              <li><Link to="/casino/live" className="hover:text-purple-400 hover:translate-x-1 inline-block transition-all">Live Dealers <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400">HOT</span></Link></li>
              <li><Link to="/casino/table" className="hover:text-purple-400 hover:translate-x-1 inline-block transition-all">Table Games</Link></li>
              <li><Link to="/casino/jackpots" className="hover:text-purple-400 hover:translate-x-1 inline-block transition-all">Mega Jackpots</Link></li>
              <li><Link to="/casino/tournaments" className="hover:text-purple-400 hover:translate-x-1 inline-block transition-all text-purple-400 font-medium mt-2">Active Tournaments &rarr;</Link></li>
            </ul>
          </div>

          {/* Contact / Help */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                <span className="text-sm">24/7 Support Line<br /><a href="tel:18001234567" className="text-white hover:text-bet-primary font-medium">1-800-URBAN-BET</a></span>
              </li>
              <li className="flex items-start">
                <Mail className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                <span className="text-sm">Email Us<br /><a href="mailto:support@urbanbet.com" className="text-white hover:text-bet-primary font-medium">support@urbanbet.com</a></span>
              </li>
              <li className="flex items-start mt-4 pt-4 border-t border-gray-800">
                <Smartphone className="w-5 h-5 text-bet-primary mr-3" />
                <span className="text-sm font-medium text-white hover:text-bet-primary cursor-pointer transition-colors">Download our App</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Payment Methods and Certifications */}
        <div className="py-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <div className="px-3 py-2 bg-white/5 hover:bg-white/10 transition-colors rounded-lg border border-white/10 flex items-center justify-center h-12 w-20">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="VISA" className="h-5 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
            </div>
            <div className="px-3 py-2 bg-white/5 hover:bg-white/10 transition-colors rounded-lg border border-white/10 flex items-center justify-center h-12 w-20">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="MasterCard" className="h-7 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
            </div>
            <div className="px-3 py-2 bg-white/5 hover:bg-white/10 transition-colors rounded-lg border border-white/10 flex items-center justify-center h-12 w-20">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
            </div>
            <div className="px-3 py-2 bg-white/5 hover:bg-white/10 transition-colors rounded-lg border border-white/10 flex items-center justify-center h-12 w-20">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg" alt="Crypto" className="h-6 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/responsible-gambling" className="flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors">
              <Heart size={16} className="mr-2 text-red-500" />
              Responsible Gambling
            </Link>
            <div className="h-6 w-px bg-gray-700 hidden sm:block"></div>
            <div className="flex items-center text-sm text-gray-400 font-bold border-2 border-gray-700 rounded-full w-10 h-10 justify-center">
              18+
            </div>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 text-center lg:text-left max-w-3xl">
            Urban Bet is operated by Urban Entertainment Ltd. Gambling can be addictive. Please play responsibly. 
            If you feel you have a problem with gambling please contact GamCare or similar professional organizations. 
            By accessing, continuing to use or navigating throughout this site you accept that we will use certain browser cookies to improve your customer experience with us.
          </p>
          <div className="flex space-x-6 text-sm text-gray-500">
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            <span>&copy; {new Date().getFullYear()} Urban Bet</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
