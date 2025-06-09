import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Get environment variables
    const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!PAYSTACK_SECRET_KEY) {
      throw new Error("PAYSTACK_SECRET_KEY is not set");
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase environment variables are not set");
    }

    // Create Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get reference from URL or request body
    let reference;
    
    if (req.method === "GET") {
      const url = new URL(req.url);
      reference = url.searchParams.get("reference");
    } else {
      const body = await req.json();
      reference = body.reference;
    }

    if (!reference) {
      return new Response(
        JSON.stringify({ error: "Missing transaction reference" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify payment with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const paystackResponse = await response.json();

    if (!response.ok || !paystackResponse.status) {
      console.error("Paystack verification error:", paystackResponse);
      return new Response(
        JSON.stringify({ 
          error: "Payment verification failed", 
          details: paystackResponse 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update payment record in database
    const paymentStatus = paystackResponse.data.status === "success" ? "completed" : "failed";
    
    // First, get the payment record to find the registration_id
    const { data: paymentData, error: fetchError } = await supabase
      .from("payments")
      .select("registration_id")
      .eq("transaction_id", reference)
      .single();
      
    if (fetchError) {
      console.error("Error fetching payment record:", fetchError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to fetch payment record", 
          details: fetchError 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Update payment status
    const { error: updatePaymentError } = await supabase
      .from("payments")
      .update({
        payment_status: paymentStatus,
        paid_at: paymentStatus === "completed" ? new Date().toISOString() : null,
        gateway_response: paystackResponse.data,
      })
      .eq("transaction_id", reference);

    if (updatePaymentError) {
      console.error("Error updating payment record:", updatePaymentError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to update payment record", 
          details: updatePaymentError 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // If payment is successful, update registration status
    if (paymentStatus === "completed" && paymentData?.registration_id) {
      const { error: updateRegistrationError } = await supabase
        .from("registrations")
        .update({
          registration_status: "paid",
          updated_at: new Date().toISOString(),
        })
        .eq("id", paymentData.registration_id);

      if (updateRegistrationError) {
        console.error("Error updating registration status:", updateRegistrationError);
        // Don't fail the request, just log the error
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: {
          status: paymentStatus,
          reference: reference,
          transaction: paystackResponse.data
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Server error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});