import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from './apiService';

interface UseApiOptions {
  ttl?: number;
  batch?: boolean;
  immediate?: boolean;
  dependencies?: any[];
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useApi<T>(
  endpoint: string,
  params?: any,
  options: UseApiOptions = {}
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const abortControllerRef = useRef<AbortController>();
  const { immediate = true, dependencies = [] } = options;

  const execute = useCallback(async (customParams?: any) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiService.get<T>(
        endpoint,
        customParams || params,
        { ttl: options.ttl, batch: options.batch }
      );
      
      if (!abortControllerRef.current.signal.aborted) {
        setState({ data, loading: false, error: null });
      }
    } catch (error) {
      if (!abortControllerRef.current.signal.aborted) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error instanceof Error ? error : new Error('Unknown error') 
        }));
      }
    }
  }, [endpoint, params, options.ttl, options.batch]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
    return () => abortControllerRef.current?.abort();
  }, [execute, immediate, ...dependencies]);

  const refetch = useCallback(() => execute(), [execute]);

  return {
    ...state,
    execute,
    refetch
  };
}

export function useMutation<T, P = any>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const mutate = useCallback(async (endpoint: string, payload: P) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiService.post<T>(endpoint, payload);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setState(prev => ({ ...prev, loading: false, error: err }));
      throw err;
    }
  }, []);

  return {
    ...state,
    mutate
  };
}