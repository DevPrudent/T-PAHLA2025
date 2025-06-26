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

    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get request body
    const { transaction_id, payment_id } = await req.json();

    // Validate required fields
    if (!transaction_id || !payment_id) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields", 
          details: "transaction_id and payment_id are required" 
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

    // Get Flutterwave secret key from environment variables
    const flutterwaveSecretKey = Deno.env.get("FLW_SECRET_KEY");
    if (!flutterwaveSecretKey) {
      return new Response(
        JSON.stringify({ error: "Payment gateway not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify the transaction with Flutterwave
    const verifyResponse = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${flutterwaveSecretKey}`,
        "Content-Type": "application/json",
      },
    });

    const verifyData = await verifyResponse.json();

    if (!verifyResponse.ok || verifyData.status !== "success") {
      console.error("Flutterwave verification error:", verifyData);
      
      // Update payment record to failed status
      await supabase
        .from("payments")
        .update({
          payment_status: "failed",
          gateway_response: verifyData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", payment_id);
      
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

    // Check if payment is successful
    const isSuccessful = verifyData.data.status === "successful";
    const paymentStatus = isSuccessful ? "completed" : "failed";
    
    // Update payment record
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        payment_status: paymentStatus,
        gateway_response: verifyData,
        paid_at: isSuccessful ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment_id);

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

    // Get registration ID from payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("registration_id")
      .eq("id", payment_id)
      .single();

    if (paymentError) {
      console.error("Error fetching payment record:", paymentError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch payment record", details: paymentError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // If payment is successful, update registration status
    if (isSuccessful) {
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
        payment_id: payment_id,
        registration_id: payment.registration_id,
        status: paymentStatus,
        flutterwave_data: {
          transaction_id: transaction_id,
          amount: verifyData.data.amount,
          currency: verifyData.data.currency,
          status: verifyData.data.status,
          payment_type: verifyData.data.payment_type,
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