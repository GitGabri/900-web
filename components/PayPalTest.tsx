'use client'

import { useState } from 'react';
import PayPalButton from './PayPalButton';

export default function PayPalTest() {
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testItems = [
    {
      id: 'test-1',
      name: 'Test Sheet Music',
      price: 9.99,
      quantity: 1,
      composer: 'Test Composer',
    },
  ];

  const handleSuccess = (result: any) => {
    setPaymentResult(result);
    setError(null);
    console.log('PayPal payment successful:', result);
  };

  const handleError = (err: any) => {
    setError(err.message || 'Payment failed');
    setPaymentResult(null);
    console.error('PayPal payment error:', err);
  };

  const handleCancel = () => {
    setError('Payment was cancelled');
    setPaymentResult(null);
    console.log('PayPal payment cancelled');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">PayPal Test</h2>
      
      <div className="mb-4">
        <p className="text-gray-600 mb-2">Test Amount: $10.79 (includes 8% tax)</p>
        <p className="text-sm text-gray-500">This is a test payment using PayPal Sandbox</p>
      </div>

      <PayPalButton
        amount={10.79}
        items={testItems}
        onSuccess={handleSuccess}
        onError={handleError}
        onCancel={handleCancel}
      />

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      {paymentResult && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded">
          <h3 className="font-semibold">Payment Successful!</h3>
          <p className="text-sm mt-1">Transaction ID: {paymentResult.payment.transactionId}</p>
          <p className="text-sm">Amount: ${paymentResult.payment.amount}</p>
        </div>
      )}
    </div>
  );
}
