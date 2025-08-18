import { NextRequest, NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';

// Types for the request body
interface CreateOrderRequest {
  order_price: number;
  user_id?: string;
  items?: Array<{
    name: string;
    price: number;
    quantity: number;
    composer: string;
  }>;
  customer?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

// PayPal client configuration
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not found in environment variables');
  }

  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json();

    // Validate required fields
    if (!body.order_price) {
      console.log("Missing order_price in request");
      return NextResponse.json(
        { success: false, message: "Please provide order_price" },
        { status: 400 }
      );
    }

    try {
      // Create PayPal order using the SDK
      const request = new paypal.orders.OrdersCreateRequest();
      
      // Calculate subtotal and tax
      const subtotal = body.order_price / 1.08; // Remove tax to get subtotal
      const tax = body.order_price - subtotal;
      
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: body.order_price.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: subtotal.toFixed(2)
              },
              tax_total: {
                currency_code: 'USD',
                value: tax.toFixed(2)
              }
            }
          },
          items: body.items?.map(item => ({
            name: item.name,
            unit_amount: {
              currency_code: 'USD',
              value: item.price.toFixed(2)
            },
            quantity: item.quantity.toString(),
            description: `by ${item.composer}`
          })) || []
        }]
      });

      const response = await client().execute(request);

      if (response.statusCode === 201) {
        const order = response.result;
        
        return NextResponse.json({
          success: true,
          data: { order }
        });
      } else {
        throw new Error(`PayPal API returned status ${response.statusCode}`);
      }

    } catch (paypalError) {
      throw paypalError;
    }

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Could not create order" },
      { status: 500 }
    );
  }
}
