import React, { useState, useEffect } from 'react';

interface Quote {
  id: string;
  clientName: string;
  finalPrice: number;
  services: string[];
  estimatedDate: string;
  status: 'pending_approval' | 'approved' | 'rejected';
}

export const ClientApprovalDashboard: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    fetchPendingQuotes();
  }, []);

  const fetchPendingQuotes = async () => {
    try {
      const response = await fetch('/api/quotes/pending-approval');
      const data = await response.json();
      setQuotes(data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  const handleApproval = async (quoteId: string, approved: boolean) => {
    try {
      await fetch(`/api/quotes/${quoteId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved })
      });
      fetchPendingQuotes();
    } catch (error) {
      console.error('Error updating quote:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quote Approval</h1>
      
      {quotes.map(quote => (
        <div key={quote.id} className="border rounded-lg p-4 mb-4 bg-white shadow">
          <h3 className="text-lg font-semibold">{quote.clientName}</h3>
          <p className="text-2xl font-bold text-green-600">${quote.finalPrice}</p>
          <p className="text-gray-600">Services: {quote.services.join(', ')}</p>
          <p className="text-gray-600">Estimated Date: {quote.estimatedDate}</p>
          
          <div className="mt-4 space-x-2">
            <button
              onClick={() => handleApproval(quote.id, true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Approve & Pay Deposit
            </button>
            <button
              onClick={() => handleApproval(quote.id, false)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};