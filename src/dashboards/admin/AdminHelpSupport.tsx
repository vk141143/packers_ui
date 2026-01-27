import React from 'react';
import { HelpCircle, Phone, Mail, MessageCircle, Book } from 'lucide-react';

export const AdminHelpSupport = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Help & Support</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Emergency Support</h3>
              </div>
              <p className="text-gray-600 mb-2">24/7 Technical Support</p>
              <p className="font-medium text-blue-600">+44 800 123 4567</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Mail className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Email Support</h3>
              </div>
              <p className="text-gray-600 mb-2">Admin Technical Issues</p>
              <p className="font-medium text-green-600">admin-support@moveaway.co.uk</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <MessageCircle className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Live Chat</h3>
              </div>
              <p className="text-gray-600 mb-2">Instant admin assistance</p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Start Chat
              </button>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Book className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-gray-900">Admin Guide</h3>
              </div>
              <p className="text-gray-600 mb-2">System administration manual</p>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                View Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};