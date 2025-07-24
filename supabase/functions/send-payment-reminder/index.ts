import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function handleCors(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
}

// Check if Resend is configured
const isResendConfigured = () => {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  return apiKey && apiKey.length > 0 && !apiKey.includes('your_resend_api_key_here');
};

serve(async (req: Request) => {
  try {
    // Handle CORS
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if Resend is properly configured
    if (!isResendConfigured()) {
      console.error('Resend API key not found or invalid');
      return new Response(
        JSON.stringify({
          error: 'Email service not configured',
          details: 'RESEND_API_KEY environment variable is missing or invalid.'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const emailFrom = Deno.env.get('RESEND_SENDER_EMAIL') || 'TPAHLA <noreply@tpahla.africa>';

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get request body - can specify specific registration ID or send to all pending
    const { registrationId, sendToAll = false } = await req.json();

    let registrationsToRemind = [];

    if (registrationId) {
      // Send reminder to specific registration
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('id', registrationId)
        .eq('registration_status', 'pending_payment')
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: "Registration not found or not pending payment" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      registrationsToRemind = [data];
    } else if (sendToAll) {
      // Send reminders to all pending registrations
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('registration_status', 'pending_payment')
        .order('created_at', { ascending: false });

      if (error) {
        return new Response(
          JSON.stringify({ error: "Failed to fetch pending registrations" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      registrationsToRemind = data || [];
    } else {
      return new Response(
        JSON.stringify({ error: "Either registrationId or sendToAll must be specified" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (registrationsToRemind.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No pending registrations found to send reminders to",
          count: 0
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Send email function using fetch API
    const sendEmail = async (emailData: any) => {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Failed to send email");
      }
      
      return { data: result, error: null };
    };

    const results = [];
    const paymentUrl = "https://www.angelcommunities.org/event/ticket-booking/the-pan-african-humanitarian-leadership-award-2025";

    // Send reminder emails
    for (const registration of registrationsToRemind) {
      try {
        const participationType = registration.participation_type === 'nominee' ? 'Award Nominee / Honoree' :
                                registration.participation_type === 'individual' ? 'General Attendee' :
                                registration.participation_type === 'group' ? 'Corporate/Institutional Group' :
                                registration.participation_type === 'sponsor' ? 'Sponsor / Partner' : 
                                registration.participation_type;

        const subject = `Complete Your TPAHLA 2025 Registration - Payment Required`;
        
        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>TPAHLA 2025 Payment Reminder</title>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background-color: #0A3B1F; color: #E6C670; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .footer { background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; }
                .highlight { color: #E6C670; font-weight: bold; }
                .button { 
                  display: inline-block; 
                  background-color: #E6C670; 
                  color: #0A3B1F; 
                  padding: 15px 30px; 
                  text-decoration: none; 
                  border-radius: 5px; 
                  font-weight: bold; 
                  margin: 20px 0;
                  font-size: 16px;
                }
                .urgent { background-color: #ff6b6b; color: white; padding: 10px; border-radius: 5px; margin: 15px 0; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>The Pan-African Humanitarian Leadership Award</h1>
                <h2>TPAHLA 2025</h2>
              </div>
              
              <div class="content">
                <h3>Dear ${registration.full_name},</h3>
                
                <p>We hope this message finds you well. This is a friendly reminder that your registration for <strong class="highlight">TPAHLA 2025</strong> is currently pending payment completion.</p>
                
                <div class="urgent">
                  <strong>⏰ Action Required:</strong> Please complete your payment to secure your participation in Africa's most prestigious humanitarian awards ceremony.
                </div>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #E6C670; margin: 20px 0;">
                  <h4>Your Registration Details:</h4>
                  <ul>
                    <li><strong>Name:</strong> ${registration.full_name}</li>
                    <li><strong>Email:</strong> ${registration.email}</li>
                    <li><strong>Participation Type:</strong> ${participationType}</li>
                    <li><strong>Total Amount:</strong> <span class="highlight">$${registration.total_amount.toLocaleString()}</span></li>
                    <li><strong>Registration ID:</strong> <span class="highlight">${registration.id}</span></li>
                  </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${paymentUrl}" class="button">COMPLETE PAYMENT NOW</a>
                </div>
                
                <h4>Event Details:</h4>
                <ul>
                  <li><strong>Dates:</strong> October 15-19, 2025</li>
                  <li><strong>Venue:</strong> Abuja Continental Hotel, Nigeria</li>
                  <li><strong>Awards Ceremony:</strong> October 18, 2025</li>
                </ul>
                
                <h4>Why Complete Your Registration?</h4>
                <ul>
                  <li>🌍 Join Africa's premier humanitarian leadership platform</li>
                  <li>🤝 Network with continental leaders and changemakers</li>
                  <li>🏆 Witness the recognition of outstanding humanitarian heroes</li>
                  <li>📚 Contribute to the Pan-African Humanitarian Resource Centre</li>
                  <li>🎯 Gain access to exclusive policy engagement opportunities</li>
                </ul>
                
                <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <p><strong>⚠️ Important:</strong> Registration fees are non-refundable but transferable up to September 15, 2025. Secure your spot today!</p>
                </div>
                
                <p>If you have any questions or need assistance with your payment, please don't hesitate to contact us:</p>
                <ul>
                  <li>📧 Email: <a href="mailto:2025@tpahla.africa">2025@tpahla.africa</a></li>
                  <li>📱 WhatsApp: <a href="https://wa.me/2348104906878">+234-810-490-6878</a></li>
                  <li>📞 Phone: +234-802-368-6143</li>
                </ul>
                
                <p>We look forward to welcoming you to this historic event where <em>Honor Meets Purpose</em>.</p>
                
                <p>Best regards,<br>
                <strong>The TPAHLA 2025 Team</strong><br>
                Institute for Humanitarian Studies and Social Development (IHSD)</p>
              </div>
              
              <div class="footer">
                <p>© 2025 The Pan-African Humanitarian Leadership Award. All rights reserved.</p>
                <p>Website: <a href="https://tpahla.africa">www.tpahla.africa</a> | 
                Email: <a href="mailto:2025@tpahla.africa">2025@tpahla.africa</a></p>
                <p><strong>#TPAHLA2025 | #AfricanHumanitarianHeroes | #HonoringHeroes | #ForgingForward</strong></p>
              </div>
            </body>
          </html>
        `;

        const emailResponse = await sendEmail({
          from: emailFrom,
          to: [registration.email],
          subject: subject,
          html: htmlContent,
        });

        results.push({
          registrationId: registration.id,
          email: registration.email,
          success: true,
          emailId: emailResponse.data?.id
        });

        console.log(`Payment reminder sent successfully to: ${registration.email}`);

      } catch (emailError) {
        console.error(`Failed to send reminder to ${registration.email}:`, emailError);
        results.push({
          registrationId: registration.id,
          email: registration.email,
          success: false,
          error: emailError.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Payment reminders processed: ${successCount} sent, ${failureCount} failed`,
        totalProcessed: results.length,
        successCount,
        failureCount,
        results
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Unexpected error in send-payment-reminder function:", error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process payment reminders',
        details: error.message || error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});