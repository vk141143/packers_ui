export interface WasteQuoteRequest {
  id: string;
  clientInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  propertyDetails: {
    size: 'small' | 'medium' | 'large' | 'commercial';
    type: 'residential' | 'commercial' | 'industrial';
    accessType: 'easy' | 'moderate' | 'difficult';
  };
  wasteTypes: string[];
  photos: File[];
  notes: string;
  status: 'pending' | 'ai_processing' | 'ops_review' | 'quoted' | 'accepted' | 'deposit_pending' | 'scheduled' | 'in_progress' | 'completed' | 'invoiced';
  createdAt: Date;
}

export interface AIEstimate {
  vanLoads: number;
  riskFlags: {
    hoarder: boolean;
    hazardous: boolean;
    accessDifficult: boolean;
  };
  suggestedPriceRange: {
    min: number;
    max: number;
  };
}

export interface FinalQuote {
  id: string;
  requestId: string;
  finalPrice: number;
  depositAmount: number;
  scopeOfWork: string;
  timeline: string;
  terms: string;
  createdAt: Date;
}

export interface WasteJob {
  id: string;
  quoteId: string;
  crewId: string;
  scheduledDate: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'verified';
  proofPhotos: string[];
  notes: string;
}