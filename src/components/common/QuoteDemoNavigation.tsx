import React from 'react';
import { Calculator, ArrowRight, Star, Clock, Shield } from 'lucide-react';

export const QuoteDemoNavigation: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Experience Our Enhanced Quote Calculator
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant, accurate quotes with our comprehensive booking system that considers every detail of your move.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Calculator className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Pricing</h3>
            <p className="text-gray-600">
              Advanced algorithms consider property details, access difficulty, and special requirements
            </p>
          </div>

          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Clock className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Quotes</h3>
            <p className="text-gray-600">
              Get detailed breakdowns and pricing within seconds of completing the form
            </p>
          </div>

          <div className="text-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Transparent Pricing</h3>
            <p className="text-gray-600">
              Complete breakdown of all costs with no hidden fees or surprises
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Try Our Enhanced Quote Calculator
              </h3>
              <p className="text-gray-600 mb-4">
                Experience the most comprehensive moving quote system available
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>5-step process</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>2-3 minutes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calculator className="w-4 h-4 text-green-500" />
                  <span>Instant results</span>
                </div>
              </div>
            </div>
            
            <a
              href="/quote-demo"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Demo
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            No registration required • Fully interactive demo • Real pricing calculations
          </p>
        </div>
      </div>
    </div>
  );
};