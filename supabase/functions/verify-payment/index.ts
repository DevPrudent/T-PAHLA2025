import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.38.4";

// CORS headers for the function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
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

    // Allow both GET and POST for flexibility
    if (req.method !== "POST" && req.method !== "GET") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get reference from query params (GET) or request body (POST)
    let reference: string;
    
    if (req.method === "GET") {
      const url = new URL(req.url);
      reference = url.searchParams.get("reference") || "";
      if (!reference) {
        return new Response(
          JSON.stringify({ error: "Missing reference parameter" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    } else {
      // POST method
      const { reference: bodyReference } = await req.json();
      reference = bodyReference;
      if (!reference) {
        return new Response(
          JSON.stringify({ error: "Missing reference in request body" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
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

    // Verify the transaction with Paystack
    const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
    });

    const verifyData = await verifyResponse.json();

    if (!verifyResponse.ok || !verifyData.status) {
      console.error("Paystack verification error:", verifyData);
      return new Response(
        JSON.stringify({ 
          error: "Payment verification failed", 
          details: verifyData.message || "Could not verify payment" 
        }),
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
      .eq("transaction_id", reference)
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

    // Check if payment is already processed
    if (payment.payment_status === "completed") {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Payment already verified and processed",
          payment_id: payment.id,
          registration_id: payment.registration_id,
          status: "completed"
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Process the payment based on Paystack verification
    const paymentStatus = verifyData.data.status === "success" ? "completed" : 
                         verifyData.data.status === "failed" ? "failed" : "processing";
    
    // Update payment record
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        payment_status: paymentStatus,
        gateway_response: verifyData,
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
        // Don't fail the request, but log the error
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        payment_id: payment.id,
        registration_id: payment.registration_id,
        status: paymentStatus,
        paystack_data: {
          reference: verifyData.data.reference,
          amount: verifyData.data.amount / 100, // Convert back from kobo to main currency
          status: verifyData.data.status,
          transaction_date: verifyData.data.transaction_date,
          channel: verifyData.data.channel,
        }
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