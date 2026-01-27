import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, FileText, Target, Phone, Mail, Building, DollarSign, Zap } from 'lucide-react';

export const SalesDashboard: React.FC = () => {
  const leads = [
    { name: 'Manchester Council', type: 'Council', status: 'Hot', value: '£45k/year' },
    { name: 'Bristol Housing', type: 'Housing Assoc', status: 'Warm', value: '£32k/year' },
    { name: 'Leeds Landlords Ltd', type: 'Landlord', status: 'Cold', value: '£18k/year' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 rounded-2xl p-8 overflow-hidden mb-6"
      >
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl"
          />
        </div>
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block bg-white/20 p-4 rounded-2xl mb-4"
          >
            <TrendingUp size={40} className="text-white" />
          </motion.div>
          <h2 className="text-4xl font-bold text-white mb-2">Sales Pipeline 📈</h2>
          <p className="text-green-100 text-lg">Client onboarding & contract management</p>
        </div>
      </motion.div>

      <div className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Leads', value: '24', icon: Users, gradient: 'from-blue-500 to-cyan-600', img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=200&fit=crop' },
          { label: 'Contracts Signed', value: '8', icon: FileText, gradient: 'from-green-500 to-emerald-600', img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=200&fit=crop' },
          { label: 'Pipeline Value', value: '£285k', icon: DollarSign, gradient: 'from-purple-500 to-pink-600', img: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=200&fit=crop' },
          { label: 'Conversion Rate', value: '33%', icon: Target, gradient: 'from-orange-500 to-red-600', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative overflow-hidden rounded-2xl shadow-xl"
            >
              <img src={stat.img} alt="" className="absolute inset-0 w-full h-full object-cover brightness-50" />
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-90`} />
              <div className="relative z-10 p-6 text-white">
                <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={28} className="text-white" />
                </div>
                <p className="text-white/90 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-4xl font-bold">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl">
            <Zap size={28} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Active Leads Pipeline ⚡</h3>
        </div>
        <div className="space-y-4">
          {leads.map((lead, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="relative overflow-hidden rounded-xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=150&fit=crop" 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover brightness-50"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-800/80" />
              <div className="relative z-10 flex items-center justify-between p-6 text-white">
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/20 backdrop-blur-sm p-4 rounded-xl"
                  >
                    <Building size={28} className="text-white" />
                  </motion.div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">{lead.name}</h4>
                    <p className="text-gray-300">{lead.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className={`px-4 py-2 rounded-xl text-sm font-bold ${
                      lead.status === 'Hot' ? 'bg-red-500 text-white' :
                      lead.status === 'Warm' ? 'bg-yellow-500 text-white' :
                      'bg-blue-500 text-white'
                    }`}
                  >
                    {lead.status === 'Hot' ? '🔥' : lead.status === 'Warm' ? '☀️' : '❄️'} {lead.status}
                  </motion.span>
                  <span className="text-2xl font-bold">{lead.value}</span>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all"
                    >
                      <Phone size={20} className="text-white" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all"
                    >
                      <Mail size={20} className="text-white" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      </div>
    </div>
  );
};
