import React from 'react';
import { useQuotes } from '../../hooks/useQuotes';

export const QuotesList: React.FC = () => {
  const { quotes, loading, error, refetch } = useQuotes();

  if (loading) {
    return <div className="p-4">Loading quotes...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-600 mb-2">Error: {error}</div>
        <button 
          onClick={refetch}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">All Quotes</h2>
        <button 
          onClick={refetch}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Refresh
        </button>
      </div>
      
      {quotes.length === 0 ? (
        <div className="text-gray-500">No quotes found</div>
      ) : (
        <div className="grid gap-4">
          {quotes.map((quote) => (
            <div key={quote.job_id} className="border rounded-lg p-4 shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{quote.service_type}</h3>
                  <p className="text-gray-600">{quote.property_address}</p>
                  <p className="text-sm text-gray-500">
                    Preferred Date: {new Date(quote.preferred_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    £{quote.quote_amount}
                  </div>
                  <div className="text-sm text-gray-600">
                    Deposit: £{quote.deposit_amount}
                  </div>
                  <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    quote.status === 'Awaiting Approval' 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {quote.status}
                  </div>
                </div>
              </div>
              {quote.quote_notes && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-gray-700">{quote.quote_notes}</p>
                </div>
              )}
              <div className="mt-2 text-xs text-gray-500">
                Created: {new Date(quote.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};