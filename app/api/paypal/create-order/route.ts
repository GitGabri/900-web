import { NextRequest, NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';

// PayPal client configuration
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
  
  if (process.env.NODE_ENV === 'production') {
    return new paypal.core.LiveEnvironment(clientId, clientSecret);
  } else {
    return new paypal.core.SandboxEnvironment(clientId, clientSecret);
  }
}

function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

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

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json();

    // Validate required fields
    if (!body.order_price) {
      return NextResponse.json(
        { success: false, message: "Please provide order_price" },
        { status: 400 }
      );
    }

    const paypalClient = client();
    
    // Create PayPal order request
    const paypalRequest = new paypal.orders.OrdersCreateRequest();
    paypalRequest.headers['prefer'] = 'return=representation';
    
    // Build the request body
    const requestBody: any = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: body.order_price.toString(),
          },
        },
      ],
    };

    // Add items if provided
    if (body.items && body.items.length > 0) {
      const subtotal = body.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.08; // 8% tax
      
      requestBody.purchase_units[0].amount.breakdown = {
        item_total: {
          currency_code: 'USD',
          value: subtotal.toFixed(2)
        },
        tax_total: {
          currency_code: 'USD',
          value: tax.toFixed(2)
        }
      };
      
      requestBody.purchase_units[0].items = body.items.map(item => ({
        name: item.name,
        unit_amount: {
          currency_code: 'USD',
          value: item.price.toFixed(2)
        },
        quantity: item.quantity.toString(),
        description: `Sheet music by ${item.composer}`
      }));
    }

    paypalRequest.requestBody(requestBody);

    // Execute the request
    const response = await paypalClient.execute(paypalRequest);
    
    if (response.statusCode !== 201) {
      console.log("PayPal Response:", response);
      return NextResponse.json(
        { success: false, message: "Error occurred while creating PayPal order" },
        { status: 500 }
      );
    }

    // Extract order data
    const order = {
      id: response.result.id,
      status: response.result.status,
      intent: response.result.intent,
      create_time: response.result.create_time,
      links: response.result.links
    };

    // Your custom code for storing order in database
    // You can add Supabase integration here if needed
    if (body.user_id) {
      // Store order reference in your database
      console.log(`Order created for user: ${body.user_id}`);
    }

    return NextResponse.json({
      success: true,
      data: { order }
    });

  } catch (error) {
    console.log("Error at Create Order:", error);
    return NextResponse.json(
      { success: false, message: "Could not create order" },
      { status: 500 }
    );
  }
}
