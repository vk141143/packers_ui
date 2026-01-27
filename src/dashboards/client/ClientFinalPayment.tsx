import React, { useState } from 'react';
import { useJobStore } from '../../store/jobStore';
import { CreditCard, CheckCircle } from 'lucide-react';
import { InvoiceGenerator } from '../../components/common/InvoiceGenerator';

export const ClientFinalPayment: React.FC = () => {
  const { jobs, updateJob, processFinalPayment } = useJobStore();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceJob, setInvoiceJob] = useState<any>(null);

  const finalPaymentJobs = jobs.filter(job => job.status === 'final-payment-pending');

  const handleFinalPayment = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    
    const totalAmount = job.verifiedFinalPrice || job.finalQuote?.fixedPrice || job.estimatedValue || 0;
    const depositPaid = job.finalQuote?.depositAmount || 0;
    const remainingAmount = totalAmount - depositPaid;
    
    // Process final payment using the store method
    const paymentData = {
      amount: remainingAmount,
      paidAt: new Date().toISOString(),
      transactionId: `txn_${Date.now()}`,
      method: 'card'
    };
    
    const result = processFinalPayment(jobId, paymentData);
    
    if (result.success) {
      const updatedJob = jobs.find(j => j.id === jobId);
      if (updatedJob) {
        setInvoiceJob(updatedJob);
        setShowInvoice(true);
        setSelectedJob(null);
      }
    } else {
      alert(`❌ Payment Failed: ${result.error}`);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Final Payment</h2>
      
      {finalPaymentJobs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No jobs pending final payment
        </div>
      ) : (
        <div className="space-y-4">
          {finalPaymentJobs.map((job) => {
            // Use accepted quote amount as definitive total
            const totalAmount = job.finalQuote?.fixedPrice || job.estimatedValue || 0;
            const depositPaid = job.finalQuote?.depositAmount || 0;
            const remainingAmount = totalAmount - depositPaid;
            
            return (
              <div key={job.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Job #{job.id}</h3>
                    <p className="text-gray-600">{job.from} → {job.to}</p>
                    <p className="text-sm text-gray-500">{job.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total: £{totalAmount}</p>
                    <p className="text-sm text-gray-600">Paid: £{depositPaid}</p>
                    <p className="text-lg font-bold text-blue-600">
                      Due: £{remainingAmount}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <button
                    onClick={() => setSelectedJob(job.id)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <CreditCard className="w-4 h-4" />
                    Pay Final Amount
                  </button>
                </div>

                {selectedJob === job.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-3">Payment Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Amount Due:</span>
                        <span className="font-bold">£{remainingAmount}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleFinalPayment(job.id)}
                          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Complete Payment
                        </button>
                        <button
                          onClick={() => setSelectedJob(null)}
                          className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoice && invoiceJob && (
        <InvoiceGenerator
          job={invoiceJob}
          onClose={() => {
            setShowInvoice(false);
            setInvoiceJob(null);
          }}
        />
      )}
    </div>
  );
};