import React from 'react';
import { Job } from '../../types';
import { Download, FileText } from 'lucide-react';

interface InvoiceGeneratorProps {
  job: Job;
  onClose: () => void;
}

export const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ job, onClose }) => {
  const totalAmount = job.verifiedFinalPrice || job.finalQuote?.fixedPrice || job.estimatedValue || 0;
  const depositPaid = job.finalQuote?.depositAmount || 0;
  const remainingAmount = totalAmount - depositPaid;
  const invoiceNumber = `INV-${job.id}-${Date.now()}`;
  const invoiceDate = new Date().toLocaleDateString();

  const handleDownload = () => {
    const invoiceContent = `
INVOICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Packers & Movers Ltd.
123 Business Street
London, UK
VAT: GB123456789

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Invoice Number: ${invoiceNumber}
Invoice Date: ${invoiceDate}
Job ID: ${job.immutableReferenceId || job.id}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BILL TO:
${job.clientName}
${job.propertyAddress}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SERVICE DETAILS:
Service Type: ${job.serviceType.replace('-', ' ').toUpperCase()}
Property Type: ${job.propertyType}
Scheduled Date: ${new Date(job.scheduledDate).toLocaleDateString()}
Completed Date: ${job.finalPayment?.paidAt ? new Date(job.finalPayment.paidAt).toLocaleDateString() : 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAYMENT BREAKDOWN:

Description                          Amount
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Service Charge                 £${totalAmount.toFixed(2)}
Deposit Paid                        -£${depositPaid.toFixed(2)}
                                    ─────────────
Final Payment                        £${remainingAmount.toFixed(2)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAYMENT TRANSACTIONS:

1. Deposit Payment
   Amount: £${depositPaid.toFixed(2)}
   Date: ${job.finalQuote?.depositPaidAt ? new Date(job.finalQuote.depositPaidAt).toLocaleDateString() : 'N/A'}
   Transaction ID: ${job.finalQuote?.depositTransactionId || 'N/A'}
   Method: ${job.finalQuote?.depositPaymentMethod || 'Card'}

2. Final Payment
   Amount: £${remainingAmount.toFixed(2)}
   Date: ${job.finalPayment?.paidAt ? new Date(job.finalPayment.paidAt).toLocaleDateString() : 'N/A'}
   Transaction ID: ${job.finalPayment?.transactionId || 'N/A'}
   Method: ${job.finalPayment?.method || 'Card'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TOTAL PAID: £${totalAmount.toFixed(2)}

Status: PAID IN FULL ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for your business!

For any queries, contact us at:
Email: support@packersmovers.com
Phone: +44 20 1234 5678

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${invoiceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText size={32} />
              <h2 className="text-2xl font-bold">Invoice</h2>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              ✕
            </button>
          </div>
          <p className="text-green-100">Payment Successful - Invoice Generated</p>
        </div>

        {/* Invoice Content */}
        <div className="p-8" id="invoice-content">
          {/* Company Info */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Packers & Movers Ltd.</h3>
            <p className="text-gray-600">123 Business Street, London, UK</p>
            <p className="text-gray-600">VAT: GB123456789</p>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-6 mb-8 pb-6 border-b">
            <div>
              <p className="text-sm text-gray-600 mb-1">Invoice Number</p>
              <p className="font-bold text-gray-900">{invoiceNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Invoice Date</p>
              <p className="font-bold text-gray-900">{invoiceDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Job ID</p>
              <p className="font-bold text-gray-900">{job.immutableReferenceId || job.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <p className="font-bold text-green-600">PAID IN FULL ✓</p>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">BILL TO:</h4>
            <p className="font-bold text-gray-900">{job.clientName}</p>
            <p className="text-gray-600">{job.propertyAddress}</p>
          </div>

          {/* Service Details */}
          <div className="mb-8 bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Service Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Service Type:</span>
                <span className="ml-2 font-medium">{job.serviceType.replace('-', ' ')}</span>
              </div>
              <div>
                <span className="text-gray-600">Property Type:</span>
                <span className="ml-2 font-medium">{job.propertyType}</span>
              </div>
              <div>
                <span className="text-gray-600">Scheduled Date:</span>
                <span className="ml-2 font-medium">{new Date(job.scheduledDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Completed Date:</span>
                <span className="ml-2 font-medium">
                  {job.finalPayment?.paidAt ? new Date(job.finalPayment.paidAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-4">Payment Breakdown</h4>
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">Description</th>
                  <th className="text-right p-3 text-sm font-semibold text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 text-gray-900">Total Service Charge</td>
                  <td className="p-3 text-right font-medium">£{totalAmount.toFixed(2)}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 text-gray-900">Deposit Paid</td>
                  <td className="p-3 text-right font-medium text-green-600">-£{depositPaid.toFixed(2)}</td>
                </tr>
                <tr className="bg-blue-50 font-bold">
                  <td className="p-3 text-gray-900">Final Payment</td>
                  <td className="p-3 text-right text-blue-600">£{remainingAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Transaction History */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-4">Payment Transactions</h4>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-gray-900">1. Deposit Payment</span>
                  <span className="font-bold text-green-600">£{depositPaid.toFixed(2)}</span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Date: {job.finalQuote?.depositPaidAt ? new Date(job.finalQuote.depositPaidAt).toLocaleDateString() : 'N/A'}</p>
                  <p>Transaction ID: {job.finalQuote?.depositTransactionId || 'N/A'}</p>
                  <p>Method: {job.finalQuote?.depositPaymentMethod || 'Card'}</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-gray-900">2. Final Payment</span>
                  <span className="font-bold text-blue-600">£{remainingAmount.toFixed(2)}</span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Date: {job.finalPayment?.paidAt ? new Date(job.finalPayment.paidAt).toLocaleDateString() : 'N/A'}</p>
                  <p>Transaction ID: {job.finalPayment?.transactionId || 'N/A'}</p>
                  <p>Method: {job.finalPayment?.method || 'Card'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">TOTAL PAID</span>
              <span className="text-3xl font-bold">£{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 border-t pt-6">
            <p className="font-semibold text-gray-900 mb-2">Thank you for your business!</p>
            <p>For any queries, contact us at:</p>
            <p>Email: support@packersmovers.com | Phone: +44 20 1234 5678</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 p-6 flex gap-4 justify-end border-t">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Download size={20} />
            Download Invoice
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            <FileText size={20} />
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};
