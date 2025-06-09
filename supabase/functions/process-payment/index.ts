import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { reference, registrationId } = await req.json();

    if (!reference || !registrationId) {
      return new Response(
        JSON.stringify({ error: "Reference and registrationId are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client with service role key for admin operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify payment with Paystack
    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) {
      return new Response(
        JSON.stringify({ error: "Paystack configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const verifyData = await verifyResponse.json();

    if (!verifyResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to verify payment", details: verifyData }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if payment was successful
    if (verifyData.data.status !== "success") {
      return new Response(
        JSON.stringify({ error: "Payment was not successful", status: verifyData.data.status }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get registration details
    const { data: registration, error: regError } = await supabase
      .from("registrations")
      .select("id, total_amount")
      .eq("id", registrationId)
      .single();

    if (regError) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch registration", details: regError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify amount matches (convert to lowest currency unit - kobo for NGN, cents for USD)
    const expectedAmount = Math.round(registration.total_amount * 100);
    const paidAmount = verifyData.data.amount;

    if (paidAmount < expectedAmount) {
      return new Response(
        JSON.stringify({ 
          error: "Payment amount does not match", 
          expected: expectedAmount, 
          paid: paidAmount 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .update({
        payment_status: "completed",
        paid_at: new Date().toISOString(),
        gateway_reference: reference,
        gateway_response: verifyData.data,
      })
      .eq("registration_id", registrationId)
      .select()
      .single();

    if (paymentError) {
      return new Response(
        JSON.stringify({ error: "Failed to update payment record", details: paymentError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update registration status
    const { error: updateError } = await supabase
      .from("registrations")
      .update({ registration_status: "paid" })
      .eq("id", registrationId);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: "Failed to update registration status", details: updateError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Payment verified and registration updated",
        payment: payment
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});