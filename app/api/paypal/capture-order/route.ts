import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import paypal from '@paypal/checkout-server-sdk';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

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

interface CaptureOrderRequest {
  orderID: string;
  orderData?: {
    orderId: string;
    customer: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      organization?: string;
    };
    address: any;
    items: Array<{
      name: string;
      price: number;
      quantity: number;
      composer: string;
    }>;
    notes?: string;
    orderDate: string;
    total: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: CaptureOrderRequest = await request.json();

    if (!body.orderID) {
      return NextResponse.json(
        { success: false, message: "Please provide orderID" },
        { status: 400 }
      );
    }

    console.log("Capturing order:", body.orderID);

    try {
      // Capture the PayPal order using the SDK
      const request = new paypal.orders.OrdersCaptureRequest(body.orderID);
      
      console.log("PayPal capture request for order:", body.orderID);

      const response = await client().execute(request);
      console.log("PayPal capture response status:", response.statusCode);
      console.log("PayPal capture response result:", response.result);

      if (response.statusCode === 201) {
        const captureData = response.result;
        console.log("PayPal capture successful:", captureData);

    // If payment is successful and we have order data, save to Supabase
    if (captureData.status === 'COMPLETED' && body.orderData) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .insert([
            {
              order_id: body.orderData.orderId,
              customer_name: `${body.orderData.customer.firstName} ${body.orderData.customer.lastName}`,
              customer_email: body.orderData.customer.email,
              customer_phone: body.orderData.customer.phone,
              customer_organization: body.orderData.customer.organization,
              shipping_address: JSON.stringify(body.orderData.address),
              order_items: JSON.stringify(body.orderData.items),
              order_total: body.orderData.total,
              notes: body.orderData.notes,
              order_date: body.orderData.orderDate,
              status: 'paid',
              payment_method: 'paypal',
              payment_id: captureData.id,
              paypal_order_id: body.orderID,
            },
          ]);

        if (error) {
          console.error('Supabase error:', error);
          return NextResponse.json(
            { success: false, message: "Payment successful but failed to save order" },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          data: {
            capture: captureData,
            order: data
          }
        });

      } catch (dbError) {
        console.error('Database error:', dbError);
        return NextResponse.json(
          { success: false, message: "Payment successful but failed to save order" },
          { status: 500 }
        );
      }
    }

        return NextResponse.json({
          success: true,
          data: { capture: captureData }
        });
      } else {
        throw new Error(`PayPal capture API returned status ${response.statusCode}`);
      }

    } catch (paypalError) {
      console.error("PayPal capture error:", paypalError);
      throw paypalError;
    }

  } catch (error) {
    console.log("Error at Capture Order:", error);
    console.log("Error details:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { success: false, message: "Could not capture payment" },
      { status: 500 }
    );
  }
}
