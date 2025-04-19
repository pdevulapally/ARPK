import { db } from "@/lib/firebase"
import { getStripe } from "@/lib/stripe"
import { doc, getDoc } from "firebase/firestore"

export async function createCheckoutSession(projectId: string) {
  try {
    // Get the project data
    const projectDoc = await getDoc(doc(db, "projects", projectId))

    if (!projectDoc.exists()) {
      throw new Error("Project not found")
    }

    const projectData = projectDoc.data()

    // Create a checkout session via API route
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId,
        amount: Number.parseFloat(projectData.budget.replace(/[^0-9.]/g, "")), // Extract numeric value from budget
        customerEmail: projectData.userEmail,
        customerName: projectData.userName,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create checkout session")
    }

    const { sessionId } = await response.json()

    // Redirect to Stripe Checkout
    const stripe = await getStripe()
    if (!stripe) {
      throw new Error("Failed to initialize Stripe")
    }

    const { error } = await stripe.redirectToCheckout({ sessionId })

    if (error) {
      throw error
    }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw error
  }
}
