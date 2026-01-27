import React, { useState } from 'react';
import { FileText, ArrowRight, Upload, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { FlexiblePhotoUpload } from './FlexiblePhotoUpload';

export const RequestQuoteWidget: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    propertyAddress: '',
    propertySize: '2bed',
    wasteTypes: ['general'],
    accessNotes: '',
    urgency: 'standard',
    photos: [] as File[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit quote request - no pricing shown
    console.log('Quote request submitted:', formData);
    alert('Quote request submitted! We\'ll review and send you a quote within 24 hours.');
    setShowModal(false);
  };

  return (
    <>
      <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.98 }}>
        <Card className="h-full cursor-pointer border-0 text-gray-900 overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700" onClick={() => setShowModal(true)}>
          <CardContent className="p-6">
            <FileText className="h-8 w-8 mb-4 text-white" strokeWidth={2} />
            <h3 className="font-semibold text-lg mb-2 text-white">Request Quote</h3>
            <p className="text-sm text-white/90">Get professional quote</p>
          </CardContent>
        </Card>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Request Professional Quote</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Property Address *</label>
                <input
                  type="text"
                  required
                  value={formData.propertyAddress}
                  onChange={(e) => setFormData({...formData, propertyAddress: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter property address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Property Size *</label>
                <select
                  value={formData.propertySize}
                  onChange={(e) => setFormData({...formData, propertySize: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="studio">Studio / 1-bed</option>
                  <option value="2bed">2-bed property</option>
                  <option value="3bed">3-bed property</option>
                  <option value="4bed">4+ bed property</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Waste Types</label>
                <div className="grid grid-cols-2 gap-2">
                  {['general', 'furniture', 'garden', 'hazardous'].map(type => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.wasteTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, wasteTypes: [...formData.wasteTypes, type]});
                          } else {
                            setFormData({...formData, wasteTypes: formData.wasteTypes.filter(w => w !== type)});
                          }
                        }}
                      />
                      <span className="text-sm capitalize text-gray-900">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Urgency</label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="standard">Standard (5-7 days)</option>
                  <option value="48h">48 hours</option>
                  <option value="24h">24 hours (Emergency)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Property Photos</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, photos: Array.from(e.target.files || [])})}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500 mt-2">Upload photos to help us assess the job</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Access Notes</label>
                <textarea
                  value={formData.accessNotes}
                  onChange={(e) => setFormData({...formData, accessNotes: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Any access difficulties, parking restrictions, etc."
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  Request Quote
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};