import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Home, Package, Camera, Calendar, User, Truck } from 'lucide-react';

// Step Components (to be created)
import { PropertyStep } from '../components/booking/PropertyStep';
import { WasteStep } from '../components/booking/WasteStep';
import { AccessStep } from '../components/booking/AccessStep';
import { PhotoStep } from '../components/booking/PhotoStep';
import { ScheduleStep } from '../components/booking/ScheduleStep';
import { ContactStep } from '../components/booking/ContactStep';
import { SubmittedStep } from '../components/booking/SubmittedStep';

interface DraftBooking {
  id?: string;
  sessionId: string;
  requestType: string;
  propertyAddress: string;
  postcode: string;
  propertyType: string;
  propertySize: string;
  floor?: string;
  lift?: boolean;
  parkingRestrictions?: string;
  vanLoads: string;
  wasteTypes: string[];
  volumeEstimate: number;
  accessConstraints: string[];
  photos: any[];
  preferredDates: string[];
  preferredTime: string;
  urgencyLevel: 'standard' | 'urgent' | 'emergency';
  contactDetails: {
    name: string;
    email: string;
    phone: string;
    alternatePhone?: string;
    preferredContact?: 'phone' | 'email' | 'sms';
  };
  specialInstructions: string;
  accessInstructions: string;
  serviceType: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  scheduledDate: string;
  timeConstraints?: string;
  flexibleDates: boolean;
  alternativeDates: string[];
  budget?: string;
  heavyItems: boolean;
  fragileItems: boolean;
  hazardousItems: boolean;
  packingRequired: boolean;
  storageRequired: boolean;
  itemCategories: string[];
  estimatedVolume: 'small-van' | 'large-van' | 'small-truck' | 'large-truck' | 'multiple-trips';
  floors: number;
  hasElevator: boolean;
  parkingAccess: 'direct' | 'short-walk' | 'long-walk' | 'no-parking';
  accessRestrictions: string;
  notes?: string;
}

const steps = [
  { id: 'start', path: '/booking/start', title: 'Get Started', icon: Home, component: PropertyStep },
  { id: 'property', path: '/booking/property', title: 'Property Details', icon: Home, component: PropertyStep },
  { id: 'waste', path: '/booking/waste', title: 'Waste Assessment', icon: Package, component: WasteStep },
  { id: 'access', path: '/booking/access', title: 'Access & Constraints', icon: Truck, component: AccessStep },
  { id: 'photos', path: '/booking/photos', title: 'Photo Upload', icon: Camera, component: PhotoStep },
  { id: 'schedule', path: '/booking/schedule', title: 'Schedule Preferences', icon: Calendar, component: ScheduleStep },
  { id: 'contact', path: '/booking/contact', title: 'Contact & Auth', icon: User, component: ContactStep },
  { id: 'submitted', path: '/booking/submitted', title: 'Confirmation', icon: CheckCircle, component: SubmittedStep }
];

export const BookingWizard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [draftBooking, setDraftBooking] = useState<DraftBooking>({
    sessionId: Date.now().toString(),
    requestType: '',
    propertyAddress: '',
    postcode: '',
    propertyType: '',
    propertySize: '',
    floor: '',
    lift: false,
    parkingRestrictions: '',
    vanLoads: '',
    wasteTypes: [],
    volumeEstimate: 1,
    accessConstraints: [],
    photos: [],
    preferredDates: [],
    preferredTime: '',
    urgencyLevel: 'standard',
    contactDetails: {
      name: '',
      email: '',
      phone: '',
      alternatePhone: '',
      preferredContact: 'email'
    },
    specialInstructions: '',
    accessInstructions: '',
    serviceType: searchParams.get('service') || '',
    pickupAddress: '',
    deliveryAddress: '',
    scheduledDate: '',
    timeConstraints: '',
    flexibleDates: false,
    alternativeDates: [],
    budget: '',
    heavyItems: false,
    fragileItems: false,
    hazardousItems: false,
    packingRequired: false,
    storageRequired: false,
    itemCategories: [],
    estimatedVolume: 'small-van',
    floors: 1,
    hasElevator: false,
    parkingAccess: 'direct',
    accessRestrictions: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine current step based on URL
  useEffect(() => {
    const currentPath = location.pathname;
    const stepIndex = steps.findIndex(step => step.path === currentPath);
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex);
    } else if (currentPath === '/booking/start' || currentPath === '/booking') {
      setCurrentStep(0);
      navigate('/booking/property');
    }
  }, [location.pathname, navigate]);

  // Load draft from localStorage on mount with validation
  useEffect(() => {
    const savedDraft = localStorage.getItem('bookingDraft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        // Validate and merge with defaults to prevent undefined fields
        const validatedDraft = {
          ...draftBooking,
          ...parsed,
          // Ensure critical fields are never undefined
          sessionId: parsed.sessionId || Date.now().toString(),
          contactDetails: {
            ...draftBooking.contactDetails,
            ...parsed.contactDetails
          },
          wasteTypes: Array.isArray(parsed.wasteTypes) ? parsed.wasteTypes : [],
          accessConstraints: Array.isArray(parsed.accessConstraints) ? parsed.accessConstraints : [],
          photos: Array.isArray(parsed.photos) ? parsed.photos : [],
          preferredDates: Array.isArray(parsed.preferredDates) ? parsed.preferredDates : [],
          alternativeDates: Array.isArray(parsed.alternativeDates) ? parsed.alternativeDates : [],
          itemCategories: Array.isArray(parsed.itemCategories) ? parsed.itemCategories : []
        };
        setDraftBooking(validatedDraft);
      } catch (error) {
        console.error('Failed to load draft booking:', error);
        // Keep safe defaults if parsing fails
      }
    }
  }, []);

  // Save draft to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bookingDraft', JSON.stringify(draftBooking));
  }, [draftBooking]);

  const updateDraftBooking = (updates: Partial<DraftBooking>) => {
    setDraftBooking(prev => {
      const updated = { ...prev, ...updates };
      // Immediate persistence to prevent data loss
      try {
        localStorage.setItem('bookingDraft', JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save draft:', error);
      }
      return updated;
    });
  };

  const canProceedToNextStep = () => {
    const step = steps[currentStep];
    if (!step) return false;

    switch (step.id) {
      case 'property':
        return !!(draftBooking.propertyAddress && draftBooking.propertyType && draftBooking.propertySize);
      case 'waste':
        return !!(draftBooking.wasteTypes.length > 0 && draftBooking.estimatedVolume);
      case 'access':
        return !!(draftBooking.parkingAccess);
      case 'photos':
        return true; // Photos optional
      case 'schedule':
        return !!(draftBooking.scheduledDate && draftBooking.preferredTime);
      case 'contact':
        return !!(draftBooking.contactDetails.name && draftBooking.contactDetails.email && draftBooking.contactDetails.phone);
      default:
        return true;
    }
  };

  const goToNextStep = () => {
    if (!canProceedToNextStep()) {
      alert('Please complete all required fields before proceeding.');
      return;
    }
    
    if (currentStep < steps.length - 1) {
      const nextStep = steps[currentStep + 1];
      navigate(nextStep.path);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      const prevStep = steps[currentStep - 1];
      navigate(prevStep.path);
    }
  };

  const goToStep = (stepIndex: number) => {
    // Prevent skipping ahead without completing previous steps
    if (stepIndex > currentStep + 1) {
      alert('Please complete the current step before proceeding.');
      return;
    }
    
    if (stepIndex >= 0 && stepIndex < steps.length) {
      navigate(steps[stepIndex].path);
    }
  };

  const submitBooking = async () => {
    setIsSubmitting(true);
    try {
      // Here you would make API call to convert draft to real booking
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear draft from localStorage
      localStorage.removeItem('bookingDraft');
      
      // Navigate to submitted step
      navigate('/booking/submitted');
    } catch (error) {
      console.error('Failed to submit booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ProgressIndicator = () => (
    <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {steps.slice(1, -1).map((step, index) => {
            const stepIndex = index + 1;
            const isActive = stepIndex === currentStep;
            const isCompleted = stepIndex < currentStep;
            const isAccessible = stepIndex <= currentStep + 1;

            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => isAccessible ? goToStep(stepIndex) : null}
                  disabled={!isAccessible}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : isCompleted 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : isAccessible
                          ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                          : 'bg-white/5 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <step.icon size={18} />
                  <span className="hidden md:block text-sm font-medium">{step.title}</span>
                  {isCompleted && <CheckCircle size={16} />}
                </button>
                {index < steps.length - 3 && (
                  <div className={`w-8 h-0.5 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-white/20'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const BookingLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Truck size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">UK Packers</h1>
              <p className="text-sm text-gray-400">Property Clearance Booking</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-gray-400 hover:text-white transition"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Progress Indicator */}
      <ProgressIndicator />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <div className="flex justify-between mt-8 pt-8 border-t border-white/10">
            <button
              onClick={goToPreviousStep}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all"
            >
              <ArrowLeft size={20} />
              Previous
            </button>
            
            {currentStep === steps.length - 2 ? (
              <button
                onClick={submitBooking}
                disabled={isSubmitting || !canProceedToNextStep()}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all ${
                  canProceedToNextStep() && !isSubmitting
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg'
                    : 'bg-gray-500 cursor-not-allowed opacity-50'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Booking'}
                <ArrowRight size={20} />
              </button>
            ) : (
              <button
                onClick={goToNextStep}
                disabled={!canProceedToNextStep()}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                  canProceedToNextStep()
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg'
                    : 'bg-gray-500 cursor-not-allowed opacity-50'
                }`}
              >
                Next
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <BookingLayout>
      <Routes>
        <Route path="/start" element={<PropertyStep data={draftBooking} onUpdate={updateDraftBooking} onNext={goToNextStep} />} />
        <Route path="/property" element={<PropertyStep data={draftBooking} onUpdate={updateDraftBooking} onNext={goToNextStep} />} />
        <Route path="/waste" element={<WasteStep draftBooking={draftBooking} updateDraftBooking={updateDraftBooking} onNext={goToNextStep} />} />
        <Route path="/access" element={<AccessStep draftBooking={draftBooking} updateDraftBooking={updateDraftBooking} onNext={goToNextStep} />} />
        <Route path="/photos" element={<PhotoStep draftBooking={draftBooking} updateDraftBooking={updateDraftBooking} onNext={goToNextStep} />} />
        <Route path="/schedule" element={<ScheduleStep draftBooking={draftBooking} updateDraftBooking={updateDraftBooking} onNext={goToNextStep} />} />
        <Route path="/contact" element={<ContactStep draftBooking={draftBooking} updateDraftBooking={updateDraftBooking} onSubmit={submitBooking} />} />
        <Route path="/submitted" element={<SubmittedStep draftBooking={draftBooking} />} />
      </Routes>
    </BookingLayout>
  );
};