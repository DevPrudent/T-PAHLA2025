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

    // Get Flutterwave keys from environment variables
    const flutterwaveSecretKey = Deno.env.get("FLW_SECRET_KEY");
    const flutterwavePublicKey = Deno.env.get("FLW_PUBLIC_KEY");
    const subaccountId = Deno.env.get("FLW_SUBACCOUNT_ID") || "RS_288BB910A3D1E6E93364D51AC9FDA928";
    
    if (!flutterwaveSecretKey || !flutterwavePublicKey) {
      return new Response(
        JSON.stringify({ error: "Payment gateway not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate a unique transaction reference
    const txRef = `TPAHLA2025_${Date.now()}`;

    // Get registration details for better customer info
    const { data: registration, error: registrationError } = await supabase
      .from("registrations")
      .select("full_name, phone")
      .eq("id", registrationId)
      .single();

    if (registrationError) {
      console.error("Error fetching registration details:", registrationError);
      // Continue anyway, we'll use fallback values
    }

    // Prepare the payment payload for Flutterwave
    const paymentPayload = {
      tx_ref: txRef,
      amount: amount.toString(),
      currency: "USD",
      redirect_url: callbackUrl || `${req.headers.get("origin")}/payment-callback`,
      payment_options: "card",
      customer: {
        email: email,
        phonenumber: registration?.phone || metadata?.phone || "",
        name: registration?.full_name || metadata?.name || "Customer"
      },
      customizations: {
        title: "TPAHLA 2025 Registration",
        description: "Secure payment for humanitarian award participation",
        logo: `${req.headers.get("origin")}/lovable-uploads/483603d8-00de-4ab9-a335-36a998ddd55f.png`
      },
      subaccounts: [
        {
          id: subaccountId,
          transaction_charge_type: "percentage",
          transaction_charge: 100 // 100% of payment goes to subaccount
        }
      ],
      meta: {
        registration_id: registrationId,
        ...metadata
      }
    };

    // Create a payment record in the database
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        registration_id: registrationId,
        amount: amount,
        payment_method: "flutterwave",
        payment_status: "pending",
        currency: "USD",
        transaction_id: txRef,
        gateway_response: { 
          metadata,
          payment_payload: paymentPayload
        },
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

    // Return the necessary information for the frontend to initialize Flutterwave
    return new Response(
      JSON.stringify({
        success: true,
        payment_id: payment.id,
        tx_ref: txRef,
        public_key: flutterwavePublicKey,
        subaccount_id: subaccountId,
        customer_name: registration?.full_name || metadata?.name || "",
        customer_phone: registration?.phone || metadata?.phone || "",
        payment_payload: paymentPayload
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