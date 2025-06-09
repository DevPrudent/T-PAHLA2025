import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@3.4.0";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'noreply@tpahla.africa';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface PaymentPayload {
  paymentId: string;
  registrationId: string;
  fullName: string;
  email: string;
  amount: number;
  transactionReference: string;
  paymentMethod: string;
  participationType: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Check if Resend API key is configured
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return new Response(
      JSON.stringify({
        error: "Email service not configured. Please set RESEND_API_KEY environment variable.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Initialize Resend client
    const resend = new Resend(RESEND_API_KEY);

    // Parse request body
    const payload: PaymentPayload = await req.json();

    // Validate required fields
    if (!payload.email || !payload.fullName || !payload.amount) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: email, fullName, or amount",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Format date
    const paymentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Create email HTML content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TPAHLA 2025 Payment Confirmation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #0A3B1F;
            color: #E6C670;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 20px;
            background-color: #f9f9f9;
          }
          .footer {
            background-color: #f1f1f1;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .receipt {
            background-color: #fff;
            border: 1px solid #ddd;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .receipt-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .receipt-row:last-child {
            border-bottom: none;
            font-weight: bold;
          }
          .button {
            display: inline-block;
            background-color: #E6C670;
            color: #0A3B1F;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>TPAHLA 2025</h1>
            <p>The Pan-African Humanitarian Leadership Award</p>
          </div>
          <div class="content">
            <h2>Payment Confirmation</h2>
            <p>Dear ${payload.fullName},</p>
            <p>Thank you for your payment. Your registration for TPAHLA 2025 is now confirmed!</p>
            
            <div class="receipt">
              <h3 style="text-align: center; margin-top: 0;">PAYMENT RECEIPT</h3>
              <div class="receipt-row">
                <strong>Transaction ID:</strong>
                <span>${payload.transactionReference || payload.paymentId}</span>
              </div>
              <div class="receipt-row">
                <strong>Date:</strong>
                <span>${paymentDate}</span>
              </div>
              <div class="receipt-row">
                <strong>Payment Method:</strong>
                <span>${payload.paymentMethod || 'Online Payment'}</span>
              </div>
              <div class="receipt-row">
                <strong>Registration Type:</strong>
                <span>${payload.participationType || 'Event Registration'}</span>
              </div>
              <div class="receipt-row">
                <strong>Amount Paid:</strong>
                <span>$${payload.amount.toLocaleString()}</span>
              </div>
            </div>
            
            <h3>What's Next?</h3>
            <p>
              You will receive additional information about the event, including the detailed schedule and venue information, closer to the event date. Please keep this receipt for your records.
            </p>
            
            <a href="https://tpahla.africa/event" class="button">View Event Details</a>
            
            <p>If you have any questions, please contact us at <a href="mailto:2025@tpahla.africa">2025@tpahla.africa</a> or call +234-810-490-6878.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 TPAHLA. All rights reserved.</p>
            <p>Organized by the Institute for Humanitarian Studies and Social Development (IHSD)</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: payload.email,
      subject: "TPAHLA 2025 Payment Confirmation",
      html: emailHtml,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to send email",
          details: error.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        messageId: data?.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error processing request:", err);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: err.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});