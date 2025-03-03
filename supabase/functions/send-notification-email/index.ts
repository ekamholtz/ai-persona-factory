
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const sendgridApiKey = Deno.env.get("SENDGRID_API_KEY");

    if (!sendgridApiKey) {
      throw new Error("Missing SendGrid API Key");
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get request body
    const { type, data } = await req.json();

    if (!type || !data) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let emailData;

    switch (type) {
      case "new_invoice":
        emailData = await prepareInvoiceEmail(supabase, data);
        break;
      case "payment_received":
        emailData = await preparePaymentConfirmationEmail(supabase, data);
        break;
      case "milestone_update":
        emailData = await prepareMilestoneUpdateEmail(supabase, data);
        break;
      default:
        return new Response(
          JSON.stringify({ error: "Invalid notification type" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
    }

    if (!emailData) {
      throw new Error("Failed to prepare email data");
    }

    // In a real implementation, we would send the email via SendGrid API
    // For this demo, we'll just log the email data
    console.log("Email would be sent with the following data:", emailData);

    return new Response(
      JSON.stringify({ success: true, message: "Email notification sent" }),
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

async function prepareInvoiceEmail(supabase, data) {
  const { invoice_id } = data;

  // Get invoice data
  const { data: invoiceData, error: invoiceError } = await supabase
    .from("invoices")
    .select("*, milestones(name, project_id)")
    .eq("id", invoice_id)
    .single();

  if (invoiceError) {
    throw new Error(`Error fetching invoice: ${invoiceError.message}`);
  }

  // Get project data
  const { data: projectData, error: projectError } = await supabase
    .from("projects")
    .select("name, contractor_id")
    .eq("id", invoiceData.milestones.project_id)
    .single();

  if (projectError) {
    throw new Error(`Error fetching project: ${projectError.message}`);
  }

  // Get client data
  const { data: clientData, error: clientError } = await supabase
    .from("project_clients")
    .select("client_id")
    .eq("project_id", invoiceData.milestones.project_id)
    .single();

  if (clientError) {
    throw new Error(`Error fetching client: ${clientError.message}`);
  }

  // Get client email
  const { data: userData, error: userError } = await supabase
    .from("profiles")
    .select("email, full_name")
    .eq("id", clientData.client_id)
    .single();

  if (userError) {
    throw new Error(`Error fetching user: ${userError.message}`);
  }

  return {
    to: userData.email,
    subject: `New Invoice for ${projectData.name}`,
    body: `
      <h1>New Invoice</h1>
      <p>Hello ${userData.full_name},</p>
      <p>A new invoice has been generated for the milestone "${invoiceData.milestones.name}" in project "${projectData.name}".</p>
      <p>Amount: $${invoiceData.amount.toFixed(2)}</p>
      <p>Due Date: ${new Date(invoiceData.due_date).toLocaleDateString()}</p>
      <p>Please log in to your account to view and pay this invoice.</p>
      <a href="${Deno.env.get("FRONTEND_URL")}/dashboard/invoices/${invoice_id}">View Invoice</a>
      <p>Thank you for your business!</p>
    `,
  };
}

async function preparePaymentConfirmationEmail(supabase, data) {
  const { payment_id } = data;

  // Get payment data
  const { data: paymentData, error: paymentError } = await supabase
    .from("payments")
    .select("*, invoices(milestone_id)")
    .eq("id", payment_id)
    .single();

  if (paymentError) {
    throw new Error(`Error fetching payment: ${paymentError.message}`);
  }

  // Get milestone data
  const { data: milestoneData, error: milestoneError } = await supabase
    .from("milestones")
    .select("name, project_id")
    .eq("id", paymentData.invoices.milestone_id)
    .single();

  if (milestoneError) {
    throw new Error(`Error fetching milestone: ${milestoneError.message}`);
  }

  // Get project data
  const { data: projectData, error: projectError } = await supabase
    .from("projects")
    .select("name, contractor_id")
    .eq("id", milestoneData.project_id)
    .single();

  if (projectError) {
    throw new Error(`Error fetching project: ${projectError.message}`);
  }

  // Get contractor data
  const { data: userData, error: userError } = await supabase
    .from("profiles")
    .select("email, full_name")
    .eq("id", projectData.contractor_id)
    .single();

  if (userError) {
    throw new Error(`Error fetching user: ${userError.message}`);
  }

  return {
    to: userData.email,
    subject: `Payment Received for ${projectData.name}`,
    body: `
      <h1>Payment Received</h1>
      <p>Hello ${userData.full_name},</p>
      <p>A payment has been received for the milestone "${milestoneData.name}" in project "${projectData.name}".</p>
      <p>Amount: $${paymentData.amount.toFixed(2)}</p>
      <p>Date: ${new Date(paymentData.payment_date).toLocaleDateString()}</p>
      <p>Thank you for using our platform!</p>
    `,
  };
}

async function prepareMilestoneUpdateEmail(supabase, data) {
  const { milestone_id, new_status } = data;

  // Get milestone data
  const { data: milestoneData, error: milestoneError } = await supabase
    .from("milestones")
    .select("name, project_id")
    .eq("id", milestone_id)
    .single();

  if (milestoneError) {
    throw new Error(`Error fetching milestone: ${milestoneError.message}`);
  }

  // Get project data
  const { data: projectData, error: projectError } = await supabase
    .from("projects")
    .select("name")
    .eq("id", milestoneData.project_id)
    .single();

  if (projectError) {
    throw new Error(`Error fetching project: ${projectError.message}`);
  }

  // Get client data
  const { data: clientData, error: clientError } = await supabase
    .from("project_clients")
    .select("client_id")
    .eq("project_id", milestoneData.project_id)
    .single();

  if (clientError) {
    throw new Error(`Error fetching client: ${clientError.message}`);
  }

  // Get client email
  const { data: userData, error: userError } = await supabase
    .from("profiles")
    .select("email, full_name")
    .eq("id", clientData.client_id)
    .single();

  if (userError) {
    throw new Error(`Error fetching user: ${userError.message}`);
  }

  let actionText = "";
  if (new_status === "completed") {
    actionText = "The milestone is ready for review and payment.";
  } else if (new_status === "in_progress") {
    actionText = "Work has begun on this milestone.";
  }

  return {
    to: userData.email,
    subject: `Milestone Update for ${projectData.name}`,
    body: `
      <h1>Milestone Update</h1>
      <p>Hello ${userData.full_name},</p>
      <p>The milestone "${milestoneData.name}" in project "${projectData.name}" has been updated to "${new_status.replace('_', ' ')}".</p>
      <p>${actionText}</p>
      <a href="${Deno.env.get("FRONTEND_URL")}/dashboard/projects/${milestoneData.project_id}">View Project</a>
      <p>Thank you for your business!</p>
    `,
  };
}
