import { apiFetch, toArray } from '@/lib/api';
import { BetRecord } from './database/types';

// Betting related functions
export const saveBet = async (betData: Omit<BetRecord, 'id'>): Promise<{ success: boolean; id?: string }> => {
  try {
    const response = await apiFetch('/bets/place/', {
      method: 'POST',
      body: JSON.stringify({
        items: betData.items.map(item => ({
          event: item.event,
          selection: item.selection,
          odds: Number(item.odds)
        })),
        amount: Number(betData.amount),
        currency: betData.currency || 'RWF'
      })
    });
    
    return {
      success: true,
      id: response?.id ? String(response.id) : undefined
    };
  } catch (error) {
    console.error('Error saving bet:', error);
    return { success: false };
  }
};

export const getBetHistory = async (userId: string): Promise<BetRecord[]> => {
  try {
    const data = await apiFetch('/bets/history/');
    return toArray(data).map((bet: any) => ({
      id: String(bet.id),
      userId: String(bet.user),
      items: bet.items,
      totalOdds: Number(bet.total_odds),
      amount: Number(bet.amount),
      potentialWinnings: Number(bet.potential_winnings),
      timestamp: bet.created_at,
      status: bet.status,
      currency: bet.currency
    }));
  } catch (error) {
    console.error('Error fetching bet history:', error);
    return [];
  }
};

