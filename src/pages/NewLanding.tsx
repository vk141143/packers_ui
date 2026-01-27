import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Clock, Shield, CheckCircle, ArrowRight, Phone, Mail, MapPin, Users, Star, Award, Zap, Calendar, Home, Building, Leaf, AlertTriangle, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { RequestQuoteWidget } from '../components/common/RequestQuoteWidget';

export const NewLanding: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetQuote = (service?: string) => {
    navigate('/booking');
  };

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
            {['Home', 'How It Works', 'Services', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="relative group text-gray-300 hover:text-white transition">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/login')} className="px-5 py-2 text-white hover:text-blue-400 transition">
              Sign In
            </button>
            <button onClick={() => handleGetQuote()} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105">
              Get Free Quote
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 px-6 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-500/30">
              <Zap size={16} className="text-yellow-400" />
              <span className="text-sm">Trusted by UK Councils & Housing Associations</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black leading-tight">
              Britain's Premier
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Property Clearance
              </span>
            </h1>
            <p className="text-xl text-gray-300">
              Professional property clearance with 24-48 hour response across England, Scotland & Wales. 
              Licensed, insured, and fully compliant with all UK regulations.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleGetQuote()}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all flex items-center gap-2 font-semibold"
              >
                <Truck size={20} />
                Get Free Quote
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <Users size={20} />
                Client Portal
              </motion.button>
            </div>
            <div className="flex gap-8 pt-4">
              {[
                { icon: CheckCircle, text: 'Licensed Waste Carrier' },
                { icon: Shield, text: 'Fully Insured' },
                { icon: Award, text: 'Environment Agency Registered' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-green-400">
                  <item.icon size={18} />
                  {item.text}
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop" 
                alt="Professional clearance team" 
                className="w-full h-64 object-cover opacity-60"
              />
              <div className="p-8">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Clock, label: '24h Emergency', value: 'Response', color: 'from-red-500 to-orange-500' },
                    { icon: Star, label: '4.9/5', value: 'Rating', color: 'from-yellow-500 to-amber-500' },
                    { icon: Truck, label: '500+', value: 'Jobs/Month', color: 'from-purple-500 to-pink-500' },
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
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black mb-4">How It Works</h2>
            <p className="text-gray-300">Simple 5-step process for professional property clearance</p>
          </motion.div>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { num: '1', title: 'Submit Request', desc: 'Fill out our quick form with property details and photos', color: 'from-blue-500 to-cyan-500' },
              { num: '2', title: 'Receive Quote', desc: 'Get your detailed quote within 24 hours', color: 'from-purple-500 to-pink-500' },
              { num: '3', title: 'Approve & Pay', desc: 'Approve quote and pay secure deposit', color: 'from-orange-500 to-red-500' },
              { num: '4', title: 'Professional Clearance', desc: 'Our trained crew handles everything safely', color: 'from-green-500 to-emerald-500' },
              { num: '5', title: 'Final Payment', desc: 'Complete payment after job completion', color: 'from-indigo-500 to-purple-500' }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                {i < 4 && <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-white/20 to-transparent"></div>}
                <div className="relative p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 text-center group hover:scale-105 transition-all">
                  <div className={`absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center font-bold text-lg`}>
                    {step.num}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mt-12"
          >
            <button 
              onClick={() => handleGetQuote()}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105 font-semibold flex items-center gap-2 mx-auto"
            >
              Start Your Clearance
              <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black mb-4">Our Services</h2>
            <p className="text-gray-300">Professional clearance solutions for every property type</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                service: 'house', 
                title: 'House Clearance', 
                desc: 'Complete residential property clearance with full documentation',
                icon: '🏠',
                gradient: 'from-blue-500 to-cyan-500'
              },
              { 
                service: 'office', 
                title: 'Office Clearance', 
                desc: 'Commercial property clearance with secure document disposal',
                icon: '🏢',
                gradient: 'from-purple-500 to-pink-500'
              },
              { 
                service: 'builders', 
                title: 'Builders Waste', 
                desc: 'Construction and renovation waste removal and disposal',
                icon: '🔨',
                gradient: 'from-orange-500 to-red-500'
              },
              { 
                service: 'garden', 
                title: 'Garden Waste', 
                desc: 'Green waste collection and environmentally friendly disposal',
                icon: '🌱',
                gradient: 'from-green-500 to-emerald-500'
              },
              { 
                service: 'hoarder', 
                title: 'Hoarder Clearance', 
                desc: 'Sensitive and professional hoarding clearance services',
                icon: '📦',
                gradient: 'from-indigo-500 to-purple-500'
              },
              { 
                service: 'hazardous', 
                title: 'Hazardous Waste', 
                desc: 'Safe handling and disposal of hazardous materials',
                icon: '⚠️',
                gradient: 'from-red-500 to-pink-500'
              }
            ].map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/30 transition-all hover:scale-105 cursor-pointer"
                onClick={() => handleGetQuote(service.service)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                <div className="p-8">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-gray-400 mb-6">{service.desc}</p>
                  <button className={`w-full px-6 py-3 bg-gradient-to-r ${service.gradient} rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2`}>
                    Get Quote
                    <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Compliance Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black mb-4">Trust & Compliance</h2>
            <p className="text-gray-300">Fully licensed, insured, and compliant with all UK regulations</p>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Licensed Waste Carrier', desc: 'Environment Agency registered', color: 'from-blue-500 to-cyan-500' },
              { icon: Award, title: 'Fully Insured', desc: '£2M public liability coverage', color: 'from-purple-500 to-pink-500' },
              { icon: CheckCircle, title: 'GDPR Compliant', desc: 'Secure data handling', color: 'from-green-500 to-emerald-500' },
              { icon: Star, title: '4.9/5 Rating', desc: 'Trusted by 1000+ clients', color: 'from-yellow-500 to-orange-500' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-105 transition-all"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <item.icon size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Map Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black mb-4">UK-Wide Coverage</h2>
            <p className="text-gray-300">Professional clearance services across England, Scotland & Wales</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-blue-400">England</h3>
              <div className="space-y-2 text-gray-300">
                <p>• London & Greater London</p>
                <p>• Manchester & North West</p>
                <p>• Birmingham & West Midlands</p>
                <p>• Leeds & Yorkshire</p>
                <p>• Bristol & South West</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-purple-400">Scotland</h3>
              <div className="space-y-2 text-gray-300">
                <p>• Edinburgh & Lothians</p>
                <p>• Glasgow & Central Belt</p>
                <p>• Aberdeen & North East</p>
                <p>• Dundee & Tayside</p>
                <p>• Highlands & Islands</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-pink-400">Wales</h3>
              <div className="space-y-2 text-gray-300">
                <p>• Cardiff & South Wales</p>
                <p>• Swansea & West Wales</p>
                <p>• Newport & Gwent</p>
                <p>• Wrexham & North Wales</p>
                <p>• Powys & Mid Wales</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl border border-white/20 p-12"
          >
            <h2 className="text-5xl font-black mb-6">Ready to Start Your Clearance?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Get your free, no-obligation quote in under 2 minutes. Professional service guaranteed.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGetQuote()}
              className="px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all font-bold text-xl flex items-center gap-3 mx-auto"
            >
              <Truck size={24} />
              Get Free Quote Now
              <ArrowRight size={24} />
            </motion.button>
            <p className="text-sm text-gray-400 mt-4">No hidden fees • 24h response • Fully insured</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black mb-4">Contact Us</h2>
            <p className="text-gray-300">Get in touch for immediate assistance</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Phone, title: 'Emergency Line', value: '0800 123 4567', sub: '24/7 Available', gradient: 'from-green-500 to-emerald-500' },
              { icon: Mail, title: 'Email Us', value: 'info@ukpackers.co.uk', sub: 'Quick Response', gradient: 'from-blue-500 to-cyan-500' },
              { icon: MapPin, title: 'Head Office', value: 'London, UK', sub: 'Nationwide Service', gradient: 'from-purple-500 to-pink-500' }
            ].map((contact, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:scale-105 transition-all"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${contact.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <contact.icon size={32} />
                </div>
                <h3 className="font-bold text-xl mb-2">{contact.title}</h3>
                <p className="text-gray-300 text-lg">{contact.value}</p>
                <p className="text-sm text-gray-500">{contact.sub}</p>
              </motion.div>
            ))}
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
            {['Home', 'How It Works', 'Services', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-white transition">{item}</a>
            ))}
          </div>
          <div className="text-gray-500 text-sm">
            © 2024 UK Packers & Movers. All rights reserved. Licensed Waste Carrier • Environment Agency Registered
          </div>
        </div>
      </footer>

      {/* Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Request Professional Quote</h3>
              <button 
                onClick={() => setShowQuoteModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <form className="space-y-6">
              {/* Property Address */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} className="text-blue-600" />
                  Property Address *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="e.g., 123 High Street, London, SW1A 1AA"
                />
                <p className="text-xs text-gray-900 mt-1">Include postcode for accurate service area verification</p>
              </div>

              {/* Service Type */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <Truck size={16} className="text-blue-600" />
                  Service Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'emergency', icon: '🚨', title: 'Emergency Clearance', desc: 'Urgent same-day service' },
                    { value: 'house', icon: '🏠', title: 'House Clearance', desc: 'Full property clearance' },
                    { value: 'office', icon: '🏢', title: 'Office Clearance', desc: 'Commercial spaces' },
                    { value: 'garden', icon: '🌿', title: 'Garden Clearance', desc: 'Outdoor waste removal' }
                  ].map(service => (
                    <label key={service.value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="radio" name="serviceType" value={service.value} className="text-blue-600" />
                      <span className="text-xl">{service.icon}</span>
                      <div>
                        <div className="font-medium text-sm text-gray-900">{service.title}</div>
                        <div className="text-xs text-gray-900">{service.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="text-blue-600" />
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Clock size={16} className="text-blue-600" />
                    Preferred Time *
                  </label>
                  <input
                    type="time"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
              </div>

              {/* Urgency Level */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <Zap size={16} className="text-blue-600" />
                  Urgency Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'standard', icon: '📅', title: 'Standard', desc: '48-72 hours' },
                    { value: 'urgent', icon: '⚡', title: 'Urgent', desc: '24-48 hours' },
                    { value: 'emergency', icon: '🚨', title: 'Emergency', desc: 'Same day' }
                  ].map(urgency => (
                    <label key={urgency.value} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="radio" name="urgency" value={urgency.value} className="text-blue-600" />
                      <span className="text-lg">{urgency.icon}</span>
                      <div>
                        <div className="font-medium text-sm text-gray-900">{urgency.title}</div>
                        <div className="text-xs text-gray-900">{urgency.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Property Size */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <Home size={16} className="text-blue-600" />
                  Property Size *
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900">
                  <option value="studio">🏠 Studio - 1 room</option>
                  <option value="1bed">🏠 1-bed flat - Small flat</option>
                  <option value="2bed">🏠 2-bed flat - Medium flat</option>
                  <option value="3bed">🏠 3-bed house - Family home</option>
                  <option value="4bed">🏠 4-bed house - Large home</option>
                  <option value="5bed">🏠 5+ bed house - Very large</option>
                </select>
              </div>

              {/* Van Loads */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <Truck size={16} className="text-blue-600" />
                  Van Loads *
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900">
                  <option value="1">🚚 1 van load - Small job</option>
                  <option value="2">🚚 2 van loads - Medium job</option>
                  <option value="3">🚚 3 van loads - Large job</option>
                  <option value="4">🚚 4 van loads - Very large</option>
                  <option value="5+">🚚 5+ van loads - Multiple trips</option>
                </select>
              </div>

              {/* Waste Types */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <AlertTriangle size={16} className="text-blue-600" />
                  Waste Types
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'general', icon: '🗑️', label: 'General waste' },
                    { value: 'furniture', icon: '🛋️', label: 'Furniture/appliances' },
                    { value: 'garden', icon: '🌿', label: 'Garden waste' },
                    { value: 'construction', icon: '🧱', label: 'Construction waste' },
                    { value: 'hazardous', icon: '⚠️', label: 'Hazardous waste' },
                    { value: 'electronic', icon: '📱', label: 'Electronic waste' }
                  ].map(waste => (
                    <label key={waste.value} className="flex items-center gap-2 text-sm text-gray-900">
                      <input type="checkbox" value={waste.value} className="text-blue-600" />
                      <span>{waste.icon}</span>
                      <span>{waste.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} className="text-blue-600" />
                  Additional Information
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  rows={3}
                  placeholder="• Special access instructions\n• Fragile or valuable items\n• Time constraints\n• Any concerns or questions"
                />
                <p className="text-xs text-gray-900 mt-1">💡 The more details you provide, the more accurate our quote will be</p>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowQuoteModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  Submit Booking Request
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};