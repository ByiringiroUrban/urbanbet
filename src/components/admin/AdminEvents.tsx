
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SportEvent } from "@/services/database/types";
import { useToast } from "@/hooks/use-toast";
import { dbFallback } from "@/utils/dbFallback";
import { Pencil, Trash, Plus, Save } from "lucide-react";

export default function AdminEvents() {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [sports, setSports] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<string | null>(null);
  const { toast } = useToast();
  
  // New event form state
  const [formData, setFormData] = useState({
    sportId: "football",
    homeTeam: "",
    awayTeam: "",
    league: "",
    country: "",
    startTime: "",
    isLive: false,
    homeOdds: 1.85,
    drawOdds: 3.25,
    awayOdds: 2.50
  });
  
  // Edit event form state
  const [editData, setEditData] = useState<Partial<SportEvent>>({});
  
  useEffect(() => {
    loadSports();
    loadEvents();
  }, []);

  const loadSports = () => {
    // Return the local sports categories
    setSports([
      { id: 'football', name: 'Football' },
      { id: 'basketball', name: 'Basketball' },
      { id: 'tennis', name: 'Tennis' }
    ]);
  };

  const loadEvents = () => {
    setLoading(true);
    try {
      const data = dbFallback.getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
      toast({
        title: "Error",
        description: "Failed to load events.",
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
      [name]: name.endsWith('Odds') ? parseFloat(value) || 0 : value
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: name.endsWith('Odds') ? parseFloat(value) || 0 : value
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

  const handleCreateEvent = () => {
    try {
      if (!formData.homeTeam || !formData.awayTeam || !formData.startTime || !formData.sportId) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      
      dbFallback.saveEvent(formData);
      
      toast({
        title: "Success",
        description: "Event created successfully.",
      });
      
      // Reset form
      setFormData({
        sportId: "football",
        homeTeam: "",
        awayTeam: "",
        league: "",
        country: "",
        startTime: "",
        isLive: false,
        homeOdds: 1.85,
        drawOdds: 3.25,
        awayOdds: 2.50
      });
      
      loadEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event.",
        variant: "destructive",
      });
    }
  };

  const handleEditEvent = (event: SportEvent) => {
    setEditMode(event.id);
    setEditData(event);
  };

  const handleSaveEdit = () => {
    if (!editMode || !editData.id) return;
    
    try {
      dbFallback.saveEvent(editData);
      
      toast({
        title: "Success",
        description: "Event updated successfully.",
      });
      
      setEditMode(null);
      setEditData({});
      loadEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Error",
        description: "Failed to update event.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      dbFallback.deleteEvent(id);
      
      toast({
        title: "Success",
        description: "Event deleted successfully.",
      });
      
      loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-black uppercase text-white tracking-tight mb-6">Manage Events / Matches</h2>
      
      {/* Create Event Form */}
      <div className="bg-[#070a13] border border-slate-800 rounded-xl p-6 mb-8">
        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Create New Event</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="sportId">Sport*</Label>
            <Select value={formData.sportId} onValueChange={(value) => handleSelectChange('sportId', value)}>
              <SelectTrigger className="bg-[#0a0e1b] border-slate-800">
                <SelectValue placeholder="Select Sport" />
              </SelectTrigger>
              <SelectContent>
                {sports.map(sport => (
                  <SelectItem key={sport.id} value={sport.id}>{sport.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="homeTeam">Home Team*</Label>
            <Input id="homeTeam" name="homeTeam" value={formData.homeTeam} onChange={handleInputChange} placeholder="Home Team" className="bg-[#0a0e1b] border-slate-800" />
          </div>
          
          <div>
            <Label htmlFor="awayTeam">Away Team*</Label>
            <Input id="awayTeam" name="awayTeam" value={formData.awayTeam} onChange={handleInputChange} placeholder="Away Team" className="bg-[#0a0e1b] border-slate-800" />
          </div>
          
          <div>
            <Label htmlFor="league">League</Label>
            <Input id="league" name="league" value={formData.league} onChange={handleInputChange} placeholder="e.g. Premier League" className="bg-[#0a0e1b] border-slate-800" />
          </div>
          
          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" value={formData.country} onChange={handleInputChange} placeholder="e.g. england" className="bg-[#0a0e1b] border-slate-800" />
          </div>
          
          <div>
            <Label htmlFor="startTime">Start Time*</Label>
            <Input id="startTime" name="startTime" type="datetime-local" value={formData.startTime} onChange={handleInputChange} className="bg-[#0a0e1b] border-slate-800 text-slate-100" />
          </div>

          <div>
            <Label htmlFor="homeOdds">Home Odds*</Label>
            <Input id="homeOdds" name="homeOdds" type="number" step="0.01" value={formData.homeOdds} onChange={handleInputChange} className="bg-[#0a0e1b] border-slate-800" />
          </div>

          <div>
            <Label htmlFor="drawOdds">Draw Odds (Optional)</Label>
            <Input id="drawOdds" name="drawOdds" type="number" step="0.01" value={formData.drawOdds} onChange={handleInputChange} className="bg-[#0a0e1b] border-slate-800" />
          </div>

          <div>
            <Label htmlFor="awayOdds">Away Odds*</Label>
            <Input id="awayOdds" name="awayOdds" type="number" step="0.01" value={formData.awayOdds} onChange={handleInputChange} className="bg-[#0a0e1b] border-slate-800" />
          </div>
          
          <div className="flex items-center space-x-2 mt-6">
            <Switch id="isLive" checked={formData.isLive} onCheckedChange={(checked) => handleSwitchChange('isLive', checked)} />
            <Label htmlFor="isLive">Live Event</Label>
          </div>
        </div>
        
        <Button className="mt-6 bg-bet-primary text-black font-black hover:bg-bet-primary/85" onClick={handleCreateEvent}>
          <Plus className="mr-2 h-4 w-4 stroke-[3]" /> Create Event
        </Button>
      </div>
      
      {/* Events Table */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#070a13]">
        <Table>
          <TableHeader className="bg-[#0a0e1b]">
            <TableRow className="border-slate-800">
              <TableHead className="text-slate-400">Home Team</TableHead>
              <TableHead className="text-slate-400">Away Team</TableHead>
              <TableHead className="text-slate-400">League</TableHead>
              <TableHead className="text-slate-400">Start Time</TableHead>
              <TableHead className="text-slate-400">Odds (1/X/2)</TableHead>
              <TableHead className="text-slate-400">Live</TableHead>
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
            ) : events.length > 0 ? (
              events.map(event => (
                <TableRow key={event.id} className="border-slate-800 hover:bg-slate-900/30">
                  {editMode === event.id ? (
                    // Edit Mode
                    <>
                      <TableCell>
                        <Input 
                          name="homeTeam" 
                          value={editData.homeTeam || ''} 
                          onChange={handleEditInputChange} 
                          className="h-8 bg-[#0a0e1b] border-slate-800"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          name="awayTeam" 
                          value={editData.awayTeam || ''} 
                          onChange={handleEditInputChange} 
                          className="h-8 bg-[#0a0e1b] border-slate-800"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          name="league" 
                          value={editData.league || ''} 
                          onChange={handleEditInputChange} 
                          className="h-8 bg-[#0a0e1b] border-slate-800"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          name="startTime" 
                          type="datetime-local" 
                          value={typeof editData.startTime === 'string' ? editData.startTime.substring(0,16) : ''} 
                          onChange={handleEditInputChange} 
                          className="h-8 bg-[#0a0e1b] border-slate-800 text-slate-100"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Input name="homeOdds" type="number" step="0.01" value={editData.homeOdds || 0} onChange={handleEditInputChange} className="h-8 w-12 bg-[#0a0e1b] border-slate-800 text-xs px-1" />
                          <Input name="drawOdds" type="number" step="0.01" value={editData.drawOdds || 0} onChange={handleEditInputChange} className="h-8 w-12 bg-[#0a0e1b] border-slate-800 text-xs px-1" />
                          <Input name="awayOdds" type="number" step="0.01" value={editData.awayOdds || 0} onChange={handleEditInputChange} className="h-8 w-12 bg-[#0a0e1b] border-slate-800 text-xs px-1" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={!!editData.isLive} 
                          onCheckedChange={(checked) => handleEditSwitchChange('isLive', checked)} 
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
                      <TableCell className="font-bold text-white text-xs">{event.homeTeam}</TableCell>
                      <TableCell className="font-bold text-white text-xs">{event.awayTeam}</TableCell>
                      <TableCell className="text-xs text-slate-300">{event.league}</TableCell>
                      <TableCell className="text-xs text-slate-400">{event.startTime ? new Date(event.startTime).toLocaleString() : `${event.date} ${event.time}`}</TableCell>
                      <TableCell className="text-xs font-mono text-bet-primary font-bold">
                        {event.homeOdds?.toFixed(2)} / {event.drawOdds ? event.drawOdds.toFixed(2) : "N/A"} / {event.awayOdds?.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-xs">
                        {event.isLive ? (
                          <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-black uppercase animate-pulse">LIVE</span>
                        ) : (
                          <span className="text-slate-500">No</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)} className="mr-2 border-slate-800 text-slate-400 hover:text-white">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(event.id)} className="border-slate-800 text-slate-400 hover:text-red-400">
                          <Trash className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow className="border-slate-800">
                <TableCell colSpan={7} className="text-center py-6 text-slate-400 text-xs">No events found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

