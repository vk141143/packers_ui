import React from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  FileText, 
  Video, 
  AlertCircle,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';

interface HelpSupportProps {
  userRole: 'client' | 'admin' | 'crew' | 'management' | 'sales';
}

export const HelpSupport: React.FC<HelpSupportProps> = ({ userRole }) => {
  const roleSpecificHelp = {
    client: {
      title: 'Client Help & Support',
      sections: [
        { title: 'Booking Help', icon: FileText, items: ['How to request a quote', 'Understanding pricing', 'Scheduling your move', 'Payment options'] },
        { title: 'Tracking & Updates', icon: Clock, items: ['Track your job status', 'Receive notifications', 'Contact your crew', 'Report issues'] },
        { title: 'Account Management', icon: Users, items: ['Update profile', 'Manage addresses', 'Payment methods', 'View history'] }
      ]
    },
    admin: {
      title: 'Admin Help & Support',
      sections: [
        { title: 'User Management', icon: Users, items: ['Approve new users', 'Manage permissions', 'Reset passwords', 'Deactivate accounts'] },
        { title: 'Operations', icon: CheckCircle, items: ['Job verification', 'Crew assignment', 'SLA monitoring', 'Quality control'] },
        { title: 'System Admin', icon: AlertCircle, items: ['System settings', 'Backup procedures', 'Security protocols', 'Troubleshooting'] }
      ]
    },
    crew: {
      title: 'Crew Help & Support',
      sections: [
        { title: 'Job Management', icon: FileText, items: ['Accept job assignments', 'Update job status', 'Upload photos', 'Complete checklists'] },
        { title: 'Communication', icon: MessageCircle, items: ['Contact dispatch', 'Client communication', 'Report issues', 'Emergency contacts'] },
        { title: 'Safety & Training', icon: AlertCircle, items: ['Safety protocols', 'Equipment guidelines', 'Training materials', 'Incident reporting'] }
      ]
    },
    management: {
      title: 'Management Help & Support',
      sections: [
        { title: 'Analytics & Reports', icon: FileText, items: ['Performance metrics', 'Team analytics', 'Financial reports', 'SLA tracking'] },
        { title: 'Team Management', icon: Users, items: ['Staff scheduling', 'Performance reviews', 'Training programs', 'Resource allocation'] },
        { title: 'Strategic Planning', icon: CheckCircle, items: ['Business insights', 'Growth planning', 'Process optimization', 'Quality improvement'] }
      ]
    },
    sales: {
      title: 'Sales Help & Support',
      sections: [
        { title: 'Lead Management', icon: Users, items: ['Lead qualification', 'Pipeline management', 'Follow-up strategies', 'Conversion tracking'] },
        { title: 'Client Relations', icon: MessageCircle, items: ['Client communication', 'Quote preparation', 'Negotiation tips', 'Closing techniques'] },
        { title: 'Sales Tools', icon: FileText, items: ['CRM usage', 'Pricing guidelines', 'Marketing materials', 'Performance tracking'] }
      ]
    }
  };

  const currentHelp = roleSpecificHelp[userRole];

  const contactMethods = [
    { icon: Phone, label: 'Call Support', value: '+44 800 123 4567', color: 'green' },
    { icon: Mail, label: 'Email Support', value: 'support@moveaway.co.uk', color: 'blue' },
    { icon: MessageCircle, label: 'Live Chat', value: 'Available 24/7', color: 'purple' },
    { icon: Video, label: 'Video Call', value: 'Schedule a session', color: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle size={32} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentHelp.title}</h1>
          <p className="text-gray-600">Get help with your account and learn how to use the platform</p>
        </motion.div>

        {/* Quick Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={method.label}
                  whileHover={{ scale: 1.05 }}
                  className={`p-4 rounded-xl border-2 border-${method.color}-200 hover:border-${method.color}-400 cursor-pointer transition-all`}
                >
                  <div className={`w-10 h-10 bg-${method.color}-100 rounded-lg flex items-center justify-center mb-3`}>
                    <Icon size={20} className={`text-${method.color}-600`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{method.label}</h3>
                  <p className="text-xs text-gray-600 mt-1">{method.value}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Help Sections */}
        <div className="grid gap-6">
          {currentHelp.sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon size={20} className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {section.items.map((item, itemIndex) => (
                    <motion.div
                      key={item}
                      whileHover={{ scale: 1.02 }}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <p className="text-sm text-gray-700">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6 mt-8"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {[
              'How do I reset my password?',
              'How can I update my profile information?',
              'What should I do if I encounter a technical issue?',
              'How do I contact customer support?',
              'Where can I find training materials?'
            ].map((faq, index) => (
              <motion.div
                key={faq}
                whileHover={{ scale: 1.01 }}
                className="p-3 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <p className="text-sm text-gray-700">{faq}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mt-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle size={24} className="text-red-600" />
            <h3 className="text-lg font-bold text-red-900">Emergency Support</h3>
          </div>
          <p className="text-red-700 mb-3">For urgent issues or emergencies, contact us immediately:</p>
          <div className="flex items-center gap-4">
            <a href="tel:+448001234567" className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              📞 Emergency Hotline
            </a>
            <span className="text-red-600 font-semibold">+44 800 123 4567</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};