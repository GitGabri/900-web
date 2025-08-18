'use client'

import { useEffect } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { paypalConfig } from '@/lib/paypal';

interface PayPalButtonProps {
  amount: number;
  items: any[];
  onSuccess: (paymentResult: any) => void;
  onError: (error: any) => void;
  onCancel: () => void;
  disabled?: boolean;
}

export default function PayPalButton({ 
  amount, 
  items, 
  onSuccess, 
  onError, 
  onCancel, 
  disabled = false 
}: PayPalButtonProps) {
  const createOrder = async (data: any, actions: any) => {
    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          items,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create PayPal order');
      }

      const order = await response.json();
      return order.id;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      onError(error);
      throw error;
    }
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      const response = await fetch('/api/paypal/capture-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderID: data.orderID,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to capture PayPal payment');
      }

      const result = await response.json();
      onSuccess(result);
    } catch (error) {
      console.error('Error capturing PayPal payment:', error);
      onError(error);
    }
  };

  const onError = (err: any) => {
    console.error('PayPal error:', err);
    onError(err);
  };

  if (!paypalConfig['client-id']) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-lg">
        PayPal is not configured. Please set your PayPal Client ID in the environment variables.
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={paypalConfig}>
      <div className="w-full">
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
          onCancel={onCancel}
          disabled={disabled}
          style={{
            layout: 'vertical',
            color: 'black',
            shape: 'rect',
            label: 'pay',
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
}
