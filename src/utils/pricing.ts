import { calculateDetailedPrice } from './detailedPricing';

// Legacy compatibility - redirects to detailed pricing
export interface PriceEstimate {
  total: number;
}

export function calculatePrice(
  serviceType: string, 
  slaType: string, 
  distance: number = 0, 
  vehicleType: string = 'small-van'
): PriceEstimate {
  const urgency = slaType === '24h' ? '24h' : slaType === 'same-day' ? 'same-day' : 'standard';
  
  const estimate = calculateDetailedPrice({
    propertySize: '2bed',
    volumeLoads: 2,
    wasteTypes: ['general'],
    accessDifficulties: ['ground'],
    urgency: urgency as any,
    complianceAddOns: ['photos']
  });
  
  return { total: estimate.total };
}
