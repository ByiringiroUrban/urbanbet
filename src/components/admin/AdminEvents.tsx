import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiFetch, toArray } from "@/lib/api";
import { Pencil, Trash, Plus, Save } from "lucide-react";

export default function AdminEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [sports, setSports] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [leagues, setLeagues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<string | null>(null);
  const { toast } = useToast();
  
  // New event form state
  const [formData, setFormData] = useState({
    sport: "",
    league: "",
    country: "",
    homeTeam: "",
    awayTeam: "",
    startTime: "",
    status: "scheduled",
    homeOdds: 1.85,
    drawOdds: 3.25,
    awayOdds: 2.50
  });
  
  // Edit event form state
  const [editData, setEditData] = useState<any>({});
  
  useEffect(() => {
    loadDropdowns();
    loadEvents();
  }, []);

  const loadDropdowns = async () => {
    try {
      const sportsList = await apiFetch('/sports/');
      setSports(toArray(sportsList));
      
      const countriesList = await apiFetch('/sports/countries/');
      setCountries(toArray(countriesList));
      
      const leaguesList = await apiFetch('/sports/leagues/');
      setLeagues(toArray(leaguesList));
    } catch (error) {
      console.error('Error loading form options:', error);
    }
  };

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/sports/events/');
      setEvents(toArray(data));
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

  const handleCreateEvent = async () => {
    try {
      if (!formData.homeTeam || !formData.awayTeam || !formData.startTime || !formData.sport || !formData.league) {
        toast({
          title: "Error",
          description: "Please fill in all required fields (Sport, League, Teams, Start Time).",
          variant: "destructive",
        });
        return;
      }
      
      await apiFetch('/sports/admin/events/', {
        method: 'POST',
        body: JSON.stringify({
          sport: Number(formData.sport),
          league: Number(formData.league),
          country: formData.country ? Number(formData.country) : null,
          home_team: formData.homeTeam,
          away_team: formData.awayTeam,
          start_time: new Date(formData.startTime).toISOString(),
          status: formData.status,
          home_odds: Number(formData.homeOdds),
          draw_odds: formData.drawOdds ? Number(formData.drawOdds) : null,
          away_odds: Number(formData.awayOdds)
        })
      });
      
      toast({
        title: "Success",
        description: "Event created successfully.",
      });
      
      // Reset form
      setFormData({
        sport: "",
        league: "",
        country: "",
        homeTeam: "",
        awayTeam: "",
        startTime: "",
        status: "scheduled",
        homeOdds: 1.85,
        drawOdds: 3.25,
        awayOdds: 2.50
      });
      
      loadEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create event.",
        variant: "destructive",
      });
    }
  };

  const handleEditEvent = (event: any) => {
    setEditMode(String(event.id));
    setEditData({
      id: event.id,
      sport: event.sport,
      league: event.league,
      country: event.country,
      homeTeam: event.home_team,
      awayTeam: event.away_team,
      startTime: event.start_time,
      status: event.status,
      homeOdds: Number(event.home_odds),
      drawOdds: event.draw_odds ? Number(event.draw_odds) : null,
      awayOdds: Number(event.away_odds)
    });
  };

  const handleSaveEdit = async () => {
    if (!editMode || !editData.id) return;
    
    try {
      await apiFetch(`/sports/admin/events/${editData.id}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          sport: Number(editData.sport),
          league: Number(editData.league),
          country: editData.country ? Number(editData.country) : null,
          home_team: editData.homeTeam,
          away_team: editData.awayTeam,
          start_time: new Date(editData.startTime).toISOString(),
          status: editData.status,
          home_odds: Number(editData.homeOdds),
          draw_odds: editData.drawOdds ? Number(editData.drawOdds) : null,
          away_odds: Number(editData.awayOdds)
        })
      });
      
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
        description: error instanceof Error ? error.message : "Failed to update event.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await apiFetch(`/sports/admin/events/${id}/`, {
        method: 'DELETE'
      });
      
      toast({
        title: "Success",
        description: "Event deleted successfully.",
      });
      
      loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete event.",
        variant: "destructive",
      });
    }
  };

  // Settle Score
  const handleSettleScore = async (id: string, homeScore: number, awayScore: number, statusVal: string) => {
    try {
      await apiFetch(`/sports/admin/events/${id}/score/`, {
        method: 'POST',
        body: JSON.stringify({
          home_score: homeScore,
          away_score: awayScore,
          status: statusVal
        })
      });
      toast({
        title: "Score updated",
        description: "Match score settled and updated successfully.",
      });
      loadEvents();
    } catch (error) {
      console.error('Error settling score:', error);
      toast({
        title: "Error",
        description: "Failed to settle match score.",
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
            <Label>Sport*</Label>
            <Select value={formData.sport} onValueChange={(value) => setFormData({ ...formData, sport: value })}>
              <SelectTrigger className="bg-[#0a0e1b] border-slate-800">
                <SelectValue placeholder="Select Sport" />
              </SelectTrigger>
              <SelectContent>
                {sports.map(sport => (
                  <SelectItem key={sport.id} value={String(sport.id)}>{sport.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>League*</Label>
            <Select value={formData.league} onValueChange={(value) => setFormData({ ...formData, league: value })}>
              <SelectTrigger className="bg-[#0a0e1b] border-slate-800">
                <SelectValue placeholder="Select League" />
              </SelectTrigger>
              <SelectContent>
                {leagues
                  .filter(l => !formData.sport || String(l.sport) === formData.sport)
                  .map(league => (
                    <SelectItem key={league.id} value={String(league.id)}>{league.name}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Country</Label>
            <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
              <SelectTrigger className="bg-[#0a0e1b] border-slate-800">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map(c => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
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
            <Label htmlFor="startTime">Start Time*</Label>
            <Input id="startTime" name="startTime" type="datetime-local" value={formData.startTime} onChange={handleInputChange} className="bg-[#0a0e1b] border-slate-800 text-slate-100" />
          </div>

          <div>
            <Label htmlFor="homeOdds">Home Odds*</Label>
            <Input id="homeOdds" name="homeOdds" type="number" step="0.01" value={formData.homeOdds} onChange={handleInputChange} className="bg-[#0a0e1b] border-slate-800" />
          </div>

          <div>
            <Label htmlFor="drawOdds">Draw Odds</Label>
            <Input id="drawOdds" name="drawOdds" type="number" step="0.01" value={formData.drawOdds} onChange={handleInputChange} className="bg-[#0a0e1b] border-slate-800" />
          </div>

          <div>
            <Label htmlFor="awayOdds">Away Odds*</Label>
            <Input id="awayOdds" name="awayOdds" type="number" step="0.01" value={formData.awayOdds} onChange={handleInputChange} className="bg-[#0a0e1b] border-slate-800" />
          </div>

          <div>
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="bg-[#0a0e1b] border-slate-800">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="finished">Finished</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="postponed">Postponed</SelectItem>
              </SelectContent>
            </Select>
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
              <TableHead className="text-slate-400">Teams</TableHead>
              <TableHead className="text-slate-400">Sport / League</TableHead>
              <TableHead className="text-slate-400">Start Time</TableHead>
              <TableHead className="text-slate-400">Odds (1/X/2)</TableHead>
              <TableHead className="text-slate-400">Status / Live</TableHead>
              <TableHead className="text-slate-400">Scores (H - A)</TableHead>
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
                  {editMode === String(event.id) ? (
                    // Edit Mode
                    <>
                      <TableCell colSpan={2}>
                        <div className="flex flex-col gap-2">
                          <Input 
                            name="homeTeam" 
                            value={editData.homeTeam || ''} 
                            onChange={handleEditInputChange} 
                            placeholder="Home Team"
                            className="h-8 bg-[#0a0e1b] border-slate-800 text-xs"
                          />
                          <Input 
                            name="awayTeam" 
                            value={editData.awayTeam || ''} 
                            onChange={handleEditInputChange} 
                            placeholder="Away Team"
                            className="h-8 bg-[#0a0e1b] border-slate-800 text-xs"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input 
                          name="startTime" 
                          type="datetime-local" 
                          value={editData.startTime ? editData.startTime.substring(0,16) : ''} 
                          onChange={handleEditInputChange} 
                          className="h-8 bg-[#0a0e1b] border-slate-800 text-slate-100 text-xs"
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
                        <Select value={String(editData.status)} onValueChange={(val) => setEditData({ ...editData, status: val })}>
                          <SelectTrigger className="h-8 bg-[#0a0e1b] border-slate-800 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="live">Live</SelectItem>
                            <SelectItem value="finished">Finished</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="postponed">Postponed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell></TableCell>
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
                      <TableCell className="text-xs">
                        <div className="font-bold text-white">{event.home_team}</div>
                        <div className="text-slate-400">vs</div>
                        <div className="font-bold text-white">{event.away_team}</div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-300">
                        <div className="font-semibold text-bet-primary">{event.sport_name}</div>
                        <div>{event.league_name}</div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-400">
                        {event.start_time ? new Date(event.start_time).toLocaleString() : ''}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-bet-primary font-bold">
                        {Number(event.home_odds).toFixed(2)} / {event.draw_odds ? Number(event.draw_odds).toFixed(2) : "N/A"} / {Number(event.away_odds).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-xs">
                        {event.is_live ? (
                          <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-black uppercase animate-pulse">LIVE</span>
                        ) : (
                          <span className="text-slate-400 capitalize">{event.status}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">
                        {event.status === 'finished' || event.status === 'live' ? (
                          <div className="flex gap-2 items-center">
                            <span className="font-black text-white">{event.home_score ?? 0}</span>
                            <span className="text-slate-500">-</span>
                            <span className="font-black text-white">{event.away_score ?? 0}</span>
                          </div>
                        ) : (
                          <div className="flex gap-2 items-center">
                            <input 
                              type="number" 
                              placeholder="H" 
                              id={`hs-${event.id}`}
                              defaultValue={event.home_score ?? 0}
                              className="w-10 h-7 bg-[#0a0e1b] border border-slate-800 text-center rounded text-xs text-white" 
                            />
                            <input 
                              type="number" 
                              placeholder="A" 
                              id={`as-${event.id}`}
                              defaultValue={event.away_score ?? 0}
                              className="w-10 h-7 bg-[#0a0e1b] border border-slate-800 text-center rounded text-xs text-white" 
                            />
                            <Button 
                              size="sm" 
                              className="h-7 text-[10px] bg-bet-secondary text-black font-black hover:bg-bet-secondary/80"
                              onClick={() => {
                                const hEl = document.getElementById(`hs-${event.id}`) as HTMLInputElement;
                                const aEl = document.getElementById(`as-${event.id}`) as HTMLInputElement;
                                handleSettleScore(
                                  String(event.id), 
                                  parseInt(hEl.value) || 0, 
                                  parseInt(aEl.value) || 0,
                                  'finished'
                                );
                              }}
                            >
                              Settle
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)} className="mr-2 border-slate-800 text-slate-400 hover:text-white">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(String(event.id))} className="border-slate-800 text-slate-400 hover:text-red-400">
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
