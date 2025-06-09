import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.38.4";

// CORS headers for the function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Handle CORS preflight requests
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

    // Get request body
    const payload = await req.json();

    // Verify Paystack webhook signature
    const paystackSignature = req.headers.get("x-paystack-signature");
    // In a production environment, you should verify the signature
    // This requires crypto functions to create a HMAC
    // For now, we'll skip this step in this example

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

    // Process the webhook event
    const event = payload.event;
    const data = payload.data;

    if (!event || !data || !data.reference) {
      return new Response(
        JSON.stringify({ error: "Invalid webhook payload" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Find the payment record in our database
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("id, registration_id, payment_status")
      .eq("transaction_id", data.reference)
      .single();

    if (paymentError) {
      console.error("Error finding payment record:", paymentError);
      return new Response(
        JSON.stringify({ error: "Payment record not found", details: paymentError.message }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Process based on event type
    let paymentStatus;
    switch (event) {
      case "charge.success":
        paymentStatus = "completed";
        break;
      case "charge.failed":
        paymentStatus = "failed";
        break;
      case "transfer.failed":
      case "transfer.reversed":
        paymentStatus = "failed";
        break;
      case "transfer.success":
        paymentStatus = "completed";
        break;
      default:
        paymentStatus = "processing";
    }

    // Update payment record
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        payment_status: paymentStatus,
        gateway_response: data,
        paid_at: paymentStatus === "completed" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    if (updateError) {
      console.error("Error updating payment record:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update payment record", details: updateError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // If payment is successful, update registration status
    if (paymentStatus === "completed") {
      const { error: registrationError } = await supabase
        .from("registrations")
        .update({
          registration_status: "paid",
          updated_at: new Date().toISOString(),
        })
        .eq("id", payment.registration_id);

      if (registrationError) {
        console.error("Error updating registration status:", registrationError);
        // Don't fail the webhook, but log the error
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: "Webhook processed successfully" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});