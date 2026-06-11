
import { apiFetch, toArray } from '@/lib/api';
import { Market } from './database/types';

// Get list of sports
export const getSports = async (): Promise<{ id: string; name: string }[]> => {
  try {
    const data = await apiFetch('/sports/');
    return toArray(data).map((sport: any) => ({
      id: String(sport.id),
      name: sport.name
    }));
  } catch (error) {
    console.error('Error fetching sports:', error);
    // Return default sports if server is down
    return [
      { id: '1', name: 'Football' },
      { id: '2', name: 'Basketball' },
      { id: '3', name: 'Tennis' },
      { id: '4', name: 'Rugby' },
      { id: '5', name: 'Cricket' },
      { id: '6', name: 'eSports' }
    ];
  }
};

// Get available markets for an event
export const getMarkets = async (eventId?: string): Promise<Market[]> => {
  if (!eventId) {
    return [
      { id: '1', name: 'Match Winner', options: ['Home', 'Draw', 'Away'] },
      { id: '2', name: 'Over/Under 2.5 Goals', options: ['Over', 'Under'] },
      { id: '3', name: 'Both Teams to Score', options: ['Yes', 'No'] }
    ];
  }
  
  try {
    const data = await apiFetch(`/sports/events/${eventId}/markets/`);
    return toArray(data).map((market: any) => ({
      id: String(market.id),
      name: market.name,
      options: market.options,
      eventId
    }));
  } catch (error) {
    console.error('Error fetching markets:', error);
    return [
      { id: '1', name: 'Match Winner', options: ['Home', 'Draw', 'Away'], eventId },
      { id: '2', name: 'Over/Under 2.5 Goals', options: ['Over', 'Under'], eventId },
      { id: '3', name: 'Both Teams to Score', options: ['Yes', 'No'], eventId }
    ];
  }
};

