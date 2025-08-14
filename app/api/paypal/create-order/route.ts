import { NextRequest, NextResponse } from 'next/server';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const { amount, items } = await request.json();

    if (!amount || !items) {
      return NextResponse.json(
        { error: 'Amount and items are required' },
        { status: 400 }
      );
    }

    const accessToken = await getPayPalAccessToken();

    // Format items for PayPal
    const paypalItems = items.map((item: any) => ({
      name: item.name,
      quantity: item.quantity.toString(),
      unit_amount: {
        currency_code: 'USD',
        value: (typeof item.price === 'number' ? item.price : 0).toFixed(2),
      },
    }));

    // Calculate tax (8%)
    const subtotal = amount;
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: subtotal.toFixed(2),
              },
              tax_total: {
                currency_code: 'USD',
                value: tax.toFixed(2),
              },
            },
          },
          items: paypalItems,
          description: 'Sheet Music Purchase from \'900 Music',
        },
      ],
      application_context: {
        return_url: `${request.nextUrl.origin}/confirmation`,
        cancel_url: `${request.nextUrl.origin}/checkout`,
        brand_name: '\'900 Music',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        shipping_preference: 'NO_SHIPPING',
      },
    };

    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('PayPal API error:', errorData);
      throw new Error('Failed to create PayPal order');
    }

    const order = await response.json();
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return NextResponse.json(
      { error: 'Failed to create PayPal order' },
      { status: 500 }
    );
  }
}
