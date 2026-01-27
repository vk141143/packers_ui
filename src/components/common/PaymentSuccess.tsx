import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, X, Loader2 } from 'lucide-react';

interface PaymentSuccessProps {
  amount: number;
  orderId: string;
  status?: 'success' | 'failed' | 'pending';
  onComplete?: () => void;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ amount, orderId, status = 'success', onComplete }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const config = {
    success: {
      color: 'green',
      icon: Check,
      title: 'Payment Successful!',
      message: 'Your booking has been confirmed',
      redirect: 'Redirecting to your bookings...',
      borderColor: 'border-green-500',
      bgColor: 'bg-green-500',
      textColor: 'text-green-600',
      shadowColor: 'rgba(34, 197, 94, 0.3)',
      shadowColorHover: 'rgba(34, 197, 94, 0.5)',
      gradient: 'conic-gradient(from 0deg, transparent, #22c55e, transparent, #22c55e, transparent)',
    },
    failed: {
      color: 'red',
      icon: X,
      title: 'Payment Failed',
      message: 'There was an issue processing your payment',
      redirect: 'Please try again or contact support',
      borderColor: 'border-red-500',
      bgColor: 'bg-red-500',
      textColor: 'text-red-600',
      shadowColor: 'rgba(239, 68, 68, 0.3)',
      shadowColorHover: 'rgba(239, 68, 68, 0.5)',
      gradient: 'conic-gradient(from 0deg, transparent, #ef4444, transparent, #ef4444, transparent)',
    },
    pending: {
      color: 'yellow',
      icon: Loader2,
      title: 'Processing Payment...',
      message: 'Please wait while we process your payment',
      redirect: 'This may take a few moments',
      borderColor: 'border-yellow-500',
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      shadowColor: 'rgba(234, 179, 8, 0.3)',
      shadowColorHover: 'rgba(234, 179, 8, 0.5)',
      gradient: 'conic-gradient(from 0deg, transparent, #eab308, transparent, #eab308, transparent)',
    },
  }[status];

  const Icon = config.icon;

  useEffect(() => {
    if (status === 'success') {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }));
      setParticles(newParticles);
    }

    if (onComplete && status === 'success') {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [onComplete, status]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative"
      >
        {status === 'success' && particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              backgroundColor: ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b'][particle.id % 5],
            }}
            initial={{ scale: 0, y: 0 }}
            animate={{
              scale: [0, 1, 1, 0],
              y: [0, -100, -200, -300],
              x: [(Math.random() - 0.5) * 200],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              delay: particle.id * 0.02,
              ease: 'easeOut',
            }}
          />
        ))}

        <motion.div
          className={`rounded-2xl border-2 ${config.borderColor} bg-white p-8 text-center relative overflow-hidden min-w-96 shadow-2xl`}
          animate={{
            boxShadow: [
              `0 0 20px ${config.shadowColor}`,
              `0 0 40px ${config.shadowColorHover}`,
              `0 0 20px ${config.shadowColor}`,
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ background: config.gradient }}
          />

          <motion.div
            initial={{ scale: 0, rotate: status === 'pending' ? 0 : -180 }}
            animate={{ scale: 1, rotate: status === 'pending' ? 360 : 0 }}
            transition={status === 'pending' ? { duration: 1, repeat: Infinity, ease: 'linear' } : { type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${config.bgColor} relative z-10`}
          >
            <motion.div animate={status !== 'pending' ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 1, repeat: Infinity }}>
              <Icon className="h-8 w-8 text-white" />
            </motion.div>
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`mb-2 text-2xl font-bold ${config.textColor} relative z-10`}
          >
            {config.title}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 relative z-10 mb-4"
          >
            {config.message}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-gray-500 relative z-10 space-y-1"
          >
            <p>Order #: {orderId}</p>
            <p className="text-lg font-bold text-gray-900">Total: £{amount.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className={`mt-4 flex items-center justify-center gap-2 ${config.textColor}`}
          >
            {status === 'success' && <Sparkles className="w-4 h-4" />}
            <span className="text-sm">{config.redirect}</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
