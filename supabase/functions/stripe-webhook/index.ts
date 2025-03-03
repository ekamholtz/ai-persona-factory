
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import Stripe from "https://esm.sh/stripe@12.4.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!stripeSecretKey) {
    throw new Error("Missing Stripe secret key");
  }

  if (!webhookSecret) {
    throw new Error("Missing Stripe webhook secret");
  }

  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Initialize Stripe
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2023-10-16",
  });

  try {
    const signature = req.headers.get("stripe-signature");
    const body = await req.text();

    if (!signature) {
      return new Response(
        JSON.stringify({ error: "Missing stripe-signature header" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    console.log(`Webhook received: ${event.type}`);

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const invoiceId = paymentIntent.metadata.invoiceId;
        const amount = paymentIntent.amount / 100; // Convert from cents

        // Create payment record
        const { data: paymentData, error: paymentError } = await supabase
          .from("payments")
          .insert({
            invoice_id: invoiceId,
            amount: amount,
            payment_date: new Date().toISOString().split("T")[0],
            stripe_payment_id: paymentIntent.id,
            stripe_payment_intent: paymentIntent.id,
          })
          .select()
          .single();

        if (paymentError) {
          throw new Error(`Error creating payment record: ${paymentError.message}`);
        }

        // Update invoice as paid
        const { error: invoiceError } = await supabase
          .from("invoices")
          .update({ paid: true })
          .eq("id", invoiceId);

        if (invoiceError) {
          throw new Error(`Error updating invoice: ${invoiceError.message}`);
        }

        // Get milestone info
        const { data: invoiceData, error: invoiceFetchError } = await supabase
          .from("invoices")
          .select("milestone_id")
          .eq("id", invoiceId)
          .single();

        if (invoiceFetchError) {
          throw new Error(`Error fetching invoice: ${invoiceFetchError.message}`);
        }

        // Update milestone status
        const { error: milestoneError } = await supabase
          .from("milestones")
          .update({ status: "paid" })
          .eq("id", invoiceData.milestone_id);

        if (milestoneError) {
          throw new Error(`Error updating milestone: ${milestoneError.message}`);
        }

        // Create notification for the contractor
        const { data: milestoneData, error: milestoneFetchError } = await supabase
          .from("milestones")
          .select("name, project_id")
          .eq("id", invoiceData.milestone_id)
          .single();

        if (milestoneFetchError) {
          throw new Error(
            `Error fetching milestone: ${milestoneFetchError.message}`
          );
        }

        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("name, contractor_id")
          .eq("id", milestoneData.project_id)
          .single();

        if (projectError) {
          throw new Error(`Error fetching project: ${projectError.message}`);
        }

        // Create notification for contractor
        await supabase.from("notifications").insert({
          user_id: projectData.contractor_id,
          title: "Payment Received",
          message: `A payment of $${amount.toFixed(2)} has been received for milestone "${
            milestoneData.name
          }" in project "${projectData.name}"`,
          link: `/dashboard/projects/${milestoneData.project_id}`,
        });

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const invoiceId = paymentIntent.metadata.invoiceId;
        
        // Potentially create a notification about failed payment
        const { data: invoiceData, error: invoiceError } = await supabase
          .from("invoices")
          .select("milestone_id")
          .eq("id", invoiceId)
          .single();
        
        if (invoiceError) {
          throw new Error(`Error fetching invoice: ${invoiceError.message}`);
        }
        
        const { data: milestoneData, error: milestoneError } = await supabase
          .from("milestones")
          .select("name, project_id")
          .eq("id", invoiceData.milestone_id)
          .single();
        
        if (milestoneError) {
          throw new Error(`Error fetching milestone: ${milestoneError.message}`);
        }
        
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("name, contractor_id")
          .eq("id", milestoneData.project_id)
          .single();
        
        if (projectError) {
          throw new Error(`Error fetching project: ${projectError.message}`);
        }
        
        // Create notification for contractor about failed payment
        await supabase.from("notifications").insert({
          user_id: projectData.contractor_id,
          title: "Payment Failed",
          message: `A payment for milestone "${milestoneData.name}" in project "${projectData.name}" has failed.`,
          link: `/dashboard/projects/${milestoneData.project_id}`,
        });
        
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
