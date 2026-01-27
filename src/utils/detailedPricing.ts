export interface PricingComponents {
  baseCallOut: number;
  propertySize: number;
  volumeLoad: number;
  wasteType: number;
  accessDifficulty: number;
  urgency: number;
  complianceAddOns: number;
  total: number;
}

export interface PricingOptions {
  propertySize: 'studio' | '2bed' | '3bed' | '4bed';
  volumeLoads: number;
  wasteTypes: string[];
  accessDifficulties: string[];
  urgency: 'standard' | '24h' | 'same-day';
  complianceAddOns: string[];
  furnitureItems?: number;
}

const PRICING_CONFIG = {
  baseCallOut: 250,
  propertySize: {
    studio: 100,
    '2bed': 200,
    '3bed': 350,
    '4bed': 500
  },
  volumeLoad: {
    1: 150,
    2: 300,
    3: 450,
    4: 600
  },
  wasteType: {
    general: 0,
    furniture: 50, // per item
    garden: 100,
    construction: 200,
    hazardous: 300
  },
  accessDifficulty: {
    ground: 0,
    stairs: 100,
    parking: 100,
    distance: 100
  },
  urgency: {
    standard: 0,
    '24h': 150,
    'same-day': 300
  },
  compliance: {
    photos: 50,
    council: 100,
    sanitation: 250
  },
  minimumCharge: 350
};

export const calculateDetailedPrice = (options: PricingOptions): PricingComponents => {
  const baseCallOut = PRICING_CONFIG.baseCallOut;
  const propertySize = PRICING_CONFIG.propertySize[options.propertySize];
  
  let volumeLoad = 0;
  if (options.volumeLoads <= 3) {
    volumeLoad = PRICING_CONFIG.volumeLoad[options.volumeLoads as keyof typeof PRICING_CONFIG.volumeLoad];
  } else {
    volumeLoad = PRICING_CONFIG.volumeLoad[4];
  }
  
  let wasteType = 0;
  options.wasteTypes.forEach(type => {
    if (type === 'furniture' && options.furnitureItems) {
      wasteType += PRICING_CONFIG.wasteType.furniture * options.furnitureItems;
    } else {
      wasteType += PRICING_CONFIG.wasteType[type as keyof typeof PRICING_CONFIG.wasteType] || 0;
    }
  });
  
  let accessDifficulty = 0;
  options.accessDifficulties.forEach(access => {
    accessDifficulty += PRICING_CONFIG.accessDifficulty[access as keyof typeof PRICING_CONFIG.accessDifficulty] || 0;
  });
  
  const urgency = PRICING_CONFIG.urgency[options.urgency];
  
  let complianceAddOns = 0;
  options.complianceAddOns.forEach(addon => {
    complianceAddOns += PRICING_CONFIG.compliance[addon as keyof typeof PRICING_CONFIG.compliance] || 0;
  });
  
  const subtotal = baseCallOut + propertySize + volumeLoad + wasteType + accessDifficulty + urgency + complianceAddOns;
  const total = Math.max(subtotal, PRICING_CONFIG.minimumCharge);
  
  return {
    baseCallOut,
    propertySize,
    volumeLoad,
    wasteType,
    accessDifficulty,
    urgency,
    complianceAddOns,
    total
  };
};

// Legacy compatibility
export interface PriceEstimate {
  basePrice: number;
  slaMultiplier: number;
  slaPremium: number;
  distanceCharge: number;
  vehicleCharge: number;
  subtotal: number;
  vat: number;
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
  
  return { 
    basePrice: estimate.baseCallOut,
    slaMultiplier: 1,
    slaPremium: estimate.urgency,
    distanceCharge: 0,
    vehicleCharge: 0,
    subtotal: estimate.total,
    vat: 0,
    total: estimate.total 
  };
}