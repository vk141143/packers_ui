import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Calendar, Clock, MapPin, Package, Download, FileText } from "lucide-react";

interface BookingSuccessAnimationProps {
  bookingDetails: {
    jobId: string;
    serviceType: string;
    date: string;
    time: string;
    propertyAddress: string;
    slaType: string;
    totalAmount?: number;
  };
  onComplete: () => void;
  assignmentStatus?: 'idle' | 'assigning' | 'assigned' | 'failed';
  onRetryAssign?: () => Promise<void>;
}

export const BookingSuccessAnimation: React.FC<BookingSuccessAnimationProps> = ({
  bookingDetails,
  onComplete,
  assignmentStatus = 'idle',
  onRetryAssign,
  onDownloadInvoice,
}) => {
  const [stage, setStage] = useState<"initial" | "success" | "details" | "complete">("initial");
  const [progress, setProgress] = useState(0);

  const generateInvoice = () => {
    const invoiceContent = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          UK PACKERS & MOVERS
       Professional Property Clearance
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INVOICE

Job ID: ${bookingDetails.jobId}
Date: ${new Date().toLocaleDateString('en-GB')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BOOKING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Service Type: ${bookingDetails.serviceType}
Scheduled Date: ${bookingDetails.date}
Scheduled Time: ${bookingDetails.time}
Property Address: ${bookingDetails.propertyAddress}
SLA Type: ${bookingDetails.slaType}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAYMENT SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Amount: £${bookingDetails.totalAmount?.toLocaleString()}
Status: Confirmed
Payment Method: To be arranged

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for choosing UK Packers & Movers!

For support: info@ukpackersmovers.co.uk
Phone: 0800 123 4567

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${bookingDetails.jobId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const timer1 = setTimeout(() => setStage("success"), 500);
    const timer2 = setTimeout(() => setStage("details"), 2000);
    const timer3 = setTimeout(() => setStage("complete"), 4500);
    const timer4 = setTimeout(() => onComplete(), 5500);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 2));
    }, 40);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 z-50">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <AnimatePresence mode="wait">
        {stage === "initial" && (
          <motion.div
            key="initial"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10"
          >
            <motion.div className="flex flex-col items-center space-y-4">
              <motion.div
                className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.p className="text-white/80 text-lg">Processing your booking...</motion.p>
            </motion.div>
          </motion.div>
        )}

        {stage === "success" && (
          <motion.div
            key="success"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10 flex flex-col items-center"
          >
            <motion.div
              className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Check className="w-16 h-16 text-white" strokeWidth={3} />
            </motion.div>

            <motion.h2 variants={itemVariants} className="mt-8 text-4xl font-bold text-white text-center">
              Booking Confirmed!
            </motion.h2>

            <motion.p variants={itemVariants} className="mt-4 text-white/70 text-lg text-center max-w-md">
              Job ID: {bookingDetails.jobId}
            </motion.p>

            <motion.div variants={itemVariants} className="mt-8 w-64 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-green-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </motion.div>
          </motion.div>
        )}

        {stage === "details" && (
          <motion.div
            key="details"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10 max-w-2xl w-full"
          >
            <motion.div
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Booking Confirmed</h3>
                    <p className="text-white/60 text-sm">Job ID: {bookingDetails.jobId}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={containerVariants} className="space-y-4">
                <motion.div
                  variants={itemVariants}
                  className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10"
                >
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/60 text-sm">Service</p>
                    <p className="text-white font-medium">{bookingDetails.serviceType}</p>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10"
                >
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/60 text-sm">Date & Time</p>
                    <p className="text-white font-medium">{bookingDetails.date} at {bookingDetails.time}</p>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10"
                >
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/60 text-sm">Property Address</p>
                    <p className="text-white font-medium text-sm">{bookingDetails.propertyAddress}</p>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10"
                >
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/60 text-sm">SLA Type</p>
                    <p className="text-white font-medium">{bookingDetails.slaType}</p>
                  </div>
                </motion.div>

                {bookingDetails.totalAmount && (
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30"
                  >
                    <div className="flex-1 text-center">
                      <p className="text-white/80 text-sm mb-1">Total Amount</p>
                      <p className="text-white font-black text-3xl">£{bookingDetails.totalAmount.toLocaleString()}</p>
                    </div>
                  </motion.div>
                )}

                <motion.div className="space-y-3">
                  <motion.button
                    variants={itemVariants}
                    onClick={onDownloadInvoice ? onDownloadInvoice : generateInvoice}
                    className="w-full flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl text-white font-semibold transition-all shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download size={20} />
                    Download Invoice
                  </motion.button>
                </motion.div>
                {/* Assignment status and retry */}
                {assignmentStatus === 'assigning' && (
                  <div className="mt-4 text-center text-sm text-white/70">Assigning crew...</div>
                )}
                {assignmentStatus === 'failed' && (
                  <div className="mt-4 space-y-3">
                    <p className="text-center text-sm text-red-300">Automatic crew assignment failed.</p>
                    <button
                      onClick={async () => { if (onRetryAssign) await onRetryAssign(); }}
                      className="w-full py-3 bg-yellow-500 text-black font-semibold rounded-lg"
                    >
                      Retry Assignment
                    </button>
                  </div>
                )}
                {assignmentStatus === 'assigned' && (
                  <div className="mt-4 text-center text-sm text-green-300">Crew assigned — check Job History for details.</div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {stage === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 text-center"
          >
            <motion.div
              className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            >
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-4">All Set!</h2>
            <p className="text-white/70 text-lg">Redirecting to Job History...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
