export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
};

export const calculateSLARemaining = (deadline: string): string => {
  const now = new Date();
  const end = new Date(deadline);
  const diff = end.getTime() - now.getTime();

  if (diff < 0) return 'Overdue';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours < 24) {
    return `${hours}h ${minutes}m`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return `${days}d ${remainingHours}h`;
};

export const getSLAStatus = (deadline: string): 'safe' | 'warning' | 'critical' => {
  const now = new Date();
  const end = new Date(deadline);
  const diff = end.getTime() - now.getTime();
  const hours = diff / (1000 * 60 * 60);

  if (hours < 0) return 'critical';
  if (hours < 6) return 'critical';
  if (hours < 12) return 'warning';
  return 'safe';
};
