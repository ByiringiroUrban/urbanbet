import { apiFetch } from '@/lib/api';
import { Market } from './database/types';

export const sportsService = {
  // Get all available sports
  getSports: async (): Promise<string[]> => {
    try {
      const data = await apiFetch('/sports/');
      return (data || []).map((sport: any) => sport.name);
    } catch (error) {
      console.error('Error fetching sports:', error);
      return ['Football', 'Basketball', 'Tennis']; // fallback
    }
  },
  
  // Get available markets for an event
  getMarkets: async (eventId: string): Promise<Market[]> => {
    try {
      const data = await apiFetch(`/sports/events/${eventId}/markets/`);
      return (data || []).map((market: any) => ({
        id: String(market.id),
        name: market.name,
        options: market.options,
        eventId
      }));
    } catch (error) {
      console.error('Error fetching markets:', error);
      return [];
    }
  }
};

