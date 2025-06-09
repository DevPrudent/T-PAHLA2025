import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@3.4.0";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'noreply@tpahla.africa';
const ADMIN_EMAIL = Deno.env.get('ADMIN_NOTIFICATION_EMAIL') || '2025@tpahla.africa';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface ContactFormPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
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
    const payload: ContactFormPayload = await req.json();

    // Validate required fields
    if (!payload.email || !payload.message) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: email or message",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const fullName = `${payload.firstName || ''} ${payload.lastName || ''}`.trim();

    // Create email HTML content for admin notification
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
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
          .message-box {
            background-color: #fff;
            border: 1px solid #ddd;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .details-row {
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>TPAHLA 2025</h1>
            <p>New Contact Form Submission</p>
          </div>
          <div class="content">
            <h2>Contact Form Submission</h2>
            <p>You have received a new message from the contact form on your website.</p>
            
            <div class="message-box">
              <div class="details-row">
                <strong>Name:</strong> ${fullName}
              </div>
              <div class="details-row">
                <strong>Email:</strong> ${payload.email}
              </div>
              ${payload.phone ? `
              <div class="details-row">
                <strong>Phone:</strong> ${payload.phone}
              </div>
              ` : ''}
              <div class="details-row">
                <strong>Subject:</strong> ${payload.subject || 'N/A'}
              </div>
              <div class="details-row">
                <strong>Message:</strong>
                <p style="white-space: pre-wrap;">${payload.message}</p>
              </div>
            </div>
            
            <p>Please respond to this inquiry at your earliest convenience.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 TPAHLA. All rights reserved.</p>
            <p>Organized by the Institute for Humanitarian Studies and Social Development (IHSD)</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create email HTML content for user confirmation
    const userEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for Contacting TPAHLA 2025</title>
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
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>TPAHLA 2025</h1>
            <p>The Pan-African Humanitarian Leadership Award</p>
          </div>
          <div class="content">
            <h2>Thank You for Contacting Us</h2>
            <p>Dear ${fullName || 'Valued Visitor'},</p>
            <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
            
            <h3>Your Message Details:</h3>
            <p><strong>Subject:</strong> ${payload.subject || 'General Inquiry'}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">${payload.message}</p>
            
            <p>If you have any urgent inquiries, please contact us directly at:</p>
            <p>
              <strong>Email:</strong> <a href="mailto:2025@tpahla.africa">2025@tpahla.africa</a><br>
              <strong>Phone:</strong> +234-810-490-6878 (WhatsApp)
            </p>
            
            <a href="https://tpahla.africa" class="button">Visit Our Website</a>
          </div>
          <div class="footer">
            <p>&copy; 2025 TPAHLA. All rights reserved.</p>
            <p>Organized by the Institute for Humanitarian Studies and Social Development (IHSD)</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to admin
    const adminEmailResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Contact Form: ${payload.subject || 'General Inquiry'}`,
      html: adminEmailHtml,
      reply_to: payload.email,
    });

    if (adminEmailResult.error) {
      console.error("Admin email error:", adminEmailResult.error);
      // Continue to send user confirmation even if admin email fails
    }

    // Send confirmation email to user
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: payload.email,
      subject: "Thank You for Contacting TPAHLA 2025",
      html: userEmailHtml,
    });

    if (error) {
      console.error("User confirmation email error:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to send confirmation email",
          details: error.message,
          adminEmailSent: !adminEmailResult.error,
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
        adminEmailSent: !adminEmailResult.error,
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