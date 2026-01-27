import { useState, useEffect } from 'react';
import { getAllQuotes } from '../services/api';
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

  return {
    quotes,
    loading,
    error,
    refetch: fetchQuotes
  };
};