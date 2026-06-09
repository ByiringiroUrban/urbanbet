import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { dbFallback } from "@/utils/dbFallback";
import { AIprediction } from "@/services/database/types";
import { Pencil, Trash, Plus, Save, BrainCircuit } from "lucide-react";

export default function AdminPredictions() {
  const [predictions, setPredictions] = useState<AIprediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<string | null>(null);
  const { toast } = useToast();

  // Create Form State
  const [formData, setFormData] = useState({
    match: "",
    prediction: "",
    confidence: 75,
    odds: "1.90",
    analysis: "",
    trend: ""
  });

  // Edit Form State
  const [editData, setEditData] = useState<Partial<AIprediction>>({});

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = () => {
    setLoading(true);
    try {
      const data = dbFallback.getAIPredictions();
      setPredictions(data);
    } catch (error) {
      console.error("Failed to load predictions:", error);
      toast({
        title: "Error",
        description: "Failed to load predictions.",
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
      [name]: name === "confidence" ? parseInt(value) || 0 : value
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: name === "confidence" ? parseInt(value) || 0 : value
    });
  };

  const handleCreatePrediction = () => {
    if (!formData.match || !formData.prediction || !formData.analysis || !formData.odds) {
      toast({
        title: "Validation Error",
        description: "Please fill in match details, prediction tip, odds, and analysis.",
        variant: "destructive",
      });
      return;
    }

    try {
      dbFallback.saveAIPrediction(formData);
      toast({
        title: "Success",
        description: "AI Prediction insight added successfully.",
      });

      // Reset Form
      setFormData({
        match: "",
        prediction: "",
        confidence: 75,
        odds: "1.90",
        analysis: "",
        trend: ""
      });

      loadPredictions();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to add prediction tip.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (pred: AIprediction) => {
    if (!pred.id) return;
    setEditMode(pred.id);
    setEditData(pred);
  };

  const handleSaveEdit = () => {
    if (!editMode || !editData.id) return;

    try {
      dbFallback.saveAIPrediction(editData);
      toast({
        title: "Success",
        description: "Prediction updated successfully.",
      });
      setEditMode(null);
      setEditData({});
      loadPredictions();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to save edits.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: string | undefined) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this AI prediction?")) return;

    try {
      dbFallback.deleteAIPrediction(id);
      toast({
        title: "Deleted",
        description: "AI prediction deleted successfully.",
      });
      loadPredictions();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete item.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BrainCircuit className="h-6 w-6 text-bet-primary" />
        <h2 className="text-xl font-black uppercase text-white tracking-tight">AI Predictions</h2>
      </div>

      {/* Creation form */}
      <div className="bg-[#070a13] border border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Create AI Prediction Insight</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="match">Match Name*</Label>
            <Input id="match" name="match" value={formData.match} onChange={handleInputChange} placeholder="e.g. Manchester United vs Chelsea" className="bg-[#0a0e1b] border-slate-800 focus-visible:ring-bet-primary" />
          </div>

          <div>
            <Label htmlFor="prediction">Recommended Tip*</Label>
            <Input id="prediction" name="prediction" value={formData.prediction} onChange={handleInputChange} placeholder="e.g. Over 2.5 goals" className="bg-[#0a0e1b] border-slate-800 focus-visible:ring-bet-primary" />
          </div>

          <div>
            <div className="flex justify-between">
              <Label htmlFor="confidence">Confidence (%)*</Label>
              <span className="text-xs text-bet-primary font-bold">{formData.confidence}%</span>
            </div>
            <Input id="confidence" name="confidence" type="number" min="10" max="100" value={formData.confidence} onChange={handleInputChange} className="bg-[#0a0e1b] border-slate-800 focus-visible:ring-bet-primary" />
          </div>

          <div>
            <Label htmlFor="odds">Suggested Odds*</Label>
            <Input id="odds" name="odds" value={formData.odds} onChange={handleInputChange} placeholder="e.g. 1.95" className="bg-[#0a0e1b] border-slate-800 focus-visible:ring-bet-primary" />
          </div>

          <div>
            <Label htmlFor="trend">Supporting Trend</Label>
            <Input id="trend" name="trend" value={formData.trend} onChange={handleInputChange} placeholder="e.g. Underdog won 4 of last 5 head-to-head" className="bg-[#0a0e1b] border-slate-800 focus-visible:ring-bet-primary" />
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <Label htmlFor="analysis">AI Detailed Analysis*</Label>
            <Input id="analysis" name="analysis" value={formData.analysis} onChange={handleInputChange} placeholder="Describe statistical models, player forms, and specific variables supporting this outcome..." className="bg-[#0a0e1b] border-slate-800 focus-visible:ring-bet-primary" />
          </div>
        </div>

        <Button className="mt-4 bg-bet-primary text-black font-black hover:bg-bet-primary/85" onClick={handleCreatePrediction}>
          <Plus className="mr-2 h-4 w-4 stroke-[3]" /> Add AI Insight
        </Button>
      </div>

      {/* Predictions Table */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#070a13]">
        <Table>
          <TableHeader className="bg-[#0a0e1b]">
            <TableRow className="border-slate-800">
              <TableHead className="text-xs font-bold text-slate-400">Match</TableHead>
              <TableHead className="text-xs font-bold text-slate-400">Prediction</TableHead>
              <TableHead className="text-xs font-bold text-slate-400">Confidence</TableHead>
              <TableHead className="text-xs font-bold text-slate-400">Odds</TableHead>
              <TableHead className="text-xs font-bold text-slate-400">Supporting Trend</TableHead>
              <TableHead className="text-xs font-bold text-slate-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-slate-800">
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-bet-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : predictions.length > 0 ? (
              predictions.map(pred => (
                <TableRow key={pred.id} className="border-slate-800 hover:bg-slate-900/30">
                  {editMode === pred.id ? (
                    // Edit state row
                    <>
                      <TableCell>
                        <Input name="match" value={editData.match || ''} onChange={handleEditInputChange} className="h-8 bg-[#0a0e1b] border-slate-800" />
                      </TableCell>
                      <TableCell>
                        <Input name="prediction" value={editData.prediction || ''} onChange={handleEditInputChange} className="h-8 bg-[#0a0e1b] border-slate-800" />
                      </TableCell>
                      <TableCell>
                        <Input name="confidence" type="number" value={editData.confidence || 0} onChange={handleEditInputChange} className="h-8 w-20 bg-[#0a0e1b] border-slate-800" />
                      </TableCell>
                      <TableCell>
                        <Input name="odds" value={editData.odds || ''} onChange={handleEditInputChange} className="h-8 w-20 bg-[#0a0e1b] border-slate-800" />
                      </TableCell>
                      <TableCell>
                        <Input name="trend" value={editData.trend || ''} onChange={handleEditInputChange} className="h-8 bg-[#0a0e1b] border-slate-800" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={handleSaveEdit} className="mr-2 border-slate-700 text-slate-200">
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setEditMode(null)} className="border-slate-700 text-slate-400">
                          Cancel
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    // Read state row
                    <>
                      <TableCell className="font-bold text-white text-xs">{pred.match}</TableCell>
                      <TableCell className="text-xs text-bet-primary font-bold">{pred.prediction}</TableCell>
                      <TableCell className="text-xs">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          pred.confidence >= 75 ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                          pred.confidence >= 60 ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" :
                          "bg-red-500/10 text-red-500 border border-red-500/20"
                        }`}>
                          {pred.confidence}%
                        </span>
                      </TableCell>
                      <TableCell className="text-xs font-mono">{pred.odds}</TableCell>
                      <TableCell className="text-xs text-slate-400 italic max-w-[200px] truncate">{pred.trend || "None"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(pred)} className="mr-2 border-slate-800 hover:bg-slate-850 hover:text-white text-slate-400">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(pred.id)} className="border-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400">
                          <Trash className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow className="border-slate-800">
                <TableCell colSpan={6} className="text-center py-6 text-slate-400 text-xs">No AI Predictions found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
