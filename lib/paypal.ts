// PayPal configuration and utilities
export const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';

export const paypalConfig = {
  clientId: PAYPAL_CLIENT_ID,
  currency: 'USD',
  intent: 'capture',
};

// PayPal payment creation utility
export const createPayPalOrder = async (amount: number, items: any[]) => {
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
    throw error;
  }
};

// PayPal payment capture utility
export const capturePayPalPayment = async (orderID: string) => {
  try {
    const response = await fetch('/api/paypal/capture-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderID,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to capture PayPal payment');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error capturing PayPal payment:', error);
    throw error;
  }
};
