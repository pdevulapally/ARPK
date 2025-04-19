import { loadStripe } from "@stripe/stripe-js"
import { Stripe } from "stripe"

// Initialize Stripe on the client side
export const getStripe = async () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  const stripePromise = loadStripe(publishableKey)
  return stripePromise
}

// Initialize Stripe on the server side
let stripeInstance: Stripe | null = null

export const getStripeServer = () => {
  if (!stripeInstance && process.env.STRIPE_SECRET_KEY) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16", // Use the latest API version
    })
  }
  return stripeInstance
}
