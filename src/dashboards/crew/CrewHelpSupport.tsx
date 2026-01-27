import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AISupportInterface } from '../../components/common/AISupportInterface';
import { Phone, MessageCircle, Mail, Clock, AlertTriangle, CheckCircle, Book, Video, Users, Headphones } from 'lucide-react';

export const CrewHelpSupport: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ai-support');

  const emergencyContacts = [
    {
      title: 'Emergency Dispatch',
      number: '+44 800 123 999',
      description: '24/7 Emergency support for urgent job issues',
      icon: AlertTriangle,
      color: 'red',
      available: '24/7'
    },
    {
      title: 'Operations Manager',
      number: '+44 20 7641 6001',
      description: 'Sarah Johnson - For job assignments and queries',
      icon: Users,
      color: 'blue',
      available: 'Mon-Fri 7AM-7PM'
    },
    {
      title: 'Technical Support',
      number: '+44 20 7641 6002',
      description: 'App issues, GPS problems, photo upload help',
      icon: Headphones,
      color: 'green',
      available: 'Mon-Fri 8AM-6PM'
    }
  ];

  const quickHelp = [
    {
      title: 'Job Workflow Guide',
      description: 'Step-by-step guide for completing jobs',
      icon: CheckCircle,
      action: () => window.open('/crew/workflow-guide', '_blank')
    },
    {
      title: 'Photo Upload Tips',
      description: 'Best practices for taking and uploading photos',
      icon: Video,
      action: () => window.open('/crew/photo-guide', '_blank')
    },
    {
      title: 'Safety Guidelines',
      description: 'Health and safety procedures for crew members',
      icon: Book,
      action: () => window.open('/crew/safety-guide', '_blank')
    }
  ];

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black mb-2">🆘 Crew Support Center</h1>
            <p className="text-blue-100 text-lg">Get help when you need it - we're here to support you 24/7</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-blue-100">Emergency Support</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Emergency Contacts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Phone className="text-red-500" size={28} />
          Emergency & Direct Contacts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {emergencyContacts.map((contact, index) => {
            const Icon = contact.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`bg-gradient-to-br from-${contact.color}-50 to-${contact.color}-100 rounded-2xl p-6 border-2 border-${contact.color}-200 cursor-pointer`}
                onClick={() => window.open(`tel:${contact.number}`)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-${contact.color}-500 rounded-xl flex items-center justify-center`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-${contact.color}-900 mb-1`}>{contact.title}</h3>
                    <p className={`text-${contact.color}-700 text-sm mb-2`}>{contact.description}</p>
                    <div className={`text-${contact.color}-800 font-bold text-lg mb-1`}>{contact.number}</div>
                    <div className={`text-${contact.color}-600 text-xs flex items-center gap-1`}>
                      <Clock size={12} />
                      {contact.available}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Help Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Book className="text-blue-500" size={28} />
          Quick Help Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickHelp.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={item.action}
                className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border-2 border-blue-200 cursor-pointer hover:border-blue-300 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Icon className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'ai-support', label: 'AI Assistant', icon: MessageCircle },
            { id: 'contact-form', label: 'Contact Form', icon: Mail },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 font-bold transition-all ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-3 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'ai-support' && (
            <AISupportInterface userRole="crew" />
          )}

          {activeTab === 'contact-form' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Support Team</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      defaultValue="Mike Davies"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Crew ID</label>
                    <input
                      type="text"
                      defaultValue="CREW-001"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Issue Category</label>
                  <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
                    <option>Job Assignment Issue</option>
                    <option>App Technical Problem</option>
                    <option>Payment Query</option>
                    <option>Safety Concern</option>
                    <option>Equipment Issue</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Priority Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Low', 'Medium', 'High'].map((priority) => (
                      <label key={priority} className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-all">
                        <input type="radio" name="priority" value={priority} className="text-blue-600" />
                        <span className="font-medium">{priority}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Describe Your Issue</label>
                  <textarea
                    rows={6}
                    placeholder="Please provide as much detail as possible about your issue..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all"
                >
                  Submit Support Request
                </motion.button>
              </form>
            </motion.div>
          )}
        </div>
      </div>

      {/* Support Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200"
      >
        <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
          <Clock className="text-green-600" size={24} />
          Support Availability for Crew Members
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-green-200">
            <div className="font-semibold text-green-800">Emergency Support</div>
            <div className="text-sm text-green-600">24/7 - Always available</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-green-200">
            <div className="font-semibold text-green-800">Operations Team</div>
            <div className="text-sm text-green-600">Mon-Fri: 7:00 AM - 7:00 PM</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-green-200">
            <div className="font-semibold text-green-800">Technical Support</div>
            <div className="text-sm text-green-600">Mon-Fri: 8:00 AM - 6:00 PM</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-green-200">
            <div className="font-semibold text-green-800">AI Assistant</div>
            <div className="text-sm text-green-600">Always online - Instant help</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};