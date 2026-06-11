
import { apiFetch } from '@/lib/api';

// Define payment method types
export type PaymentMethod = 'momo' | 'airtel' | 'irembo' | 'card';

// Interface for payment request data
export interface PaymentRequestData {
  amount: number;
  phoneNumber?: string;
  email?: string;
  description?: string;
  currency: string;
  paymentMethod: PaymentMethod;
  cardDetails?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  };
}

// Interface for payment response
export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  redirectUrl?: string;
}

// Interface for transaction fallback record
export interface TransactionRecord {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'bet_win' | 'bet_loss';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  method?: string;
  reference?: string;
}

// Main payment processing function for deposit
export const processPayment = async (data: PaymentRequestData): Promise<PaymentResponse> => {
  try {
    const cleanPhone = data.phoneNumber ? data.phoneNumber.replace(/\s/g, '') : '';
    
    // Call Django deposit endpoint
    const response = await apiFetch('/payments/deposit/', {
      method: 'POST',
      body: JSON.stringify({
        amount: Number(data.amount),
        currency: data.currency || 'RWF',
        method: data.paymentMethod,
        phone_number: cleanPhone,
        description: data.description || 'Deposit to Urban Bet'
      })
    });

    if (response && response.success) {
      // Dispatch event to notify layout/navbar that balance changed
      window.dispatchEvent(new CustomEvent('authChange'));
      return {
        success: true,
        transactionId: String(response.transaction_id),
        message: response.message
      };
    }

    return {
      success: false,
      message: response?.message || 'Payment failed.'
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again later.'
    };
  }
};

// Process withdrawal
export const withdrawFunds = async (data: {
  amount: number;
  method: 'momo' | 'airtel' | 'card';
  phone_number?: string;
  currency: string;
}): Promise<PaymentResponse> => {
  try {
    const cleanPhone = data.phone_number ? data.phone_number.replace(/\s/g, '') : '';
    
    const response = await apiFetch('/payments/withdraw/', {
      method: 'POST',
      body: JSON.stringify({
        amount: Number(data.amount),
        currency: data.currency || 'RWF',
        method: data.method,
        phone_number: cleanPhone
      })
    });

    if (response && response.success) {
      // Dispatch event to notify layout/navbar that balance changed
      window.dispatchEvent(new CustomEvent('authChange'));
      return {
        success: true,
        transactionId: String(response.transaction_id),
        message: response.message
      };
    }

    return {
      success: false,
      message: response?.message || 'Withdrawal failed.'
    };
  } catch (error) {
    console.error('Withdrawal processing error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again later.'
    };
  }
};

// Retrieve transaction history
export const getTransactionHistory = async (): Promise<TransactionRecord[]> => {
  try {
    const data = await apiFetch('/payments/history/');
    return (data || []).map((txn: any) => ({
      id: String(txn.id),
      userId: String(txn.user),
      type: txn.transaction_type, // 'deposit' or 'withdrawal'
      amount: Number(txn.amount),
      currency: txn.currency,
      status: txn.status,
      timestamp: txn.created_at,
      method: txn.method,
      reference: txn.reference
    }));
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return [];
  }
};

