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
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid JSON in request body",
          details: error.message 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { registrationId, amount, email, callbackUrl, metadata, currency = "USD" } = requestBody;

    // Validate required fields
    if (!registrationId || !amount || !email) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields", 
          details: "registrationId, amount, and email are required",
          received: { registrationId: !!registrationId, amount: !!amount, email: !!email }
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate amount is a positive number
    if (typeof amount !== 'number' || amount <= 0) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid amount", 
          details: "Amount must be a positive number",
          received: { amount, type: typeof amount }
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    
    // Check for missing environment variables
    const missingEnvVars = [];
    if (!supabaseUrl) missingEnvVars.push("SUPABASE_URL");
    if (!supabaseServiceKey) missingEnvVars.push("SUPABASE_SERVICE_ROLE_KEY");
    if (!paystackSecretKey) missingEnvVars.push("PAYSTACK_SECRET_KEY");

    if (missingEnvVars.length > 0) {
      console.error("Missing environment variables:", missingEnvVars);
      return new Response(
        JSON.stringify({ 
          error: "Server configuration error",
          details: `Missing environment variables: ${missingEnvVars.join(", ")}`,
          missingVars: missingEnvVars
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify registration exists
    const { data: registration, error: registrationError } = await supabase
      .from("registrations")
      .select("id, full_name, email, total_amount, registration_status")
      .eq("id", registrationId)
      .single();

    if (registrationError) {
      console.error("Error fetching registration:", registrationError);
      return new Response(
        JSON.stringify({ 
          error: "Registration not found",
          details: registrationError.message,
          registrationId
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!registration) {
      return new Response(
        JSON.stringify({ 
          error: "Registration not found",
          details: `No registration found with ID: ${registrationId}`
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify the amount matches the registration
    if (Math.abs(registration.total_amount - amount) > 0.01) {
      return new Response(
        JSON.stringify({ 
          error: "Amount mismatch",
          details: `Payment amount (${amount}) does not match registration amount (${registration.total_amount})`,
          registrationAmount: registration.total_amount,
          paymentAmount: amount
        }),
        {
          status: 400,
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
        currency: currency,
        gateway_response: { metadata, request_timestamp: new Date().toISOString() },
      })
      .select()
      .single();

    if (paymentError) {
      console.error("Error creating payment record:", paymentError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to create payment record", 
          details: paymentError.message,
          code: paymentError.code
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Prepare Paystack request
    const paystackPayload = {
      email: email,
      amount: Math.round(amount * 100), // Paystack expects amount in kobo (smallest currency unit)
      currency: currency,
      callback_url: callbackUrl || `${req.headers.get("origin")}/payment-callback`,
      metadata: {
        registration_id: registrationId,
        payment_id: payment.id,
        custom_fields: metadata?.custom_fields || [],
        ...metadata,
      },
    };

    console.log("Initializing Paystack payment with payload:", {
      ...paystackPayload,
      amount: `${amount} ${currency} (${paystackPayload.amount} kobo)`
    });

    // Initialize Paystack transaction
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paystackPayload),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok) {
      console.error("Paystack error:", {
        status: paystackResponse.status,
        statusText: paystackResponse.statusText,
        data: paystackData
      });
      
      // Update payment record to failed status
      await supabase
        .from("payments")
        .update({
          payment_status: "failed",
          gateway_response: { 
            ...paystackData, 
            error_timestamp: new Date().toISOString(),
            http_status: paystackResponse.status
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", payment.id);
      
      return new Response(
        JSON.stringify({ 
          error: "Payment gateway error", 
          details: paystackData.message || "Failed to initialize payment",
          paystackError: paystackData,
          httpStatus: paystackResponse.status
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate Paystack response
    if (!paystackData.status || !paystackData.data || !paystackData.data.authorization_url) {
      console.error("Invalid Paystack response:", paystackData);
      
      await supabase
        .from("payments")
        .update({
          payment_status: "failed",
          gateway_response: { 
            ...paystackData, 
            error: "Invalid response structure",
            error_timestamp: new Date().toISOString()
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", payment.id);

      return new Response(
        JSON.stringify({ 
          error: "Invalid payment gateway response", 
          details: "Payment gateway returned an invalid response structure",
          paystackResponse: paystackData
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update payment record with transaction reference
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        transaction_id: paystackData.data.reference,
        gateway_response: { 
          ...paystackData, 
          success_timestamp: new Date().toISOString()
        },
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    if (updateError) {
      console.error("Error updating payment record:", updateError);
      // Don't fail the request, but log the error
    }

    console.log("Payment initialized successfully:", {
      paymentId: payment.id,
      reference: paystackData.data.reference,
      authUrl: paystackData.data.authorization_url
    });

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
    console.error("Unexpected error in process-payment function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});