
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Resend } from 'npm:resend@3.4.0';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
// IMPORTANT: Set your desired FROM email address. This must be a verified domain in Resend.
// For testing with unverified domains, Resend allows sending *from* onboarding@resend.dev *to* your own email.
const EMAIL_FROM = Deno.env.get('RESEND_SENDER_EMAIL') || 'onboarding@resend.dev';
const ADMIN_EMAIL = Deno.env.get('ADMIN_NOTIFICATION_EMAIL'); // Optional: an admin email to CC or BCC

// Basic CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Adjust for production to your specific domain
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req: Request) => {
  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set.');
    return new Response(JSON.stringify({ error: 'Email service not configured.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const resend = new Resend(RESEND_API_KEY);

  try {
    const { nominatorEmail, nominatorName, nomineeName, nominationId, siteUrl } = await req.json();

    if (!nominatorEmail || !nominatorName || !nomineeName || !nominationId) {
      return new Response(JSON.stringify({ error: 'Missing required fields: nominatorEmail, nominatorName, nomineeName, nominationId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const subjectNominator = `Nomination Received: ${nomineeName} for TPAHLA 2025`;
    const emailBodyNominator = `
      Dear ${nominatorName},

      Thank you for submitting your nomination for ${nomineeName} for the TPAHLA 2025 Awards.
      Your nomination (ID: ${nominationId}) has been successfully received and is being processed.

      We appreciate your contribution to recognizing outstanding individuals and organizations.

      You can view the awards information page here: ${siteUrl || 'https://tpahla.com'}/awards

      Sincerely,
      The TPAHLA Team
    `;

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [nominatorEmail],
      subject: subjectNominator,
      html: `<p>${emailBodyNominator.replace(/\n/g, '<br>')}</p>`,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return new Response(JSON.stringify({ error: 'Failed to send nominator email', details: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    console.log('Nominator confirmation email sent:', data);

    // Optional: Send a notification to admin
    if (ADMIN_EMAIL) {
      const subjectAdmin = `New Nomination Submitted: ${nomineeName} (ID: ${nominationId})`;
      const emailBodyAdmin = `
        A new nomination has been submitted:
        Nominee: ${nomineeName}
        Nominator: ${nominatorName} (${nominatorEmail})
        Nomination ID: ${nominationId}
        
        View details in the admin panel.
      `;
      try {
        await resend.emails.send({
          from: EMAIL_FROM,
          to: [ADMIN_EMAIL],
          subject: subjectAdmin,
          html: `<p>${emailBodyAdmin.replace(/\n/g, '<br>')}</p>`,
        });
        console.log('Admin notification email sent.');
      } catch (adminEmailError) {
        console.error('Failed to send admin notification email:', adminEmailError);
        // Don't fail the whole request if admin email fails
      }
    }

    return new Response(JSON.stringify({ message: 'Emails processed successfully.' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (e) {
    console.error('Error processing request:', e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
