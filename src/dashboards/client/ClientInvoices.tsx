import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getClientInvoices, downloadClientInvoice } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Download, FileText, Calendar, DollarSign, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export const ClientInvoices: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await getClientInvoices();
        if (response.success && response.data) {
          setInvoices(response.data.invoices || []);
          setTotalInvoices(response.data.total_invoices || 0);
        } else {
          setError(response.error || 'Failed to fetch invoices');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleDownloadInvoice = async (invoiceId: string) => {
    setDownloading(invoiceId);
    try {
      const response = await downloadClientInvoice(invoiceId);
      if (!response.success) {
        alert(`Download failed: ${response.error}`);
      }
    } catch (error) {
      alert(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setDownloading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Loading invoices...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load invoices</h2>
          <p className="text-gray-600">There was an error loading your invoices.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                My Invoices 📄
              </h1>
              <p className="text-gray-600 text-lg">View and download your completed job invoices</p>
            </div>
            <div className="text-right">
              <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-lg p-4">
                <p className="text-sm text-green-700 font-medium">Total Invoices</p>
                <p className="text-3xl font-bold text-green-800">{totalInvoices}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Invoices List */}
        {invoices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Invoices Yet</h3>
            <p className="text-gray-600 text-lg mb-2">You don't have any completed jobs with invoices</p>
            <p className="text-sm text-gray-500">Invoices will appear here once your jobs are completed and verified</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice, index) => (
              <motion.div
                key={invoice.invoice_id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">Invoice #{invoice.invoice_id}</h3>
                            <Badge className="bg-green-100 text-green-700 border-0">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {invoice.status || 'Paid'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">Job ID: {invoice.job_id}</p>
                          <p className="text-sm text-gray-600">
                            {invoice.service_type || 'Service'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownloadInvoice(invoice.invoice_id)}
                        disabled={downloading === invoice.invoice_id}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {downloading === invoice.invoice_id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        Download
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Invoice Date</span>
                        </div>
                        <p className="font-semibold text-gray-900">{invoice.created_at ? formatDate(invoice.created_at) : 'N/A'}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Total Amount</span>
                        </div>
                        <p className="font-semibold text-gray-900">{invoice.total_amount ? formatCurrency(invoice.total_amount) : 'N/A'}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Payment Status</span>
                        </div>
                        <p className="font-semibold text-green-600">{invoice.payment_status || 'Paid in Full'}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Property:</span> {invoice.property_address || 'N/A'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
