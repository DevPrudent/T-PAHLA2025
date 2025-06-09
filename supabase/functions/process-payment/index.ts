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
    const { registrationId, amount, email, callbackUrl, metadata } = await req.json();

    // Validate required fields
    if (!registrationId || !amount || !email) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields", 
          details: "registrationId, amount, and email are required" 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

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

    // Get Paystack secret key from environment variables
    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) {
      return new Response(
        JSON.stringify({ error: "Payment gateway not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create a payment record in the database
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        registration_id: registrationId,
        amount: amount,
        payment_method: "paystack",
        payment_status: "pending",
        currency: "USD",
        gateway_response: { metadata },
      })
      .select()
      .single();

    if (paymentError) {
      console.error("Error creating payment record:", paymentError);
      return new Response(
        JSON.stringify({ error: "Failed to create payment record", details: paymentError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Paystack transaction
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        amount: Math.round(amount * 100), // Paystack expects amount in kobo (smallest currency unit)
        callback_url: callbackUrl || `${req.headers.get("origin")}/payment-callback`,
        metadata: {
          registration_id: registrationId,
          payment_id: payment.id,
          custom_fields: metadata?.custom_fields || [],
          ...metadata,
        },
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok) {
      console.error("Paystack error:", paystackData);
      
      // Update payment record to failed status
      await supabase
        .from("payments")
        .update({
          payment_status: "failed",
          gateway_response: paystackData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", payment.id);
      
      return new Response(
        JSON.stringify({ 
          error: "Payment gateway error", 
          details: paystackData.message || "Failed to initialize payment" 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update payment record with transaction reference
    await supabase
      .from("payments")
      .update({
        transaction_id: paystackData.data.reference,
        gateway_response: paystackData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    // Return success response with authorization URL
    return new Response(
      JSON.stringify({
        success: true,
        payment_id: payment.id,
        authorization_url: paystackData.data.authorization_url,
        reference: paystackData.data.reference,
        access_code: paystackData.data.access_code,
      }),
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