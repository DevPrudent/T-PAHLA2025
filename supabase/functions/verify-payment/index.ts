import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Check if Paystack secret key is configured
  if (!PAYSTACK_SECRET_KEY) {
    console.error("PAYSTACK_SECRET_KEY is not set");
    return new Response(
      JSON.stringify({
        error: "Payment verification service not configured. Please set PAYSTACK_SECRET_KEY environment variable.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Parse request body
    const { reference, registrationId } = await req.json();

    // Validate required fields
    if (!reference || !registrationId) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: reference or registrationId",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify payment with Paystack
    const verificationResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const verificationData = await verificationResponse.json();

    if (!verificationResponse.ok || !verificationData.status) {
      return new Response(
        JSON.stringify({
          error: "Payment verification failed",
          details: verificationData.message || "Unknown error",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if payment was successful
    if (verificationData.data.status !== "success") {
      return new Response(
        JSON.stringify({
          error: "Payment was not successful",
          status: verificationData.data.status,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get registration details
    const { data: registration, error: registrationError } = await supabase
      .from("registrations")
      .select("*")
      .eq("id", registrationId)
      .single();

    if (registrationError) {
      console.error("Error fetching registration:", registrationError);
      return new Response(
        JSON.stringify({
          error: "Failed to fetch registration details",
          details: registrationError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        registration_id: registrationId,
        amount: verificationData.data.amount / 100, // Convert from kobo to naira/dollars
        currency: verificationData.data.currency,
        payment_method: "paystack",
        payment_status: "completed",
        transaction_id: reference,
        gateway_reference: verificationData.data.reference,
        gateway_response: verificationData.data,
        paid_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (paymentError) {
      console.error("Error creating payment record:", paymentError);
      return new Response(
        JSON.stringify({
          error: "Failed to create payment record",
          details: paymentError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update registration status
    const { error: updateError } = await supabase
      .from("registrations")
      .update({ registration_status: "paid" })
      .eq("id", registrationId);

    if (updateError) {
      console.error("Error updating registration status:", updateError);
      return new Response(
        JSON.stringify({
          error: "Failed to update registration status",
          details: updateError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Send payment confirmation email
    try {
      await fetch(`${SUPABASE_URL}/functions/v1/payment-confirmation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          paymentId: payment.id,
          registrationId: registrationId,
          fullName: registration.full_name,
          email: registration.email,
          amount: payment.amount,
          transactionReference: reference,
          paymentMethod: "Paystack",
          participationType: registration.participation_type,
        }),
      });
    } catch (emailError) {
      console.error("Error sending payment confirmation email:", emailError);
      // Don't fail the whole request if email sending fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment: payment,
        message: "Payment verified and recorded successfully",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error processing request:", err);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: err.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});