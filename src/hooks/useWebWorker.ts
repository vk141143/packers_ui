import { useCallback, useEffect, useRef, useState } from 'react';

interface WorkerTask {
  id: string;
  type: string;
  data: any;
  resolve: (value: any) => void;
  reject: (error: any) => void;
}

export const useWebWorker = () => {
  const workerRef = useRef<Worker | null>(null);
  const tasksRef = useRef<Map<string, WorkerTask>>(new Map());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize worker
    workerRef.current = new Worker('/worker.js');
    
    workerRef.current.onmessage = (e) => {
      const { type, data, error } = e.data;
      
      // Find the corresponding task
      for (const [taskId, task] of tasksRef.current) {
        if (type === `${task.type}_COMPLETE`) {
          task.resolve(data);
          tasksRef.current.delete(taskId);
          break;
        } else if (type === `${task.type}_ERROR`) {
          task.reject(new Error(error));
          tasksRef.current.delete(taskId);
          break;
        }
      }
    };

    workerRef.current.onerror = (error) => {
      console.error('Worker error:', error);
      // Reject all pending tasks
      for (const [taskId, task] of tasksRef.current) {
        task.reject(error);
      }
      tasksRef.current.clear();
    };

    setIsReady(true);

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const executeTask = useCallback((type: string, data: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current || !isReady) {
        reject(new Error('Worker not ready'));
        return;
      }

      const taskId = `${type}_${Date.now()}_${Math.random()}`;
      const task: WorkerTask = { id: taskId, type, data, resolve, reject };
      
      tasksRef.current.set(taskId, task);
      workerRef.current.postMessage({ type, data });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (tasksRef.current.has(taskId)) {
          tasksRef.current.delete(taskId);
          reject(new Error('Task timeout'));
        }
      }, 30000);
    });
  }, [isReady]);

  const processBookings = useCallback((bookings: any[]) => {
    return executeTask('PROCESS_BOOKINGS', bookings);
  }, [executeTask]);

  const calculateAnalytics = useCallback((bookings: any[]) => {
    return executeTask('CALCULATE_ANALYTICS', bookings);
  }, [executeTask]);

  const filterLargeDataset = useCallback((bookings: any[], filters: any) => {
    return executeTask('FILTER_LARGE_DATASET', { bookings, filters });
  }, [executeTask]);

  const sortBookings = useCallback((bookings: any[], sortBy: string, sortOrder: 'asc' | 'desc') => {
    return executeTask('SORT_BOOKINGS', { bookings, sortBy, sortOrder });
  }, [executeTask]);

  return {
    isReady,
    processBookings,
    calculateAnalytics,
    filterLargeDataset,
    sortBookings
  };
};