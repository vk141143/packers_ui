import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Clock, Shield, FileText, Users, CheckCircle, ArrowRight, Phone, Mail, MapPin, Zap, TrendingUp, Package, Calculator, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateDetailedPrice } from '../utils/detailedPricing';
import { authStore } from '../store/authStore';
import { AddressInput } from '../components/common/AddressInput';
import { saveBookingData } from '../utils/bookingPersistence';
import { QuoteDemoNavigation } from '../components/common/QuoteDemoNavigation';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [modalType, setModalType] = useState<'price' | 'booking'>('price');
  const [priceForm, setPriceForm] = useState({ 
    serviceType: 'emergency-clearance', 
    slaType: '48h',
    vehicleType: 'small-van',
    pickupAddress: '',
    scheduledDate: '',
    scheduledTime: '',
    propertySize: '2bed',
    volumeLoads: 2,
    wasteTypes: ['general'],
    accessDifficulties: ['ground'],
    complianceAddOns: ['photos'],
    furnitureItems: 0
  });
  const [showResult, setShowResult] = useState(false);

  const priceEstimate = calculateDetailedPrice({
    propertySize: priceForm.propertySize as any,
    volumeLoads: priceForm.volumeLoads,
    wasteTypes: priceForm.wasteTypes,
    accessDifficulties: priceForm.accessDifficulties,
    urgency: priceForm.slaType === '24h' ? '24h' : priceForm.slaType === 'same-day' ? 'same-day' : 'standard',
    complianceAddOns: priceForm.complianceAddOns,
    furnitureItems: priceForm.furnitureItems
  });

  const handleBookEmergency = () => {
    setModalType('booking');
    setPriceForm(prev => ({ ...prev, serviceType: 'emergency-clearance', slaType: '24h' }));
    setShowPriceModal(true);
    setShowResult(false);
  };

  const handleGetEstimate = () => {
    // Validate required fields only for booking mode
    if (modalType === 'booking') {
      if (!priceForm.pickupAddress || !priceForm.scheduledDate || !priceForm.scheduledTime) {
        alert('Please fill in all required fields');
        return;
      }
    }
    setShowResult(true);
  };

  const handleBookNow = () => {
    const authState = authStore.getState();
    if (!authState.isAuthenticated) {
      // Save booking data and go to auth
      saveBookingData({
        ...priceForm,
        source: 'landing-page',
        estimatedPrice: priceEstimate.total
      });
      setShowAuthModal(true);
    } else {
      // Save booking data and go to booking request page
      saveBookingData({
        ...priceForm,
        source: 'landing-page',
        estimatedPrice: priceEstimate.total
      });
      navigate('/client/request-booking');
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/80 backdrop-blur-xl shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform">
              <Truck size={28} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">UK Packers</span>
          </div>
          <div className="hidden md:flex gap-8">
            {['Home', 'About', 'Services', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="relative group text-gray-300 hover:text-white transition">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/login')} className="px-5 py-2 text-white hover:text-blue-400 transition">
              Sign In
            </button>
            <button onClick={() => navigate('/signup')} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 px-6 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-500/30">
              <Zap size={16} className="text-yellow-400" />
              <span className="text-sm">Trusted by UK Councils & Housing Associations</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black leading-tight">
              Britain's Premier
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                Property Clearance
              </span>
            </h1>
            <p className="text-xl text-gray-300">
              24-48 hour emergency response across England, Scotland & Wales. SLA-guaranteed service for councils, insurers & housing associations.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={handleBookEmergency} className="group px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 rounded-xl hover:shadow-2xl hover:shadow-red-500/50 transition-all hover:scale-105 flex items-center gap-2 font-semibold">
                <Truck size={20} />
                Book Emergency Clearance
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => setShowPriceModal(true)} className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2">
                <Calculator size={20} />
                Get Price Estimate
              </button>
            </div>
            <div className="flex gap-8 pt-4">
              {[
                { icon: CheckCircle, text: 'ISO 9001 Certified' },
                { icon: Shield, text: 'Fully Insured' },
                { icon: CheckCircle, text: 'GDPR Compliant' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-green-400">
                  <item.icon size={18} />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
          
          {/* Dashboard Preview with Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop" 
                alt="Team working" 
                className="w-full h-64 object-cover opacity-60"
              />
              <div className="p-8">
                <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Clock, label: '24h Emergency', value: 'Response', color: 'from-red-500 to-orange-500' },
              { icon: TrendingUp, label: '94% SLA', value: 'Compliance', color: 'from-blue-500 to-cyan-500' },
              { icon: Package, label: '500+', value: 'Jobs/Month', color: 'from-purple-500 to-pink-500' },
              { icon: Users, label: '50+', value: 'Trained Crews', color: 'from-green-500 to-emerald-500' }
            ].map((stat, i) => (
              <div key={i} className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <stat.icon className={`mb-2 bg-gradient-to-br ${stat.color} p-2 rounded-lg`} size={32} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">How It Works</h2>
            <p className="text-gray-300">Simple 4-step process to get your property cleared</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: '1', icon: Phone, title: 'Book Online', desc: 'Quick booking form or call us', color: 'from-blue-500 to-cyan-500' },
              { num: '2', icon: Users, title: 'Crew Assigned', desc: 'Expert team allocated', color: 'from-purple-500 to-pink-500' },
              { num: '3', icon: Truck, title: 'Clearance Done', desc: 'Professional service', color: 'from-orange-500 to-red-500' },
              { num: '4', icon: CheckCircle, title: 'Documentation', desc: 'Full proof & reports', color: 'from-green-500 to-emerald-500' }
            ].map((step, i) => (
              <div key={i} className="relative">
                {i < 3 && <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-white/20 to-transparent"></div>}
                <div className="relative p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 text-center group hover:scale-105 transition-all">
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <step.icon size={32} />
                  </div>
                  <div className={`absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center font-bold text-lg`}>
                    {step.num}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-500/30 mb-4">
              <span className="text-sm font-semibold">WHO WE ARE</span>
            </div>
            <h2 className="text-5xl font-black mb-6">About Us</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Enterprise-grade platform serving councils, landlords, insurers, and corporate clients with professional property clearance services.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Trusted & Reliable', desc: 'Fully insured and compliant with all UK regulations. Trusted by major councils nationwide.', color: 'blue', img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop' },
              { icon: Users, title: 'Expert Teams', desc: '50+ trained professionals with specialized equipment for safe and efficient clearance.', color: 'purple', img: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop' },
              { icon: Clock, title: 'SLA Guaranteed', desc: '24h and 48h SLA options with real-time tracking and 94% on-time completion rate.', color: 'pink', img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop' }
            ].map((item, i) => (
              <div key={i} className="group relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/30 transition-all hover:scale-105">
                <img src={item.img} alt={item.title} className="w-full h-48 object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
                <div className="p-8">
                  <div className={`absolute inset-0 bg-gradient-to-br from-${item.color}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                  <div className={`w-16 h-16 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <item.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Preview */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">Multi-Role Platform</h2>
            <p className="text-gray-300">Dashboards for every stakeholder</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { role: 'Client Portal', features: ['Book Moves', 'Track Jobs', 'View Invoices', 'Download Reports'], color: 'from-blue-500 to-cyan-500', icon: Users },
              { role: 'Admin Dashboard', features: ['Manage Jobs', 'Assign Crews', 'SLA Monitoring', 'Approvals'], color: 'from-purple-500 to-pink-500', icon: Shield },
              { role: 'Crew App', features: ['View Jobs', 'Upload Photos', 'Checklists', 'Complete Tasks'], color: 'from-orange-500 to-red-500', icon: Truck }
            ].map((platform, i) => (
              <div key={i} className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/30 transition-all hover:scale-105">
                <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`}></div>
                <div className={`w-16 h-16 bg-gradient-to-br ${platform.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <platform.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-6">{platform.role}</h3>
                <div className="space-y-3">
                  {platform.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle size={18} className="text-green-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-white/5 rounded-xl">
                  <div className="h-2 bg-white/10 rounded mb-2"></div>
                  <div className="h-2 bg-white/10 rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-white/10 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 mb-4">
              <span className="text-sm font-semibold">WHAT WE DO</span>
            </div>
            <h2 className="text-5xl font-black mb-6">Our Services</h2>
            <p className="text-xl text-gray-300">Comprehensive property clearance solutions for every need</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, title: 'Emergency Clearance', desc: '24/7 rapid response for urgent property clearances with 24h SLA guarantee.', gradient: 'from-red-500 to-orange-500', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop' },
              { icon: Truck, title: 'Scheduled Moves', desc: 'Planned property clearances with flexible scheduling and 48h SLA options.', gradient: 'from-blue-500 to-cyan-500', img: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop' },
              { icon: FileText, title: 'Full Documentation', desc: 'Complete photo evidence, inventory lists, and compliance reports.', gradient: 'from-purple-500 to-pink-500', img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop' },
              { icon: Shield, title: 'Insured & Compliant', desc: 'Fully insured operations with waste disposal compliance and audit trails.', gradient: 'from-green-500 to-emerald-500', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop' }
            ].map((service, i) => (
              <div key={i} className="group relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/30 transition-all hover:scale-105">
                <img src={service.img} alt={service.title} className="w-full h-40 object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="p-6">
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                  <div className={`w-14 h-14 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <service.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-400 text-sm">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Demo Navigation */}
      <QuoteDemoNavigation />

      {/* Contact Section */}
      <section id="contact" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-pink-500/20 backdrop-blur-sm rounded-full border border-pink-500/30 mb-4">
              <span className="text-sm font-semibold">GET IN TOUCH</span>
            </div>
            <h2 className="text-5xl font-black mb-6">Contact Us</h2>
            <p className="text-xl text-gray-300">Ready to get started? Reach out today</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              {[
                { icon: Phone, title: 'Phone', value: '0800 123 4567', sub: '24/7 Emergency Line', gradient: 'from-green-500 to-emerald-500' },
                { icon: Mail, title: 'Email', value: 'info@ukpackersmovers.co.uk', sub: 'Quick Response', gradient: 'from-blue-500 to-cyan-500' },
                { icon: MapPin, title: 'Address', value: '123 Business Park, London, UK', sub: 'Head Office', gradient: 'from-purple-500 to-pink-500' }
              ].map((contact, i) => (
                <div key={i} className="group flex items-start gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/30 transition-all hover:scale-105">
                  <div className={`w-12 h-12 bg-gradient-to-br ${contact.gradient} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <contact.icon size={24} />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{contact.title}</div>
                    <div className="text-gray-300">{contact.value}</div>
                    <div className="text-sm text-gray-500">{contact.sub}</div>
                  </div>
                </div>
              ))}
              <div className="p-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl border border-white/20">
                <h4 className="font-bold text-xl mb-4">For Existing Clients</h4>
                <button onClick={() => navigate('/login')} className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105 font-semibold">
                  Access Client Portal →
                </button>
              </div>
            </div>
            <div className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <h3 className="text-2xl font-bold mb-6">Quick Enquiry</h3>
              <form className="space-y-4">
                <input type="text" placeholder="Your Name" className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus:border-blue-500 focus:outline-none transition-all" />
                <input type="email" placeholder="Email Address" className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus:border-blue-500 focus:outline-none transition-all" />
                <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus:border-blue-500 focus:outline-none transition-all" />
                <textarea placeholder="Your Message" rows={4} className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus:border-blue-500 focus:outline-none transition-all"></textarea>
                <button type="submit" className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105 font-semibold">
                  Send Message →
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Truck size={28} />
            </div>
            <span className="text-xl font-bold">UK Packers & Movers</span>
          </div>
          <p className="text-gray-400 mb-6">Professional Property Clearance Services Across the UK</p>
          <div className="flex justify-center gap-8 mb-6">
            {['Home', 'About', 'Services', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-gray-400 hover:text-white transition">{item}</a>
            ))}
          </div>
          <div className="text-gray-500 text-sm">
            © 2024 UK Packers & Movers. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Price Estimate Modal */}
      <AnimatePresence>
        {showPriceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => { setShowPriceModal(false); setShowResult(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full border border-gray-200 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => { setShowPriceModal(false); setShowResult(false); }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">
                  {modalType === 'booking' ? 'Book Emergency Clearance' : 'Quick Price Estimate'}
                </h3>
                <p className="text-gray-600">
                  {modalType === 'booking' ? 'Fill in your details to book now' : 'Get an instant quote for your clearance'}
                </p>
              </div>

              {!showResult ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">Property Address {modalType === 'booking' && <span className="text-red-400">*</span>}</label>
                    <AddressInput
                      value={priceForm.pickupAddress}
                      onChange={(value) => setPriceForm({ ...priceForm, pickupAddress: value })}
                      placeholder="📍 Enter property address or find your location"
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-300 focus:border-orange-500 focus:outline-none text-black placeholder-gray-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-black">📅 Date {modalType === 'booking' && <span className="text-red-400">*</span>}</label>
                      <input
                        type="date"
                        value={priceForm.scheduledDate}
                        onChange={(e) => setPriceForm({ ...priceForm, scheduledDate: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-300 focus:border-orange-500 focus:outline-none text-black"
                        required={modalType === 'booking'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-black">⏰ Time {modalType === 'booking' && <span className="text-red-400">*</span>}</label>
                      <input
                        type="time"
                        value={priceForm.scheduledTime}
                        onChange={(e) => setPriceForm({ ...priceForm, scheduledTime: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-300 focus:border-orange-500 focus:outline-none text-black"
                        required={modalType === 'booking'}
                      />
                    </div>
                  </div>



                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">Service Type</label>
                    <select
                      value={priceForm.serviceType}
                      onChange={(e) => setPriceForm({ ...priceForm, serviceType: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-300 focus:border-orange-500 focus:outline-none text-black"
                    >
                      <option value="emergency-clearance" className="bg-slate-800">Emergency Clearance</option>
                      <option value="void-turnover" className="bg-slate-800">Void Property Turnover</option>
                      <option value="hoarder-clearout" className="bg-slate-800">Hoarder Clean-out</option>
                      <option value="fire-flood-moveout" className="bg-slate-800">Fire/Flood Move-out</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">SLA Type</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['24h', '48h', 'standard'].map((sla) => (
                        <button
                          key={sla}
                          type="button"
                          onClick={() => setPriceForm({ ...priceForm, slaType: sla })}
                          className={`px-4 py-3 rounded-xl border-2 transition-all ${
                            priceForm.slaType === sla
                              ? 'border-orange-500 bg-orange-500/20 text-black'
                              : 'border-gray-300 bg-gray-50 hover:border-orange-300 text-black'
                          }`}
                        >
                          <div className="font-bold text-sm">{sla === 'standard' ? '5-7d' : sla}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">🏠 Property Size</label>
                    <select
                      value={priceForm.propertySize}
                      onChange={(e) => setPriceForm({ ...priceForm, propertySize: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-300 focus:border-orange-500 focus:outline-none text-black"
                    >
                      <option value="studio" className="bg-slate-800">Studio / 1-bed flat</option>
                      <option value="2bed" className="bg-slate-800">2-bed flat</option>
                      <option value="3bed" className="bg-slate-800">3-bed house</option>
                      <option value="4bed" className="bg-slate-800">4+ bed house</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">🚚 Van Loads</label>
                    <select
                      value={priceForm.volumeLoads}
                      onChange={(e) => setPriceForm({ ...priceForm, volumeLoads: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-300 focus:border-orange-500 focus:outline-none text-black"
                    >
                      <option value={1} className="bg-slate-800">1 van load</option>
                      <option value={2} className="bg-slate-800">2 van loads</option>
                      <option value={3} className="bg-slate-800">3 van loads</option>
                      <option value={4} className="bg-slate-800">4+ van loads</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-black">🗑️ Waste Types</label>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {[
                        { id: 'general', label: 'General' },
                        { id: 'furniture', label: 'Furniture' },
                        { id: 'garden', label: 'Garden' },
                        { id: 'hazardous', label: 'Hazardous' }
                      ].map(waste => (
                        <label key={waste.id} className="flex items-center gap-2 text-sm text-black">
                          <input
                            type="checkbox"
                            checked={priceForm.wasteTypes.includes(waste.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPriceForm({...priceForm, wasteTypes: [...priceForm.wasteTypes, waste.id]});
                              } else {
                                setPriceForm({...priceForm, wasteTypes: priceForm.wasteTypes.filter(w => w !== waste.id)});
                              }
                            }}
                            className="w-4 h-4"
                          />
                          {waste.label}
                        </label>
                      ))}
                    </div>
                    {priceForm.wasteTypes.includes('furniture') && (
                      <input
                        type="number"
                        placeholder="Furniture items"
                        value={priceForm.furnitureItems}
                        onChange={(e) => setPriceForm({...priceForm, furnitureItems: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-300 focus:border-orange-500 focus:outline-none text-black placeholder-gray-500"
                        min="0"
                      />
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGetEstimate}
                    className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl hover:shadow-2xl hover:shadow-orange-500/50 transition-all font-semibold text-white flex items-center justify-center gap-2"
                  >
                    <Sparkles size={20} />
                    Calculate Price
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-purple-100 rounded-2xl p-6 border-2 border-blue-300">
                    <p className="text-gray-700 text-sm font-semibold mb-2">Estimated Total</p>
                    <p className="text-blue-700 text-5xl font-black mb-4">£{priceEstimate.total.toLocaleString()}</p>
                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-3 mb-4">
                      <p className="text-yellow-800 font-semibold text-xs">⚠️ This is an estimated price only</p>
                      <p className="text-yellow-700 text-xs">Final price will be determined once the job completion</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowResult(false)}
                      className="flex-1 px-6 py-3 bg-white/10 backdrop-blur border-2 border-white/20 rounded-xl hover:bg-white/20 transition-all font-semibold text-white"
                    >
                      Recalculate
                    </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBookNow}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:shadow-2xl hover:shadow-green-500/50 transition-all font-semibold text-white flex items-center justify-center gap-2"
                  >
                    Book Now
                    <ArrowRight size={18} />
                  </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Almost There!</h3>
                <p className="text-gray-300">Sign in or create an account to complete your booking</p>
              </div>

              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    saveBookingData({
                      ...priceForm,
                      source: 'landing-page',
                      estimatedPrice: priceEstimate.total
                    });
                    navigate('/login?booking=true');
                  }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all font-semibold text-white flex items-center justify-center gap-2"
                >
                  Sign In
                  <ArrowRight size={20} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    saveBookingData({
                      ...priceForm,
                      source: 'landing-page',
                      estimatedPrice: priceEstimate.total
                    });
                    navigate('/signup?booking=true');
                  }}
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur border-2 border-white/20 rounded-xl hover:bg-white/20 transition-all font-semibold text-white flex items-center justify-center gap-2"
                >
                  Create Account
                  <ArrowRight size={20} />
                </motion.button>
              </div>

              <p className="text-center text-sm text-gray-400 mt-6">
                Your price estimate is saved and will be ready after you sign in
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
