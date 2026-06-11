import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import { Pencil, Trash, Plus, Save } from "lucide-react";

const categories = [
  { id: "slots", name: "Slots" },
  { id: "table", name: "Table Games" },
  { id: "live", name: "Live Casino" },
  { id: "wheel", name: "Game Shows" },
  { id: "jackpot", name: "Jackpots" }
];

const providers = [
  { id: "netplay", name: "NetPlay" },
  { id: "evolution", name: "Evolution Gaming" },
  { id: "playtech", name: "PlayTech" },
  { id: "microgaming", name: "Microgaming" },
  { id: "pragmatic", name: "Pragmatic Play" },
];

export default function AdminCasinoGames() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<string | null>(null);
  const { toast } = useToast();
  
  // New game form state
  const [formData, setFormData] = useState({
    title: "",
    provider: "NetPlay",
    imageSrc: "https://images.unsplash.com/photo-1596838132330-5211dbd5c461?q=80&w=2070&auto=format&fit=crop",
    category: "slots",
    isNew: false,
    isPopular: false
  });
  
  // Edit game form state
  const [editData, setEditData] = useState<any>({});
  
  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/casino/games/');
      const formatted = (data || []).map((game: any) => ({
        id: String(game.id),
        title: game.title,
        provider: game.provider,
        category: game.category,
        imageSrc: game.image_src || 'https://images.unsplash.com/photo-1596838132330-5211dbd5c461?q=80&w=2070&auto=format&fit=crop',
        isNew: game.is_new,
        isPopular: game.is_popular
      }));
      setGames(formatted);
    } catch (error) {
      console.error('Error loading casino games:', error);
      toast({
        title: "Error",
        description: "Failed to load casino games.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEditSelectChange = (name: string, value: string) => {
    setEditData({
      ...editData,
      [name]: value
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleEditSwitchChange = (name: string, checked: boolean) => {
    setEditData({
      ...editData,
      [name]: checked
    });
  };

  const handleCreateGame = async () => {
    try {
      if (!formData.title || !formData.provider || !formData.imageSrc || !formData.category) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      
      await apiFetch('/casino/admin/games/', {
        method: 'POST',
        body: JSON.stringify({
          title: formData.title,
          provider: formData.provider,
          category: formData.category,
          image_url: formData.imageSrc,
          is_new: formData.isNew,
          is_popular: formData.isPopular,
          is_active: true
        })
      });
      
      toast({
        title: "Success",
        description: "Casino game created successfully.",
      });
      
      // Reset form
      setFormData({
        title: "",
        provider: "NetPlay",
        imageSrc: "https://images.unsplash.com/photo-1596838132330-5211dbd5c461?q=80&w=2070&auto=format&fit=crop",
        category: "slots",
        isNew: false,
        isPopular: false
      });
      
      loadGames();
    } catch (error) {
      console.error('Error creating casino game:', error);
      toast({
        title: "Error",
        description: "Failed to create casino game.",
        variant: "destructive",
      });
    }
  };

  const handleEditGame = (game: any) => {
    setEditMode(game.id);
    setEditData(game);
  };

  const handleSaveEdit = async () => {
    if (!editMode || !editData.id) return;
    
    try {
      await apiFetch(`/casino/admin/games/${editData.id}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: editData.title,
          provider: editData.provider,
          category: editData.category,
          image_url: editData.imageSrc,
          is_new: editData.isNew,
          is_popular: editData.isPopular
        })
      });
      
      toast({
        title: "Success",
        description: "Casino game updated successfully.",
      });
      
      setEditMode(null);
      setEditData({});
      loadGames();
    } catch (error) {
      console.error('Error updating casino game:', error);
      toast({
        title: "Error",
        description: "Failed to update casino game.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGame = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this casino game?')) return;
    
    try {
      await apiFetch(`/casino/admin/games/${id}/`, {
        method: 'DELETE'
      });
      
      toast({
        title: "Success",
        description: "Casino game deleted successfully.",
      });
      
      loadGames();
    } catch (error) {
      console.error('Error deleting casino game:', error);
      toast({
        title: "Error",
        description: "Failed to delete casino game.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-black uppercase text-white tracking-tight mb-6">Manage Casino Games</h2>
      
      {/* Create Game Form */}
      <div className="bg-[#070a13] border border-slate-800 rounded-xl p-6 mb-8">
        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Create New Casino Game</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="title">Game Title*</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Game Title" className="bg-[#0a0e1b] border-slate-800" />
          </div>
          
          <div>
            <Label htmlFor="provider">Provider*</Label>
            <Select value={formData.provider} onValueChange={(value) => handleSelectChange('provider', value)}>
              <SelectTrigger className="bg-[#0a0e1b] border-slate-800">
                <SelectValue placeholder="Select Provider" />
              </SelectTrigger>
              <SelectContent>
                {providers.map(provider => (
                  <SelectItem key={provider.id} value={provider.name}>{provider.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="category">Category*</Label>
            <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
              <SelectTrigger className="bg-[#0a0e1b] border-slate-800">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="imageSrc">Image URL*</Label>
            <Input id="imageSrc" name="imageSrc" value={formData.imageSrc} onChange={handleInputChange} placeholder="Image URL" className="bg-[#0a0e1b] border-slate-800" />
          </div>
          
          <div className="flex items-center space-x-8 mt-6">
            <div className="flex items-center space-x-2">
              <Switch id="isNew" checked={formData.isNew} onCheckedChange={(checked) => handleSwitchChange('isNew', checked)} />
              <Label htmlFor="isNew">New Game</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="isPopular" checked={formData.isPopular} onCheckedChange={(checked) => handleSwitchChange('isPopular', checked)} />
              <Label htmlFor="isPopular">Popular Game</Label>
            </div>
          </div>
        </div>
        
        <Button className="mt-6 bg-bet-primary text-black font-black hover:bg-bet-primary/85" onClick={handleCreateGame}>
          <Plus className="mr-2 h-4 w-4 stroke-[3]" /> Create Game
        </Button>
      </div>
      
      {/* Games Table */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#070a13]">
        <Table>
          <TableHeader className="bg-[#0a0e1b]">
            <TableRow className="border-slate-800">
              <TableHead className="w-12 text-slate-400"></TableHead>
              <TableHead className="text-slate-400">Title</TableHead>
              <TableHead className="text-slate-400">Provider</TableHead>
              <TableHead className="text-slate-400">Category</TableHead>
              <TableHead className="text-slate-400">New</TableHead>
              <TableHead className="text-slate-400">Popular</TableHead>
              <TableHead className="text-right text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-slate-800">
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-bet-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : games.length > 0 ? (
              games.map(game => (
                <TableRow key={game.id} className="border-slate-800 hover:bg-slate-900/30">
                  {editMode === game.id ? (
                    // Edit Mode
                    <>
                      <TableCell>
                        <div className="w-10 h-10 rounded bg-[#0a0e1b] relative overflow-hidden">
                          <img 
                            src={editData.imageSrc || ''} 
                            alt={editData.title || ''}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input 
                          name="title" 
                          value={editData.title || ''} 
                          onChange={handleEditInputChange} 
                          className="h-8 bg-[#0a0e1b] border-slate-800"
                        />
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={editData.provider || ''} 
                          onValueChange={(value) => handleEditSelectChange('provider', value)}
                        >
                          <SelectTrigger className="h-8 bg-[#0a0e1b] border-slate-800">
                            <SelectValue placeholder="Select Provider" />
                          </SelectTrigger>
                          <SelectContent>
                            {providers.map(provider => (
                              <SelectItem key={provider.id} value={provider.name}>{provider.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={editData.category || ''} 
                          onValueChange={(value) => handleEditSelectChange('category', value)}
                        >
                          <SelectTrigger className="h-8 bg-[#0a0e1b] border-slate-800">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={!!editData.isNew} 
                          onCheckedChange={(checked) => handleEditSwitchChange('isNew', checked)} 
                        />
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={!!editData.isPopular} 
                          onCheckedChange={(checked) => handleEditSwitchChange('isPopular', checked)} 
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={handleSaveEdit} className="mr-2 border-slate-700">
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setEditMode(null)} className="border-slate-700">
                          Cancel
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    // View Mode
                    <>
                      <TableCell>
                        <div className="w-10 h-10 rounded bg-[#0a0e1b] relative overflow-hidden border border-slate-800">
                          <img 
                            src={game.imageSrc} 
                            alt={game.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-white text-xs">{game.title}</TableCell>
                      <TableCell className="text-xs text-slate-300">{game.provider}</TableCell>
                      <TableCell className="text-xs text-slate-400 capitalize">{game.category}</TableCell>
                      <TableCell className="text-xs">{game.isNew ? <span className="text-bet-primary font-bold">Yes</span> : 'No'}</TableCell>
                      <TableCell className="text-xs">{game.isPopular ? <span className="text-indigo-400 font-bold">Yes</span> : 'No'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleEditGame(game)} className="mr-2 border-slate-800 text-slate-400 hover:text-white">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteGame(game.id)} className="border-slate-800 text-slate-400 hover:text-red-400">
                          <Trash className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow className="border-slate-800">
                <TableCell colSpan={7} className="text-center py-6 text-slate-400 text-xs">No casino games found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
