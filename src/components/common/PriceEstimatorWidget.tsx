import React, { useState, useRef, useEffect } from 'react';
import { PoundSterling, Calculator, ArrowRight, X, Package, AlertCircle, Truck, CheckCircle, MapPin, Calendar, Clock, Upload, Image as ImageIcon, Sparkles, Check } from 'lucide-react';
import { calculatePrice } from '../../utils/pricing';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';
import { jobStore } from '../../store/jobStore';
import { Job } from '../../types';
import { getChecklistForServiceType } from '../../utils/checklistHelpers';
import { Confetti, type ConfettiRef } from './Confetti';
import { AddressInput } from './AddressInput';
import { bookJob } from '../../services/api';
import { PaymentModal } from './PaymentModal';
import { PaymentSuccess } from './PaymentSuccess';

export const PriceEstimatorWidget: React.FC = () => {
  const navigate = useNavigate();
  const confettiRef = useRef<ConfettiRef>(null);
  const [showModal, setShowModal] = useState(false);
  const [serviceType, setServiceType] = useState('');
  const [slaType, setSlaType] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [vehicleType, setVehicleType] = useState('small-van');
  const [propertySize, setPropertySize] = useState('2bed');
  const [volumeLoads, setVolumeLoads] = useState(2);
  const [wasteTypes, setWasteTypes] = useState(['general']);
  const [accessDifficulties, setAccessDifficulties] = useState(['ground']);
  const [complianceAddOns, setComplianceAddOns] = useState(['photos']);
  const [furnitureItems, setFurnitureItems] = useState(0);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);
  const [countingPrice, setCountingPrice] = useState(0);
  const [showPriceEstimate, setShowPriceEstimate] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        const mappedServices = data.map((service: any) => ({
          id: service.name.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-'),
          name: service.name,
          icon: service.name === 'Emergency' ? AlertCircle : service.name === 'Void Property' ? Package : service.name === 'Hoarder Clean' ? Truck : AlertCircle,
          desc: service.description.split(' ').slice(0, 2).join(' '),
          img: service.name === 'Emergency' ? 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=200&fit=crop' :
               service.name === 'Void Property' ? 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop' :
               service.name === 'Hoarder Clean' ? 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=400&h=200&fit=crop' :
               'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop'
        }));
        setServices(mappedServices);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const price = serviceType && slaType ? calculatePrice(serviceType, slaType, 0, vehicleType) : null;

  const handleClose = () => {
    setShowModal(false);
    setServiceType('');
    setSlaType('');
    setPickupAddress('');
    setDate('');
    setTime('');
    setVehicleType('small-van');
    setUploadedPhotos([]);
    setShowSuccess(false);
    setShowPayment(false);
    setPaymentData(null);
    setShowPaymentSuccess(false);
    setAnimationStage(0);
    setShowPriceEstimate(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedPhotos([...uploadedPhotos, ...Array.from(e.target.files)]);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Camera access denied. Please allow camera permission.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      // Wait for video to be ready
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        alert('Camera not ready. Please wait a moment and try again.');
        return;
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setUploadedPhotos(prev => [...prev, file]);
            setShowCameraModal(false);
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== index));
  };

  const handleGeneratePriceEstimate = () => {
    setShowPriceEstimate(true);
    setAnimationStage(1);
    setCountingPrice(0);

    setTimeout(() => setAnimationStage(2), 1500);
    setTimeout(() => {
      setAnimationStage(3);
      const totalPrice = price!.total;
      const duration = 2000;
      const steps = 50;
      const increment = totalPrice / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= totalPrice) {
          setCountingPrice(totalPrice);
          clearInterval(interval);
        } else {
          setCountingPrice(Math.floor(current));
        }
      }, duration / steps);
    }, 2500);
    setTimeout(() => {
      setAnimationStage(4);
      confettiRef.current?.fire({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }, 4500);
  };

  const handleBookNow = () => {
    if (!price || !pickupAddress || !date || !time) {
      console.log('Missing required fields:', { price, pickupAddress, date, time });
      return;
    }
    // Skip payment modal and go directly to booking confirmation
    confirmBooking({ status: 'pending', method: null, paidAt: null });
  };

  const handlePaymentSuccess = async (payment: any) => {
    setPaymentData(payment);
    setShowPayment(false);
    setShowPaymentSuccess(true);
    
    // Wait for payment success animation, then confirm booking
    setTimeout(async () => {
      await confirmBooking(payment);
    }, 3000);
  };

  const confirmBooking = async (payment: any) => {
    if (!price || !pickupAddress || !date || !time) {
      console.log('Missing required fields:', { price, pickupAddress, date, time });
      return;
    }

    console.log('Booking with data:', {
      serviceType,
      slaType,
      propertySize,
      volumeLoads,
      wasteTypes,
      furnitureItems,
      pickupAddress,
      date,
      time,
      price: price.total,
      payment
    });

    // Call API to book job
    const apiPayload = {
      service_type: serviceType === 'emergency-clearance' ? '1' : 
                    serviceType === 'void-turnover' ? '2' : 
                    serviceType === 'hoarder-clearout' ? '3' : '4',
      service_level: slaType === '24h' ? 'e9ea1a7b-a043-4acb-a8f8-0ecd5854174c' : 
                     slaType === '48h' ? 'e9ea1a7b-a043-4acb-a8f8-0ecd5854174c' : 
                     'e9ea1a7b-a043-4acb-a8f8-0ecd5854174c',
      property_size: propertySize || '2bed',
      van_loads: volumeLoads || 2,
      waste_types: wasteTypes.join(',') || 'general',
      furniture_items: furnitureItems || 0,
      property_address: pickupAddress || 'Unknown',
      scheduled_date: date ? new Date(date).toLocaleDateString('en-GB').replace(/\//g, '-') : '',
      scheduled_time: time || '',
      price: price?.total || 0,
      additional_notes: `Vehicle: ${vehicleType}` || '',
    };

    console.log('API Payload:', apiPayload);

    // Validate required fields
    if (!apiPayload.service_type || !apiPayload.service_level || !apiPayload.property_address || !apiPayload.scheduled_date || !apiPayload.scheduled_time) {
      console.error('Missing required fields:', apiPayload);
      alert('Please fill all required fields');
      return;
    }

    const apiResponse = await bookJob(apiPayload);
    
    console.log('API Response:', apiResponse);
    
    if (!apiResponse.success) {
      alert(`Failed to book job: ${apiResponse.error}`);
      return;
    }

    const jobId = apiResponse.data?.id || 'JOB-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const scheduledDateTime = new Date(`${date}T${time}`);
    const slaHours = slaType === '24h' ? 24 : slaType === '48h' ? 48 : 168;
    const slaDeadline = new Date(scheduledDateTime.getTime() + slaHours * 60 * 60 * 1000);

    const photoUrls = uploadedPhotos.map(photo => ({
      id: Date.now().toString() + Math.random(),
      url: URL.createObjectURL(photo),
      type: 'before' as const,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Client'
    }));

    const newJob: Job = {
      id: jobId,
      immutableReferenceId: `UK-PROP-${new Date().getFullYear()}-${jobId}-${serviceType.substring(0, 4).toUpperCase()}`,
      clientName: 'Current Client',
      clientId: '1',
      clientType: 'council',
      serviceType: serviceType as any,
      propertyAddress: pickupAddress,
      pickupAddress: pickupAddress,
      scheduledDate: scheduledDateTime.toISOString(),
      status: 'pending-admin-review',
      lifecycleState: 'created',
      slaType: slaType as any,
      slaDeadline: slaDeadline.toISOString(),
      slaBreached: false,
      estimatedValue: price.total,
      notes: `Vehicle: ${vehicleType}`,
      urgency: slaType === '24h' ? 'emergency' : 'standard',
      proofRequired: true,
      createdAt: new Date().toISOString(),
      photos: photoUrls.length > 0 ? photoUrls : undefined,
      checklist: getChecklistForServiceType(serviceType as any),
      accessMethod: 'keys',
      occupancyStatus: 'void',
      riskFlags: [],
      jobSize: 'M',
      propertyType: 'flat',
      paymentStatus: 'pending',
      paymentMethod: null,
      paidAt: null,
    };

    jobStore.addJob(newJob);
    setShowPaymentSuccess(false);
    setShowSuccess(true);
  };

  return (
    <>
      <Confetti ref={confettiRef} className="fixed inset-0 pointer-events-none z-50" manualstart />
      <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
        <Card className="h-full cursor-pointer border-0 text-gray-900 overflow-hidden bg-gradient-to-br from-green-600 to-green-700" onClick={() => setShowModal(true)}>
          <CardContent className="p-6">
            <Calculator className="h-8 w-8 mb-4 text-white" strokeWidth={2} />
            <h3 className="font-semibold text-lg mb-2 text-white">Quick Price Estimate</h3>
            <p className="text-sm text-white/90">Get instant quote</p>
          </CardContent>
        </Card>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-4xl w-full shadow-2xl relative my-8"
          >
            <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-3 rounded-lg">
                <Calculator size={28} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Price Estimate</h3>
                <p className="text-sm text-gray-600">Select service and get instant quote</p>
              </div>
            </div>

            {/* Step 1: Service Type Selection */}
            {!serviceType && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Service Type</h4>
                {loadingServices ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading services...</p>
                  </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => {
                    const Icon = service.icon;
                    return (
                      <div
                        key={service.id}
                        onClick={() => setServiceType(service.id)}
                        className="relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
                      >
                        <img 
                          src={service.img} 
                          alt={service.name}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon size={20} />
                            <h4 className="font-semibold">{service.name}</h4>
                          </div>
                          <p className="text-sm text-gray-200">{service.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                )}
              </div>
            )}

            {/* Step 2: SLA Selection */}
            {serviceType && !slaType && (
              <div>
                <button onClick={() => setServiceType('')} className="text-sm text-blue-600 hover:text-blue-700 mb-4">
                  ← Back to Service Type
                </button>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600">Selected Service</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {services.find(s => s.id === serviceType)?.name}
                  </p>
                </div>

                <h4 className="text-lg font-semibold text-gray-900 mb-4">Select SLA Type</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: '24h', label: '24 Hour Emergency', multiplier: '+40%', desc: 'Urgent response', color: 'red' },
                    { value: '48h', label: '48 Hour Standard', multiplier: 'Standard', desc: 'Regular service', color: 'blue' },
                    { value: 'standard', label: 'Standard (5-7 Days)', multiplier: '-20%', desc: 'Economy option', color: 'green' },
                  ].map((sla) => {
                    return (
                      <div
                        key={sla.value}
                        onClick={() => setSlaType(sla.value)}
                        className={`p-6 border-2 rounded-xl cursor-pointer transition-all hover:scale-105 hover:shadow-xl ${
                          sla.color === 'red' ? 'border-red-200 hover:border-red-500 hover:bg-red-50' :
                          sla.color === 'blue' ? 'border-blue-200 hover:border-blue-500 hover:bg-blue-50' :
                          'border-green-200 hover:border-green-500 hover:bg-green-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-bold text-gray-900 text-base mb-1">{sla.label}</p>
                            <p className="text-xs text-gray-600">{sla.desc}</p>
                          </div>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            sla.color === 'red' ? 'bg-red-100 text-red-700' :
                            sla.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {sla.multiplier}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Booking Details Form */}
            {serviceType && slaType && price && !showPriceEstimate && (
              <div>
                <button onClick={() => setSlaType('')} className="text-sm text-blue-600 hover:text-blue-700 mb-4">
                  ← Back to SLA Type
                </button>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h4>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin size={16} className="text-blue-600" />
                      Property Address
                    </label>
                    <input
                      type="text"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      placeholder="Enter full property address"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar size={16} className="text-blue-600" />
                        Date
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Clock size={16} className="text-blue-600" />
                        Time
                      </label>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Truck size={16} className="text-blue-600" />
                      Property Size
                    </label>
                    <select
                      value={propertySize}
                      onChange={(e) => setPropertySize(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="studio">Studio / 1-bed flat</option>
                      <option value="2bed">2-bed flat</option>
                      <option value="3bed">3-bed house</option>
                      <option value="4bed">4+ bed house</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Truck size={16} className="text-blue-600" />
                      Van Loads
                    </label>
                    <select
                      value={volumeLoads}
                      onChange={(e) => setVolumeLoads(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value={1}>1 van load</option>
                      <option value={2}>2 van loads</option>
                      <option value={3}>3 van loads</option>
                      <option value={4}>4+ van loads</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Waste Types</label>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {[
                        { id: 'general', label: 'General waste' },
                        { id: 'furniture', label: 'Furniture/appliances' },
                        { id: 'garden', label: 'Garden waste' },
                        { id: 'hazardous', label: 'Hazardous waste' }
                      ].map(waste => (
                        <label key={waste.id} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={wasteTypes.includes(waste.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setWasteTypes([...wasteTypes, waste.id]);
                              } else {
                                setWasteTypes(wasteTypes.filter(w => w !== waste.id));
                              }
                            }}
                            className="w-4 h-4"
                          />
                          {waste.label}
                        </label>
                      ))}
                    </div>
                    {wasteTypes.includes('furniture') && (
                      <input
                        type="number"
                        placeholder="Number of furniture items"
                        value={furnitureItems}
                        onChange={(e) => setFurnitureItems(parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        min="0"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Access Difficulty</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'ground', label: 'Ground floor' },
                        { id: 'stairs', label: 'Stairs (no lift)' },
                        { id: 'parking', label: 'Restricted parking' },
                        { id: 'distance', label: 'Long carry distance' }
                      ].map(access => (
                        <label key={access.id} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={accessDifficulties.includes(access.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAccessDifficulties([...accessDifficulties, access.id]);
                              } else {
                                setAccessDifficulties(accessDifficulties.filter(a => a !== access.id));
                              }
                            }}
                            className="w-4 h-4"
                          />
                          {access.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Compliance Add-ons</label>
                    <div className="space-y-2">
                      {[
                        { id: 'photos', label: 'Photo report' },
                        { id: 'council', label: 'Council compliance pack' },
                        { id: 'sanitation', label: 'Deep sanitation/bio clean' }
                      ].map(addon => (
                        <label key={addon.id} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={complianceAddOns.includes(addon.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setComplianceAddOns([...complianceAddOns, addon.id]);
                              } else {
                                setComplianceAddOns(complianceAddOns.filter(a => a !== addon.id));
                              }
                            }}
                            className="w-4 h-4"
                          />
                          {addon.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-blue-200 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">📸</span>
                      <span className="text-lg font-medium text-gray-700">Upload Property Photos (Optional)</span>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className="flex-1 text-center">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <div className="text-gray-500 mb-4">
                            <div className="text-3xl mb-2">⬆️</div>
                            <div>Choose Files</div>
                          </div>
                        </label>
                      </div>
                      
                      <div className="flex gap-3">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <div className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600">
                            ⬆️ Upload
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    {uploadedPhotos.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {uploadedPhotos.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg border"
                            />
                            <button
                              onClick={() => removePhoto(index)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleClose}
                    className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-green-500 hover:bg-green-50 hover:text-green-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGeneratePriceEstimate}
                    disabled={!pickupAddress || !date || !time}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Calculator size={18} />
                    Generate Price Estimate
                  </button>
                </div>
              </div>
            )}

            {/* Price Animation Modal */}
            <AnimatePresence>
              {showPriceEstimate && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-3xl p-8 max-w-md w-full relative overflow-hidden">
                    {animationStage === 1 && (
                      <div className="text-center">
                        <div className="inline-block mb-6">
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Calculating...</h3>
                        <p className="text-gray-600 mt-2">Analyzing your requirements</p>
                      </div>
                    )}
                    {animationStage === 2 && (
                      <div className="text-center relative">
                        {[...Array(12)].map((_, i) => (
                          <motion.div key={i} className="absolute" initial={{ x: 0, y: 0, scale: 0, opacity: 0 }} animate={{ x: Math.cos((i * Math.PI * 2) / 12) * 100, y: Math.sin((i * Math.PI * 2) / 12) * 100, scale: [0, 1, 0], opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.05 }} style={{ left: "50%", top: "50%" }}>
                            <Sparkles className="w-6 h-6 text-purple-600" />
                          </motion.div>
                        ))}
                        <div className="py-12"><h3 className="text-2xl font-bold text-gray-900">Processing...</h3></div>
                      </div>
                    )}
                    {animationStage === 3 && (
                      <div className="text-center">
                        <motion.div className="mb-4" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>
                          <Sparkles className="w-12 h-12 text-purple-600 mx-auto" />
                        </motion.div>
                        <h3 className="text-lg font-semibold text-gray-600 mb-4">Your Total</h3>
                        <motion.div className="text-6xl font-bold text-purple-600 mb-2" key={countingPrice} initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 0.1 }}>
                          £{countingPrice.toLocaleString()}
                        </motion.div>
                        <p className="text-gray-600">Calculating final amount...</p>
                      </div>
                    )}
                    {animationStage === 4 && price && (
                      <div className="text-center">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="mb-6">
                          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full">
                            <Check className="w-10 h-10 text-white" />
                          </div>
                        </motion.div>
                        <motion.h3 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-2xl font-bold text-gray-900 mb-4">Price Calculated!</motion.h3>
                        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", delay: 0.4 }} className="bg-gradient-to-br from-blue-50 to-purple-100 rounded-2xl p-6 mb-6 border-2 border-blue-300">
                          <p className="text-gray-600 mb-2">Estimated Total</p>
                          <div className="text-6xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">£{price.total.toLocaleString()}</div>
                          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-3">
                            <p className="text-yellow-800 font-semibold text-xs">⚠️ This is an estimated price only</p>
                            <p className="text-yellow-700 text-xs">Final price will be determined once the job completion</p>
                          </div>
                        </motion.div>
                        <button onClick={() => {
                          setShowModal(false);
                          setTimeout(() => {
                            if (window.confirm(`Confirm Booking\n\nService: ${services.find(s => s.id === serviceType)?.name}\nSLA: ${slaType === '24h' ? '24 Hour Emergency' : slaType === '48h' ? '48 Hour Standard' : 'Standard (5-7 Days)'}\nAddress: ${pickupAddress}\nDate: ${date}\nTime: ${time}\nTotal: £${price.total.toLocaleString()}\n\nProceed with booking?`)) {
                              handleBookNow();
                            } else {
                              setShowModal(true);
                            }
                          }, 100);
                        }} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all">Confirm Booking</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && price && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle size={48} className="text-green-600" />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-bold text-gray-900 mb-2"
              >
                Booking Confirmed!
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-gray-600 mb-6"
              >
                Payment successful and booking confirmed
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200 mb-6"
              >
                <p className="text-sm text-gray-600 mb-2">Total Amount Paid</p>
                <p className="text-4xl font-bold text-green-700">
                  £{price.total.toLocaleString()}
                </p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                onClick={() => {
                  handleClose();
                  navigate('/client/history');
                }}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all"
              >
                View My Bookings
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={price?.total || 0}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Payment Success */}
      {showPaymentSuccess && paymentData && (
        <PaymentSuccess
          amount={paymentData.amount}
          orderId={paymentData.paymentId}
          status="success"
          onComplete={() => setShowPaymentSuccess(false)}
        />
      )}
    </>
  );
};
