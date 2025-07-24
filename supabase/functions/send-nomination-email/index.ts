import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@3.4.0";

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

serve(async (req: Request) => {
  try {
    // Handle CORS
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get Resend configuration
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const emailFrom = Deno.env.get("RESEND_SENDER_EMAIL") || "TPAHLA <noreply@tpahla.africa>";
    const adminEmail = Deno.env.get("ADMIN_NOTIFICATION_EMAIL");

    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not set");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const resend = new Resend(resendApiKey);

    // Get request body
    const { nominatorEmail, nominatorName, nomineeName, nominationId, siteUrl } = await req.json();

    // Validate required fields
    if (!nominatorEmail || !nominatorName || !nomineeName || !nominationId) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields", 
          details: "nominatorEmail, nominatorName, nomineeName, and nominationId are required" 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Prepare email content
    const subject = `TPAHLA 2025 Nomination Confirmation - ${nomineeName}`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>TPAHLA 2025 Nomination Confirmation</title>
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
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 5px; 
              font-weight: bold; 
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>The Pan-African Humanitarian Leadership Award</h1>
            <h2>TPAHLA 2025</h2>
          </div>
          
          <div class="content">
            <h3>Dear ${nominatorName},</h3>
            
            <p>Thank you for submitting your nomination for <strong class="highlight">${nomineeName}</strong> for the TPAHLA 2025 Awards.</p>
            
            <p>Your nomination has been successfully received and is now being processed by our review committee.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #E6C670; margin: 20px 0;">
              <h4>Nomination Details:</h4>
              <ul>
                <li><strong>Nominee:</strong> ${nomineeName}</li>
                <li><strong>Nomination ID:</strong> <span class="highlight">${nominationId}</span></li>
                <li><strong>Submitted by:</strong> ${nominatorName}</li>
                <li><strong>Submission Date:</strong> ${new Date().toLocaleDateString()}</li>
              </ul>
            </div>
            
            <p>Our review process includes:</p>
            <ul>
              <li>Initial review and verification (August 16 - September 14, 2025)</li>
              <li>Evaluation by our expert panel of judges</li>
              <li>Finalist announcement on September 15, 2025</li>
              <li>Awards ceremony on October 18, 2025</li>
            </ul>
            
            <p>If you have any additional supporting documents, please email them to <a href="mailto:tpahla@ihsd-ng.org">tpahla@ihsd-ng.org</a> with your Nomination ID in the subject line.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${siteUrl || 'https://tpahla.africa'}/awards" class="button">View Award Categories</a>
            </div>
            
            <p>We appreciate your contribution to recognizing outstanding humanitarian leadership across Africa.</p>
            
            <p>Best regards,<br>
            <strong>The TPAHLA 2025 Team</strong><br>
            Institute for Humanitarian Studies and Social Development (IHSD)</p>
          </div>
          
          <div class="footer">
            <p>© 2025 The Pan-African Humanitarian Leadership Award. All rights reserved.</p>
            <p>For inquiries: <a href="mailto:2025@tpahla.africa">2025@tpahla.africa</a> | 
            WhatsApp: <a href="https://wa.me/2348104906878">+234-810-490-6878</a></p>
            <p>Website: <a href="https://tpahla.africa">www.tpahla.africa</a></p>
          </div>
        </body>
      </html>
    `;

    // Send confirmation email to nominator
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: emailFrom,
      to: [nominatorEmail],
      subject: subject,
      html: htmlContent,
    });

    if (emailError) {
      console.error("Resend API Error:", emailError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to send confirmation email", 
          details: emailError.message 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Nomination confirmation email sent successfully:", emailData);

    // Send admin notification if configured
    if (adminEmail) {
      const adminSubject = `New TPAHLA 2025 Nomination: ${nomineeName}`;
      const adminHtmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>New TPAHLA 2025 Nomination</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .header { background-color: #0A3B1F; color: #E6C670; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .highlight { color: #E6C670; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>New TPAHLA 2025 Nomination</h1>
            </div>
            
            <div class="content">
              <h3>New nomination submitted:</h3>
              
              <ul>
                <li><strong>Nominee:</strong> <span class="highlight">${nomineeName}</span></li>
                <li><strong>Nominator:</strong> ${nominatorName}</li>
                <li><strong>Nominator Email:</strong> ${nominatorEmail}</li>
                <li><strong>Nomination ID:</strong> <span class="highlight">${nominationId}</span></li>
                <li><strong>Submission Date:</strong> ${new Date().toLocaleString()}</li>
              </ul>
              
              <p>Please review this nomination in the admin panel.</p>
            </div>
          </body>
        </html>
      `;

      try {
        await resend.emails.send({
          from: emailFrom,
          to: [adminEmail],
          subject: adminSubject,
          html: adminHtmlContent,
        });
        console.log("Admin notification email sent successfully");
      } catch (adminEmailError) {
        console.error("Failed to send admin notification:", adminEmailError);
        // Don't fail the whole request if admin email fails
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Nomination confirmation email sent successfully",
        email_id: emailData?.id 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});