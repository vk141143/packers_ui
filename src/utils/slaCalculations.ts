// SLA calculations
export const calculateSLADeadline = (startTime: string, slaType: string): string => {
  const start = new Date(startTime);
  const hours = slaType === '24h' ? 24 : slaType === '48h' ? 48 : 72;
  return new Date(start.getTime() + hours * 60 * 60 * 1000).toISOString();
};

export const calculateResponseTime = (createdAt: string, dispatchedAt: string): number => {
  return Math.round((new Date(dispatchedAt).getTime() - new Date(createdAt).getTime()) / (1000 * 60));
};

export const calculateCompletionTime = (startedAt: string, completedAt: string): number => {
  return Math.round((new Date(completedAt).getTime() - new Date(startedAt).getTime()) / (1000 * 60));
};

export const isSLABreached = (deadline: string, completedAt: string): boolean => {
  return new Date(completedAt) > new Date(deadline);
};
