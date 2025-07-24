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

    // Get request body - can specify specific nomination ID or send to all incomplete
    const { nominationId, sendToAll = false, siteUrl } = await req.json();

    let nominationsToRemind = [];

    if (nominationId) {
      // Send reminder to specific nomination
      const { data, error } = await supabase
        .from('nominations')
        .select('*')
        .eq('id', nominationId)
        .in('status', ['draft', 'incomplete'])
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: "Nomination not found or not incomplete" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      nominationsToRemind = [data];
    } else if (sendToAll) {
      // Send reminders to all incomplete nominations
      const { data, error } = await supabase
        .from('nominations')
        .select('*')
        .in('status', ['draft', 'incomplete'])
        .order('created_at', { ascending: false });

      if (error) {
        return new Response(
          JSON.stringify({ error: "Failed to fetch incomplete nominations" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      nominationsToRemind = data || [];
    } else {
      return new Response(
        JSON.stringify({ error: "Either nominationId or sendToAll must be specified" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (nominationsToRemind.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No incomplete nominations found to send reminders to",
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
    const baseUrl = siteUrl || "https://tpahla.africa";

    // Send reminder emails
    for (const nomination of nominationsToRemind) {
      try {
        // Get nominator email from form_section_d or fallback to nominator_email
        const sectionD = nomination.form_section_d as any;
        const nominatorEmail = sectionD?.nominator_email || nomination.nominator_email;
        const nominatorName = sectionD?.nominator_full_name || nomination.nominator_name || 'Nominator';
        
        if (!nominatorEmail) {
          console.error(`No nominator email found for nomination ${nomination.id}`);
          results.push({
            nominationId: nomination.id,
            email: 'N/A',
            success: false,
            error: 'No nominator email found'
          });
          continue;
        }

        // Create unique continuation link with nomination ID
        const continuationLink = `${baseUrl}/nomination-form?continue=${nomination.id}`;

        const subject = `Complete Your TPAHLA 2025 Nomination - ${nomination.nominee_name}`;
        
        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Complete Your TPAHLA 2025 Nomination</title>
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
                .info-box { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #E6C670; margin: 20px 0; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>The Pan-African Humanitarian Leadership Award</h1>
                <h2>TPAHLA 2025</h2>
              </div>
              
              <div class="content">
                <h3>Dear ${nominatorName},</h3>
                
                <p>We hope this message finds you well. We noticed that your nomination for <strong class="highlight">${nomination.nominee_name}</strong> for the TPAHLA 2025 Awards is still incomplete.</p>
                
                <div class="urgent">
                  <strong>⏰ Action Required:</strong> Please complete your nomination to ensure ${nomination.nominee_name} is considered for this prestigious award.
                </div>
                
                <div class="info-box">
                  <h4>Your Nomination Details:</h4>
                  <ul>
                    <li><strong>Nominee:</strong> ${nomination.nominee_name}</li>
                    <li><strong>Nomination ID:</strong> <span class="highlight">${nomination.id}</span></li>
                    <li><strong>Status:</strong> ${nomination.status}</li>
                    <li><strong>Started:</strong> ${new Date(nomination.created_at).toLocaleDateString()}</li>
                    <li><strong>Last Updated:</strong> ${new Date(nomination.updated_at).toLocaleDateString()}</li>
                  </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${continuationLink}" class="button">CONTINUE YOUR NOMINATION</a>
                </div>
                
                <h4>Important Deadlines:</h4>
                <ul>
                  <li><strong>Nominations Close:</strong> <span class="highlight">August 15, 2025</span></li>
                  <li><strong>Finalist Announcement:</strong> September 15, 2025</li>
                  <li><strong>Awards Ceremony:</strong> October 18, 2025 in Abuja, Nigeria</li>
                </ul>
                
                <h4>Why Complete Your Nomination?</h4>
                <ul>
                  <li>🏆 Give ${nomination.nominee_name} the recognition they deserve</li>
                  <li>🌍 Celebrate African humanitarian excellence on a continental stage</li>
                  <li>📚 Contribute to the legacy of humanitarian leadership in Africa</li>
                  <li>🤝 Join a network of changemakers and thought leaders</li>
                  <li>🎯 Help shape the future of humanitarian work across Africa</li>
                </ul>
                
                <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <p><strong>⚠️ Don't Miss Out:</strong> Nominations close on August 15, 2025. Complete your nomination today to ensure ${nomination.nominee_name} is considered for this prestigious award.</p>
                </div>
                
                <h4>Need Help?</h4>
                <p>If you're experiencing any difficulties completing your nomination, please don't hesitate to contact us:</p>
                <ul>
                  <li>📧 Email: <a href="mailto:2025@tpahla.africa">2025@tpahla.africa</a></li>
                  <li>📱 WhatsApp: <a href="https://wa.me/2348104906878">+234-810-490-6878</a></li>
                  <li>📞 Phone: +234-802-368-6143</li>
                  <li>📞 Phone: +234-706-751-9128</li>
                  <li>📞 Phone: +234-806-039-6906</li>
                </ul>
                
                <p>Your unique nomination link will take you directly back to where you left off. All your previously entered information has been saved.</p>
                
                <p>Thank you for taking the time to recognize outstanding humanitarian leadership in Africa.</p>
                
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
          to: [nominatorEmail],
          subject: subject,
          html: htmlContent,
        });

        results.push({
          nominationId: nomination.id,
          email: nominatorEmail,
          success: true,
          emailId: emailResponse.data?.id,
          nominee: nomination.nominee_name
        });

        console.log(`Nomination reminder sent successfully to: ${nominatorEmail} for nominee: ${nomination.nominee_name}`);

      } catch (emailError) {
        console.error(`Failed to send reminder for nomination ${nomination.id}:`, emailError);
        results.push({
          nominationId: nomination.id,
          email: 'Error',
          success: false,
          error: emailError.message,
          nominee: nomination.nominee_name
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Nomination reminders processed: ${successCount} sent, ${failureCount} failed`,
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
    console.error("Unexpected error in send-nomination-reminder function:", error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process nomination reminders',
        details: error.message || error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});