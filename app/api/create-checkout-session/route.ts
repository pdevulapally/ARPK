import { NextResponse } from "next/server"
import { getStripeServer } from "@/lib/stripe"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"

export async function POST(request: Request) {
  try {
    const { projectId, amount, customerEmail, customerName } = await request.json()

    // Validate the request
    if (!projectId || !amount || !customerEmail) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Initialize Stripe
    const stripe = getStripeServer()
    if (!stripe) {
      return NextResponse.json({ message: "Stripe not initialized" }, { status: 500 })
    }

    // Calculate the amount in cents (Stripe uses smallest currency unit)
    const amountInCents = Math.round(amount * 100)

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Website Development Project",
              description: `Initial payment for project #${projectId}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&project_id=${projectId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel?project_id=${projectId}`,
      customer_email: customerEmail,
      metadata: {
        projectId,
        type: "initial_payment",
      },
      payment_intent_data: {
        // This will split the payment between the two founders
        // Note: This requires setting up Stripe Connect accounts for both founders
        transfer_group: `project_${projectId}`,
        application_fee_amount: 0, // No application fee
      },
    })

    // Update the project with the checkout session ID
    await updateDoc(doc(db, "projects", projectId), {
      checkoutSessionId: session.id,
      paymentStatus: "checkout_created",
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error: any) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
