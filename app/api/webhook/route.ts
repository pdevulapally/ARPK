import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { getStripeServer } from "@/lib/stripe"
import { db } from "@/lib/firebase"
import { doc, updateDoc, getDoc, setDoc, collection, serverTimestamp, query, where, getDocs } from "firebase/firestore"

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get("stripe-signature") as string

  if (!signature) {
    return NextResponse.json({ message: "Missing stripe-signature header" }, { status: 400 })
  }

  const stripe = getStripeServer()
  if (!stripe) {
    return NextResponse.json({ message: "Stripe not initialized" }, { status: 500 })
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET as string)

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object)
        break
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object)
        break
      case "transfer.created":
        await handleTransferCreated(event.data.object)
        break
      case "transfer.paid":
        await handleTransferPaid(event.data.object)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Webhook error:", error)
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  const projectId = session.metadata.projectId

  if (!projectId) {
    console.error("No projectId in session metadata")
    return
  }

  // Update the project payment status
  await updateDoc(doc(db, "projects", projectId), {
    paymentStatus: "paid",
    paymentDate: serverTimestamp(),
    paymentAmount: session.amount_total / 100, // Convert from cents to dollars
    paymentId: session.payment_intent,
  })

  // If this is an initial payment, update the project status
  if (session.metadata.type === "initial_payment") {
    await updateDoc(doc(db, "projects", projectId), {
      status: "in progress",
    })

    // Create a payment record
    await setDoc(doc(collection(db, "payments")), {
      projectId,
      type: "initial",
      amount: session.amount_total / 100,
      status: "completed",
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent,
      createdAt: serverTimestamp(),
    })
  }

  // If this is a final payment, update the project status
  if (session.metadata.type === "final_payment") {
    await updateDoc(doc(db, "projects", projectId), {
      status: "completed",
      completedAt: serverTimestamp(),
    })

    // Create a payment record
    await setDoc(doc(collection(db, "payments")), {
      projectId,
      type: "final",
      amount: session.amount_total / 100,
      status: "completed",
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent,
      createdAt: serverTimestamp(),
    })
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  // Get the transfer_group from the payment intent
  const transferGroup = paymentIntent.transfer_group

  if (!transferGroup || !transferGroup.startsWith("project_")) {
    return
  }

  const projectId = transferGroup.replace("project_", "")

  // Get the project data
  const projectDoc = await getDoc(doc(db, "projects", projectId))

  if (!projectDoc.exists()) {
    console.error("Project not found:", projectId)
    return
  }

  // Create transfers to the founders
  // This assumes you have set up Stripe Connect accounts for both founders
  const amount = paymentIntent.amount
  const halfAmount = Math.floor(amount / 2)

  // Create transfer to founder 1
  await stripe.transfers.create({
    amount: halfAmount,
    currency: "usd",
    destination: process.env.STRIPE_CONNECT_ACCOUNT_1 as string,
    transfer_group: transferGroup,
    source_transaction: paymentIntent.charges.data[0].id,
  })

  // Create transfer to founder 2
  await stripe.transfers.create({
    amount: amount - halfAmount, // Use the remainder to account for odd amounts
    currency: "usd",
    destination: process.env.STRIPE_CONNECT_ACCOUNT_2 as string,
    transfer_group: transferGroup,
    source_transaction: paymentIntent.charges.data[0].id,
  })
}

async function handleTransferCreated(transfer: any) {
  // Log the transfer for record-keeping
  await setDoc(doc(collection(db, "transfers")), {
    transferId: transfer.id,
    amount: transfer.amount / 100,
    destination: transfer.destination,
    transferGroup: transfer.transfer_group,
    status: transfer.status,
    createdAt: serverTimestamp(),
  })
}

async function handleTransferPaid(transfer: any) {
  // Update the transfer record
  const transfersQuery = query(collection(db, "transfers"), where("transferId", "==", transfer.id))

  const transferDocs = await getDocs(transfersQuery)

  if (!transferDocs.empty) {
    const transferDoc = transferDocs.docs[0]
    await updateDoc(doc(db, "transfers", transferDoc.id), {
      status: "paid",
      paidAt: serverTimestamp(),
    })
  }
}
