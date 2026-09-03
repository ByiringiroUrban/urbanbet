import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiFetch, toArray } from "@/lib/api";
import { Pencil, Trash, Plus, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function AdminSports() {
  const [sports, setSports] = useState<any[]>([]);
  const [leagues, setLeagues] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  
  const [loadingSports, setLoadingSports] = useState(false);
  const [loadingLeagues, setLoadingLeagues] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);

  const { toast } = useToast();
  
  // Create state
  const [newSport, setNewSport] = useState({ name: "", icon: "circle", is_active: true, order: 0 });
  const [newLeague, setNewLeague] = useState({ name: "", sport: "", country: "", is_active: true });
  const [newCountry, setNewCountry] = useState({ name: "", code: "" });

  // Edit state
  const [editMode, setEditMode] = useState<{ type: string; id: string } | null>(null);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    loadSports();
    loadCountries();
    loadLeagues();
  }, []);

  const loadSports = async () => {
    setLoadingSports(true);
    try {
      const data = await apiFetch('/sports/');
      setSports(toArray(data));
    } catch (error) {
      console.error('Error loading sports:', error);
    } finally {
      setLoadingSports(false);
    }
  };

  const loadCountries = async () => {
    setLoadingCountries(true);
    try {
      const data = await apiFetch('/sports/countries/');
      setCountries(toArray(data));
    } catch (error) {
      console.error('Error loading countries:', error);
    } finally {
      setLoadingCountries(false);
    }
  };

  const loadLeagues = async () => {
    setLoadingLeagues(true);
    try {
      const data = await apiFetch('/sports/leagues/');
      setLeagues(toArray(data));
    } catch (error) {
      console.error('Error loading leagues:', error);
    } finally {
      setLoadingLeagues(false);
    }
  };

  // ---- CREATE HANDLERS ----

  const handleCreateSport = async () => {
    if (!newSport.name) return toast({ title: "Error", description: "Sport name is required", variant: "destructive" });
    try {
      await apiFetch('/sports/admin/sports/', {
        method: 'POST',
        body: JSON.stringify(newSport)
      });
      toast({ title: "Success", description: "Sport created successfully." });
      setNewSport({ name: "", icon: "circle", is_active: true, order: 0 });
      loadSports();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create sport", variant: "destructive" });
    }
  };

  const handleCreateLeague = async () => {
    if (!newLeague.name || !newLeague.sport) return toast({ title: "Error", description: "Name and Sport are required", variant: "destructive" });
    try {
      await apiFetch('/sports/admin/leagues/', {
        method: 'POST',
        body: JSON.stringify({
          ...newLeague,
          sport: Number(newLeague.sport),
          country: newLeague.country ? Number(newLeague.country) : null,
        })
      });
      toast({ title: "Success", description: "League created successfully." });
      setNewLeague({ name: "", sport: "", country: "", is_active: true });
      loadLeagues();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create league", variant: "destructive" });
    }
  };

  const handleCreateCountry = async () => {
    if (!newCountry.name) return toast({ title: "Error", description: "Country name is required", variant: "destructive" });
    try {
      await apiFetch('/sports/admin/countries/', {
        method: 'POST',
        body: JSON.stringify(newCountry)
      });
      toast({ title: "Success", description: "Country created successfully." });
      setNewCountry({ name: "", code: "" });
      loadCountries();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create country", variant: "destructive" });
    }
  };

  // ---- EDIT HANDLERS ----

  const startEdit = (type: string, item: any) => {
    setEditMode({ type, id: String(item.id) });
    if (type === 'sport') setEditData({ ...item });
    if (type === 'league') setEditData({ ...item, sport: String(item.sport), country: item.country ? String(item.country) : "" });
    if (type === 'country') setEditData({ ...item });
  };

  const saveEdit = async (type: string) => {
    if (!editMode) return;
    try {
      let endpoint = '';
      let payload = { ...editData };

      if (type === 'sport') {
        endpoint = `/sports/admin/sports/${editMode.id}/`;
      } else if (type === 'league') {
        endpoint = `/sports/admin/leagues/${editMode.id}/`;
        payload.sport = Number(payload.sport);
        payload.country = payload.country ? Number(payload.country) : null;
      } else if (type === 'country') {
        endpoint = `/sports/admin/countries/${editMode.id}/`;
      }

      await apiFetch(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      
      toast({ title: "Success", description: `${type} updated successfully.` });
      setEditMode(null);
      setEditData({});
      
      if (type === 'sport') loadSports();
      if (type === 'league') loadLeagues();
      if (type === 'country') loadCountries();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || `Failed to update ${type}`, variant: "destructive" });
    }
  };

  // ---- DELETE HANDLERS ----

  const handleDelete = async (type: string, id: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      let endpoint = '';
      if (type === 'sport') endpoint = `/sports/admin/sports/${id}/`;
      if (type === 'league') endpoint = `/sports/admin/leagues/${id}/`;
      if (type === 'country') endpoint = `/sports/admin/countries/${id}/`;

      await apiFetch(endpoint, { method: 'DELETE' });
      toast({ title: "Success", description: `${type} deleted successfully.` });
      
      if (type === 'sport') loadSports();
      if (type === 'league') loadLeagues();
      if (type === 'country') loadCountries();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || `Failed to delete ${type}`, variant: "destructive" });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-black uppercase text-white tracking-tight mb-6">Manage Sports & Leagues</h2>

      <Tabs defaultValue="sports" className="w-full">
        <TabsList className="bg-[#070a13] border border-slate-800 p-1 mb-6 rounded-lg w-full justify-start h-auto overflow-x-auto">
          <TabsTrigger value="sports" className="data-[state=active]:bg-bet-primary/10 data-[state=active]:text-bet-primary font-bold text-xs uppercase px-6 py-2 rounded-md">Sports</TabsTrigger>
          <TabsTrigger value="leagues" className="data-[state=active]:bg-bet-primary/10 data-[state=active]:text-bet-primary font-bold text-xs uppercase px-6 py-2 rounded-md">Leagues</TabsTrigger>
          <TabsTrigger value="countries" className="data-[state=active]:bg-bet-primary/10 data-[state=active]:text-bet-primary font-bold text-xs uppercase px-6 py-2 rounded-md">Countries</TabsTrigger>
        </TabsList>

        {/* SPORTS TAB */}
        <TabsContent value="sports">
          <div className="bg-[#070a13] border border-slate-800 rounded-xl p-6 mb-8">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Create New Sport</h3>
            <div className="flex gap-4 items-end flex-wrap">
              <div>
                <Label>Name</Label>
                <Input value={newSport.name} onChange={(e) => setNewSport({...newSport, name: e.target.value})} placeholder="e.g. Football" className="bg-[#0a0e1b] border-slate-800 w-48" />
              </div>
              <div>
                <Label>Icon Name</Label>
                <Input value={newSport.icon} onChange={(e) => setNewSport({...newSport, icon: e.target.value})} placeholder="e.g. circle" className="bg-[#0a0e1b] border-slate-800 w-32" />
              </div>
              <div>
                <Label>Order</Label>
                <Input type="number" value={newSport.order} onChange={(e) => setNewSport({...newSport, order: parseInt(e.target.value) || 0})} className="bg-[#0a0e1b] border-slate-800 w-24" />
              </div>
              <div className="flex flex-col gap-2 mb-2">
                <Label>Active</Label>
                <Switch checked={newSport.is_active} onCheckedChange={(c) => setNewSport({...newSport, is_active: c})} />
              </div>
              <Button className="bg-bet-primary text-black font-black hover:bg-bet-primary/85" onClick={handleCreateSport}>
                <Plus className="mr-2 h-4 w-4 stroke-[3]" /> Add Sport
              </Button>
            </div>
          </div>

          <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#070a13]">
            <Table>
              <TableHeader className="bg-[#0a0e1b]">
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-400">ID</TableHead>
                  <TableHead className="text-slate-400">Name</TableHead>
                  <TableHead className="text-slate-400">Icon</TableHead>
                  <TableHead className="text-slate-400">Order</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-right text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sports.map(s => (
                  <TableRow key={s.id} className="border-slate-800">
                    {editMode?.type === 'sport' && editMode?.id === String(s.id) ? (
                      <>
                        <TableCell className="text-xs text-slate-500">{s.id}</TableCell>
                        <TableCell><Input value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="h-8 bg-[#0a0e1b] border-slate-800 text-xs" /></TableCell>
                        <TableCell><Input value={editData.icon} onChange={e => setEditData({...editData, icon: e.target.value})} className="h-8 bg-[#0a0e1b] border-slate-800 text-xs" /></TableCell>
                        <TableCell><Input type="number" value={editData.order} onChange={e => setEditData({...editData, order: parseInt(e.target.value) || 0})} className="h-8 w-16 bg-[#0a0e1b] border-slate-800 text-xs" /></TableCell>
                        <TableCell><Switch checked={editData.is_active} onCheckedChange={(c) => setEditData({...editData, is_active: c})} /></TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => saveEdit('sport')} className="mr-2 border-slate-700"><Save className="h-4 w-4" /></Button>
                          <Button variant="outline" size="sm" onClick={() => setEditMode(null)} className="border-slate-700">Cancel</Button>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="text-xs text-slate-500">{s.id}</TableCell>
                        <TableCell className="text-xs font-bold text-white">{s.name}</TableCell>
                        <TableCell className="text-xs text-slate-400">{s.icon}</TableCell>
                        <TableCell className="text-xs text-slate-400">{s.order}</TableCell>
                        <TableCell className="text-xs">
                          {s.is_active ? <span className="text-emerald-400">Active</span> : <span className="text-red-400">Inactive</span>}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => startEdit('sport', s)} className="mr-2 border-slate-800 text-slate-400 hover:text-white"><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete('sport', String(s.id))} className="border-slate-800 text-slate-400 hover:text-red-400"><Trash className="h-3.5 w-3.5" /></Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
                {sports.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center py-4 text-xs text-slate-500">No sports found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* LEAGUES TAB */}
        <TabsContent value="leagues">
          <div className="bg-[#070a13] border border-slate-800 rounded-xl p-6 mb-8">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Create New League</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <Label>League Name*</Label>
                <Input value={newLeague.name} onChange={(e) => setNewLeague({...newLeague, name: e.target.value})} placeholder="e.g. Premier League" className="bg-[#0a0e1b] border-slate-800" />
              </div>
              <div>
                <Label>Sport*</Label>
                <Select value={newLeague.sport} onValueChange={(val) => setNewLeague({...newLeague, sport: val})}>
                  <SelectTrigger className="bg-[#0a0e1b] border-slate-800"><SelectValue placeholder="Select Sport" /></SelectTrigger>
                  <SelectContent>
                    {sports.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Country</Label>
                <Select value={newLeague.country} onValueChange={(val) => setNewLeague({...newLeague, country: val})}>
                  <SelectTrigger className="bg-[#0a0e1b] border-slate-800"><SelectValue placeholder="Select Country" /></SelectTrigger>
                  <SelectContent>
                    {countries.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-bet-primary text-black font-black hover:bg-bet-primary/85" onClick={handleCreateLeague}>
                <Plus className="mr-2 h-4 w-4 stroke-[3]" /> Add League
              </Button>
            </div>
          </div>

          <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#070a13]">
            <Table>
              <TableHeader className="bg-[#0a0e1b]">
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-400">ID</TableHead>
                  <TableHead className="text-slate-400">Name</TableHead>
                  <TableHead className="text-slate-400">Sport</TableHead>
                  <TableHead className="text-slate-400">Country</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-right text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leagues.map(l => (
                  <TableRow key={l.id} className="border-slate-800">
                    {editMode?.type === 'league' && editMode?.id === String(l.id) ? (
                      <>
                        <TableCell className="text-xs text-slate-500">{l.id}</TableCell>
                        <TableCell><Input value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="h-8 bg-[#0a0e1b] border-slate-800 text-xs" /></TableCell>
                        <TableCell>
                          <Select value={editData.sport} onValueChange={(val) => setEditData({...editData, sport: val})}>
                            <SelectTrigger className="h-8 bg-[#0a0e1b] border-slate-800 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>{sports.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}</SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select value={editData.country} onValueChange={(val) => setEditData({...editData, country: val})}>
                            <SelectTrigger className="h-8 bg-[#0a0e1b] border-slate-800 text-xs"><SelectValue placeholder="None" /></SelectTrigger>
                            <SelectContent>{countries.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell><Switch checked={editData.is_active} onCheckedChange={(c) => setEditData({...editData, is_active: c})} /></TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => saveEdit('league')} className="mr-2 border-slate-700"><Save className="h-4 w-4" /></Button>
                          <Button variant="outline" size="sm" onClick={() => setEditMode(null)} className="border-slate-700">Cancel</Button>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="text-xs text-slate-500">{l.id}</TableCell>
                        <TableCell className="text-xs font-bold text-white">{l.name}</TableCell>
                        <TableCell className="text-xs font-semibold text-bet-primary">{l.sport_name}</TableCell>
                        <TableCell className="text-xs text-slate-400">{l.country_name || '—'}</TableCell>
                        <TableCell className="text-xs">
                          {l.is_active ? <span className="text-emerald-400">Active</span> : <span className="text-red-400">Inactive</span>}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => startEdit('league', l)} className="mr-2 border-slate-800 text-slate-400 hover:text-white"><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete('league', String(l.id))} className="border-slate-800 text-slate-400 hover:text-red-400"><Trash className="h-3.5 w-3.5" /></Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
                {leagues.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center py-4 text-xs text-slate-500">No leagues found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* COUNTRIES TAB */}
        <TabsContent value="countries">
          <div className="bg-[#070a13] border border-slate-800 rounded-xl p-6 mb-8">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Create New Country</h3>
            <div className="flex gap-4 items-end flex-wrap">
              <div>
                <Label>Country Name*</Label>
                <Input value={newCountry.name} onChange={(e) => setNewCountry({...newCountry, name: e.target.value})} placeholder="e.g. Spain" className="bg-[#0a0e1b] border-slate-800 w-48" />
              </div>
              <div>
                <Label>Code (Optional)</Label>
                <Input value={newCountry.code} onChange={(e) => setNewCountry({...newCountry, code: e.target.value})} placeholder="e.g. ES" className="bg-[#0a0e1b] border-slate-800 w-32" />
              </div>
              <Button className="bg-bet-primary text-black font-black hover:bg-bet-primary/85" onClick={handleCreateCountry}>
                <Plus className="mr-2 h-4 w-4 stroke-[3]" /> Add Country
              </Button>
            </div>
          </div>

          <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#070a13]">
            <Table>
              <TableHeader className="bg-[#0a0e1b]">
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-400">ID</TableHead>
                  <TableHead className="text-slate-400">Name</TableHead>
                  <TableHead className="text-slate-400">Code</TableHead>
                  <TableHead className="text-right text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {countries.map(c => (
                  <TableRow key={c.id} className="border-slate-800">
                    {editMode?.type === 'country' && editMode?.id === String(c.id) ? (
                      <>
                        <TableCell className="text-xs text-slate-500">{c.id}</TableCell>
                        <TableCell><Input value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="h-8 bg-[#0a0e1b] border-slate-800 text-xs" /></TableCell>
                        <TableCell><Input value={editData.code} onChange={e => setEditData({...editData, code: e.target.value})} className="h-8 bg-[#0a0e1b] border-slate-800 text-xs" /></TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => saveEdit('country')} className="mr-2 border-slate-700"><Save className="h-4 w-4" /></Button>
                          <Button variant="outline" size="sm" onClick={() => setEditMode(null)} className="border-slate-700">Cancel</Button>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="text-xs text-slate-500">{c.id}</TableCell>
                        <TableCell className="text-xs font-bold text-white">{c.name}</TableCell>
                        <TableCell className="text-xs text-slate-400">{c.code}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => startEdit('country', c)} className="mr-2 border-slate-800 text-slate-400 hover:text-white"><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete('country', String(c.id))} className="border-slate-800 text-slate-400 hover:text-red-400"><Trash className="h-3.5 w-3.5" /></Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
                {countries.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center py-4 text-xs text-slate-500">No countries found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
