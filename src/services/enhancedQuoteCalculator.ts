import { 
  EnhancedBookingData, 
  DetailedQuote, 
  QuoteCalculationFactors, 
  QuoteBreakdownItem,
  VOLUME_ESTIMATES,
  URGENCY_MULTIPLIERS,
  ACCESS_DIFFICULTY_SCORES
} from '../types/enhancedBooking';

export class EnhancedQuoteCalculator {
  private static readonly BASE_RATES = {
    'house-clearance': 150,
    'office-move': 200,
    'packing-service': 100,
    'storage': 80,
    'emergency-clearance': 180
  };

  private static readonly VOLUME_RATES = {
    'small-van': 50,
    'large-van': 80,
    'small-truck': 120,
    'large-truck': 180,
    'multiple-trips': 250
  };

  private static readonly SPECIAL_ITEM_CHARGES = {
    heavyItems: 75,
    fragileItems: 50,
    hazardousItems: 100
  };

  private static readonly ADDITIONAL_SERVICE_RATES = {
    packingRequired: 120,
    storageRequired: 80
  };

  static calculateQuote(bookingData: EnhancedBookingData): DetailedQuote {
    const factors = this.calculateFactors(bookingData);
    const breakdown = this.generateBreakdown(bookingData, factors);
    const totalPrice = breakdown.reduce((sum, item) => sum + item.total, 0);

    return {
      id: this.generateQuoteId(),
      bookingData,
      calculationFactors: factors,
      breakdown,
      totalPrice: Math.round(totalPrice * 100) / 100,
      validUntil: this.getValidUntilDate(),
      estimatedDuration: this.calculateDuration(bookingData),
      crewSize: this.calculateCrewSize(bookingData),
      vehicleType: this.getVehicleType(bookingData.serviceRequirements.estimatedVolume),
      additionalServices: this.getAdditionalServices(bookingData),
      terms: this.getTermsAndConditions(bookingData),
      createdAt: new Date().toISOString()
    };
  }

  private static calculateFactors(bookingData: EnhancedBookingData): QuoteCalculationFactors {
    const { serviceRequirements, propertyDetails } = bookingData;
    
    const basePrice = this.BASE_RATES[serviceRequirements.serviceType];
    const volumeMultiplier = this.VOLUME_RATES[serviceRequirements.estimatedVolume];
    const urgencyMultiplier = URGENCY_MULTIPLIERS[serviceRequirements.urgency];
    
    // Calculate access difficulty
    let accessDifficulty = ACCESS_DIFFICULTY_SCORES[propertyDetails.parkingAccess];
    if (propertyDetails.floors > 1 && !propertyDetails.hasElevator) {
      accessDifficulty *= (1 + (propertyDetails.floors - 1) * 0.15);
    }

    // Calculate special items charge
    let specialItemsCharge = 0;
    if (serviceRequirements.heavyItems) specialItemsCharge += this.SPECIAL_ITEM_CHARGES.heavyItems;
    if (serviceRequirements.fragileItems) specialItemsCharge += this.SPECIAL_ITEM_CHARGES.fragileItems;
    if (serviceRequirements.hazardousItems) specialItemsCharge += this.SPECIAL_ITEM_CHARGES.hazardousItems;

    // Calculate additional services
    const packingServiceCharge = serviceRequirements.packingRequired ? 
      this.ADDITIONAL_SERVICE_RATES.packingRequired : 0;
    const storageServiceCharge = serviceRequirements.storageRequired ? 
      this.ADDITIONAL_SERVICE_RATES.storageRequired : 0;

    // Calculate distance charge (simplified - would integrate with mapping service)
    const distanceCharge = bookingData.deliveryAddress ? 50 : 0;

    return {
      basePrice,
      volumeMultiplier,
      urgencyMultiplier,
      accessDifficulty,
      specialItemsCharge,
      packingServiceCharge,
      storageServiceCharge,
      distanceCharge
    };
  }

  private static generateBreakdown(
    bookingData: EnhancedBookingData, 
    factors: QuoteCalculationFactors
  ): QuoteBreakdownItem[] {
    const breakdown: QuoteBreakdownItem[] = [];

    // Base service charge
    breakdown.push({
      id: 'base-service',
      description: `${this.formatServiceType(bookingData.serviceRequirements.serviceType)} - Base Service`,
      category: 'base',
      quantity: 1,
      unitPrice: factors.basePrice,
      total: factors.basePrice
    });

    // Volume charge
    const volumeDescription = VOLUME_ESTIMATES[bookingData.serviceRequirements.estimatedVolume].description;
    breakdown.push({
      id: 'volume-charge',
      description: `Volume Charge - ${volumeDescription}`,
      category: 'volume',
      quantity: 1,
      unitPrice: factors.volumeMultiplier,
      total: factors.volumeMultiplier
    });

    // Urgency surcharge
    if (factors.urgencyMultiplier > 1) {
      const urgencyCharge = (factors.basePrice + factors.volumeMultiplier) * (factors.urgencyMultiplier - 1);
      breakdown.push({
        id: 'urgency-charge',
        description: `${this.formatUrgency(bookingData.serviceRequirements.urgency)} Service Surcharge`,
        category: 'urgency',
        quantity: 1,
        unitPrice: urgencyCharge,
        total: urgencyCharge
      });
    }

    // Access difficulty charge
    if (factors.accessDifficulty > 1) {
      const accessCharge = factors.basePrice * (factors.accessDifficulty - 1);
      breakdown.push({
        id: 'access-charge',
        description: 'Access Difficulty Charge',
        category: 'access',
        quantity: 1,
        unitPrice: accessCharge,
        total: accessCharge,
        notes: this.getAccessNotes(bookingData.propertyDetails)
      });
    }

    // Special items charges
    if (factors.specialItemsCharge > 0) {
      const specialItems = [];
      if (bookingData.serviceRequirements.heavyItems) specialItems.push('Heavy Items');
      if (bookingData.serviceRequirements.fragileItems) specialItems.push('Fragile Items');
      if (bookingData.serviceRequirements.hazardousItems) specialItems.push('Hazardous Items');

      breakdown.push({
        id: 'special-items',
        description: `Special Items Handling - ${specialItems.join(', ')}`,
        category: 'special-items',
        quantity: 1,
        unitPrice: factors.specialItemsCharge,
        total: factors.specialItemsCharge
      });
    }

    // Packing service
    if (factors.packingServiceCharge > 0) {
      breakdown.push({
        id: 'packing-service',
        description: 'Professional Packing Service',
        category: 'packing',
        quantity: 1,
        unitPrice: factors.packingServiceCharge,
        total: factors.packingServiceCharge
      });
    }

    // Storage service
    if (factors.storageServiceCharge > 0) {
      breakdown.push({
        id: 'storage-service',
        description: 'Storage Service (first month)',
        category: 'storage',
        quantity: 1,
        unitPrice: factors.storageServiceCharge,
        total: factors.storageServiceCharge
      });
    }

    // Distance charge
    if (factors.distanceCharge > 0) {
      breakdown.push({
        id: 'distance-charge',
        description: 'Additional Location Charge',
        category: 'distance',
        quantity: 1,
        unitPrice: factors.distanceCharge,
        total: factors.distanceCharge
      });
    }

    // Apply discounts for flexible dates
    if (bookingData.bookingDetails.flexibleDates) {
      const discountAmount = breakdown.reduce((sum, item) => sum + item.total, 0) * 0.1;
      breakdown.push({
        id: 'flexible-discount',
        description: 'Flexible Dates Discount (10%)',
        category: 'discount',
        quantity: 1,
        unitPrice: -discountAmount,
        total: -discountAmount
      });
    }

    return breakdown;
  }

  private static calculateDuration(bookingData: EnhancedBookingData): string {
    const { serviceRequirements, propertyDetails } = bookingData;
    
    let baseHours = 4; // Default base time
    
    // Adjust based on volume
    const volumeMultipliers = {
      'small-van': 1,
      'large-van': 1.5,
      'small-truck': 2,
      'large-truck': 3,
      'multiple-trips': 4
    };
    
    baseHours *= volumeMultipliers[serviceRequirements.estimatedVolume];
    
    // Adjust for property complexity
    if (propertyDetails.floors > 1 && !propertyDetails.hasElevator) {
      baseHours *= 1.3;
    }
    
    // Adjust for special items
    if (serviceRequirements.heavyItems || serviceRequirements.fragileItems) {
      baseHours *= 1.2;
    }
    
    // Adjust for packing
    if (serviceRequirements.packingRequired) {
      baseHours *= 1.5;
    }
    
    const totalHours = Math.ceil(baseHours);
    return totalHours <= 8 ? `${totalHours} hours` : `${Math.ceil(totalHours / 8)} days`;
  }

  private static calculateCrewSize(bookingData: EnhancedBookingData): number {
    const { serviceRequirements } = bookingData;
    
    const crewSizes = {
      'small-van': 2,
      'large-van': 2,
      'small-truck': 3,
      'large-truck': 4,
      'multiple-trips': 4
    };
    
    let crewSize = crewSizes[serviceRequirements.estimatedVolume];
    
    if (serviceRequirements.heavyItems || serviceRequirements.fragileItems) {
      crewSize = Math.max(crewSize, 3);
    }
    
    return crewSize;
  }

  private static getVehicleType(volume: string): string {
    const vehicleTypes = {
      'small-van': 'Small Van (Transit)',
      'large-van': 'Large Van (Luton)',
      'small-truck': '7.5T Truck',
      'large-truck': '18T Truck',
      'multiple-trips': 'Multiple Vehicles'
    };
    
    return vehicleTypes[volume];
  }

  private static getAdditionalServices(bookingData: EnhancedBookingData): string[] {
    const services = [];
    
    if (bookingData.serviceRequirements.packingRequired) {
      services.push('Professional Packing');
    }
    
    if (bookingData.serviceRequirements.storageRequired) {
      services.push('Secure Storage');
    }
    
    if (bookingData.serviceRequirements.fragileItems) {
      services.push('Specialist Fragile Item Handling');
    }
    
    if (bookingData.serviceRequirements.hazardousItems) {
      services.push('Hazardous Item Disposal');
    }
    
    return services;
  }

  private static getTermsAndConditions(bookingData: EnhancedBookingData): string[] {
    const terms = [
      'Quote valid for 14 days from issue date',
      'Final price may vary based on actual volume and complexity',
      '50% deposit required to confirm booking',
      'Full payment due on completion',
      'Cancellation policy applies'
    ];
    
    if (bookingData.serviceRequirements.urgency === 'emergency') {
      terms.push('Emergency service surcharge applies');
      terms.push('Subject to crew availability');
    }
    
    if (bookingData.serviceRequirements.hazardousItems) {
      terms.push('Hazardous items subject to additional disposal fees');
      terms.push('Customer responsible for declaring all hazardous materials');
    }
    
    return terms;
  }

  private static formatServiceType(serviceType: string): string {
    return serviceType.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  private static formatUrgency(urgency: string): string {
    return urgency.charAt(0).toUpperCase() + urgency.slice(1);
  }

  private static getAccessNotes(propertyDetails: any): string {
    const notes = [];
    
    if (propertyDetails.parkingAccess !== 'direct') {
      notes.push(`${propertyDetails.parkingAccess.replace('-', ' ')} parking`);
    }
    
    if (propertyDetails.floors > 1 && !propertyDetails.hasElevator) {
      notes.push(`${propertyDetails.floors} floors without elevator`);
    }
    
    if (propertyDetails.accessRestrictions) {
      notes.push('Access restrictions noted');
    }
    
    return notes.join(', ');
  }

  private static generateQuoteId(): string {
    return 'QTE-' + Date.now().toString(36).toUpperCase() + 
           Math.random().toString(36).substr(2, 4).toUpperCase();
  }

  private static getValidUntilDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString();
  }
}