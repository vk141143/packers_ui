import { useState, useEffect } from 'react';
import { getAllQuotes } from '../services/api';
import { declineQuote } from '../services/quoteApi';
import { Quote } from '../types';

export const useQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAllQuotes();
      
      if (response.success && response.data) {
        setQuotes(response.data);
      } else {
        setError(response.error || 'Failed to fetch quotes');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleDeclineQuote = async (quoteId: string, reason: string) => {
    try {
      const response = await declineQuote(quoteId, reason);
      
      if (response.success) {
        // Refresh quotes after declining
        await fetchQuotes();
        return { success: true, status: response.status };
      } else {
        return { success: false, error: response.error };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to decline quote' 
      };
    }
  };

  return {
    quotes,
    loading,
    error,
    refetch: fetchQuotes,
    declineQuote: handleDeclineQuote
  };
};