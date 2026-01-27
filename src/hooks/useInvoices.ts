import { useQuery, useMutation } from '@tanstack/react-query';
import { getInvoices, downloadInvoice } from '../services/api';

export const useInvoices = () => {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const response = await getInvoices();
      if (response.success) {
        return response.data || [];
      }
      throw new Error(response.error || 'Failed to fetch invoices');
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

export const useDownloadInvoice = () => {
  return useMutation({
    mutationFn: (jobIdOrUrl: string) => downloadInvoice(jobIdOrUrl),
  });
};