import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@3.4.0";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'noreply@tpahla.africa';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface RegistrationPayload {
  registrationId: string;
  fullName: string;
  email: string;
  participationType: string;
  totalAmount: number;
  paymentStatus: string;
  eventDate?: string;
  eventLocation?: string;
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
    const payload: RegistrationPayload = await req.json();

    // Validate required fields
    if (!payload.registrationId || !payload.fullName || !payload.email) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: registrationId, fullName, or email",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Default values for optional fields
    const eventDate = payload.eventDate || "October 15-19, 2025";
    const eventLocation = payload.eventLocation || "Abuja Continental Hotel, Nigeria";

    // Create email HTML content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TPAHLA 2025 Registration Confirmation</title>
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
          .details {
            background-color: #fff;
            border: 1px solid #ddd;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .details-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .details-row:last-child {
            border-bottom: none;
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
            <h2>Registration Confirmation</h2>
            <p>Dear ${payload.fullName},</p>
            <p>Thank you for registering for TPAHLA 2025! Your registration has been ${
              payload.paymentStatus === 'paid' ? 'confirmed' : 'received and is pending payment'
            }.</p>
            
            <div class="details">
              <div class="details-row">
                <strong>Registration ID:</strong>
                <span>${payload.registrationId}</span>
              </div>
              <div class="details-row">
                <strong>Name:</strong>
                <span>${payload.fullName}</span>
              </div>
              <div class="details-row">
                <strong>Email:</strong>
                <span>${payload.email}</span>
              </div>
              <div class="details-row">
                <strong>Participation Type:</strong>
                <span>${payload.participationType}</span>
              </div>
              <div class="details-row">
                <strong>Total Amount:</strong>
                <span>$${payload.totalAmount.toLocaleString()}</span>
              </div>
              <div class="details-row">
                <strong>Payment Status:</strong>
                <span>${payload.paymentStatus}</span>
              </div>
            </div>
            
            <h3>Event Details</h3>
            <p>
              <strong>Date:</strong> ${eventDate}<br>
              <strong>Location:</strong> ${eventLocation}
            </p>
            
            ${payload.paymentStatus !== 'paid' ? `
            <p>Please complete your payment to confirm your registration. If you've already made a payment, please allow up to 24 hours for it to be processed.</p>
            <a href="https://tpahla.africa/register" class="button">Complete Payment</a>
            ` : `
            <p>We look forward to seeing you at the event! More details about the schedule and accommodations will be sent closer to the event date.</p>
            <a href="https://tpahla.africa/event" class="button">View Event Details</a>
            `}
            
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
      subject: "TPAHLA 2025 Registration Confirmation",
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