import React from 'react';
import { motion } from 'framer-motion';
import { DataTable } from '../../components/common/DataTable';
import { Users, Award, TrendingUp, Star, Trophy, Target } from 'lucide-react';

export const TeamPerformance: React.FC = () => {
  const teamData = [
    { id: '1', name: 'Mike Davies', role: 'Crew', jobsCompleted: 45, rating: 4.8, onTimeRate: '96%' },
    { id: '2', name: 'Tom Brown', role: 'Crew', jobsCompleted: 38, rating: 4.6, onTimeRate: '94%' },
    { id: '3', name: 'Sarah Johnson', role: 'Admin', jobsCompleted: 120, rating: 4.9, onTimeRate: '98%' },
  ];

  const columns = [
    { header: 'Name', accessor: 'name' as const },
    { header: 'Role', accessor: 'role' as const },
    { header: 'Jobs Completed', accessor: 'jobsCompleted' as const },
    { header: 'Rating', accessor: 'rating' as const },
    { header: 'On-Time Rate', accessor: 'onTimeRate' as const },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Animated Hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-2xl p-8 overflow-hidden mb-6"
      >
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"
          />
        </div>
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block bg-white/20 p-4 rounded-2xl mb-4"
          >
            <Trophy size={40} className="text-white" />
          </motion.div>
          <h2 className="text-4xl font-bold text-white mb-2">Team Performance 🏆</h2>
          <p className="text-purple-100 text-lg">Monitor individual and team excellence</p>
        </div>
      </motion.div>

      <div className="space-y-6">

      {/* Animated Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Team Members', value: teamData.length, icon: Users, gradient: 'from-blue-500 to-cyan-600', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=200&fit=crop' },
          { label: 'Avg Rating', value: '4.8', icon: Star, gradient: 'from-yellow-500 to-orange-600', img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=200&fit=crop' },
          { label: 'Avg On-Time', value: '96%', icon: Target, gradient: 'from-green-500 to-emerald-600', img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop' }
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
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mt-3 flex items-center gap-2 text-sm"
                >
                  <TrendingUp size={16} />
                  <span>Excellent!</span>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Team Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
            <Award size={28} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Team Members Leaderboard 🎯</h3>
        </div>
        <DataTable data={teamData} columns={columns} />
      </motion.div>
      </div>
    </div>
  );
};
