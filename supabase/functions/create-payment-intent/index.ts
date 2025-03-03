
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import Stripe from "https://esm.sh/stripe@12.4.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!stripeSecretKey) {
      throw new Error("Missing Stripe secret key");
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Get request body
    const { invoiceId, amount, clientId } = await req.json();

    if (!invoiceId || !amount || !clientId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get invoice and project data
    const { data: invoiceData, error: invoiceError } = await supabase
      .from("invoices")
      .select("*, milestones(project_id, name)")
      .eq("id", invoiceId)
      .single();

    if (invoiceError || !invoiceData) {
      return new Response(
        JSON.stringify({
          error: "Invoice not found",
          details: invoiceError?.message,
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get project data
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .select("*, contractor_profiles(company_name)")
      .eq("id", invoiceData.milestones.project_id)
      .single();

    if (projectError || !projectData) {
      return new Response(
        JSON.stringify({
          error: "Project not found",
          details: projectError?.message,
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        invoiceId,
        projectId: invoiceData.milestones.project_id,
        milestoneName: invoiceData.milestones.name,
      },
      receipt_email: null, // Can add client email here
      description: `Payment for ${projectData.name} - ${invoiceData.milestones.name}`,
    });

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
