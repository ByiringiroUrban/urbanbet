
import { apiFetch } from '@/lib/api';
import { AIprediction } from './database/types';

export const getAIPredictions = async (userId: string): Promise<AIprediction[]> => {
  try {
    const data = await apiFetch('/predictions/');
    return (data || []).map((pred: any) => ({
      id: String(pred.id),
      match: pred.match,
      prediction: pred.prediction,
      confidence: pred.confidence,
      analysis: pred.analysis,
      trend: pred.trend,
      odds: pred.odds
    }));
  } catch (error) {
    console.error('Error fetching AI predictions:', error);
    return [];
  }
};

export const generatePrediction = async (matchData: {
  match: string;
  teams: string[];
  history?: string;
  currentForm?: string;
}) => {
  // Return a friendly offline warning as prediction generation is handled via seeded DB records
  return {
    success: false,
    error: 'AI Prediction service is running on pre-calculated models in the database.'
  };
};

