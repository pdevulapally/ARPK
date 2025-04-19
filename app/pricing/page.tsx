"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Check, X, AlertTriangle, Send, Sparkles, Zap, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// No AI SDK imports needed on the client side

export default function PricingPage() {
  const [aiResponse, setAiResponse] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showResponse, setShowResponse] = useState(false)

  const { ref: pricingRef, inView: pricingInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const { ref: comparisonRef, inView: comparisonInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const { ref: discountRef, inView: discountInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const { ref: quoteRef, inView: quoteInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const handleAiSuggestion = async () => {
    if (!projectDescription.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/suggest-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectDescription }),
      })

      if (!response.ok) {
        throw new Error("Failed to get suggestion")
      }

      const data = await response.json()
      setAiResponse(data.text)
      setShowResponse(true)
    } catch (error) {
      console.error("Error getting AI suggestion:", error)
      setAiResponse(
        "Sorry, we couldn't generate a recommendation right now. Please try again later or contact us directly.",
      )
      setShowResponse(true)
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
          Transparent Pricing
        </h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
          We believe in clear, upfront pricing with no hidden fees. Choose the plan that fits your needs or let our AI
          assistant help you decide.
        </p>
      </div>

      {/* Pricing Cards */}
      <motion.div
        ref={pricingRef}
        variants={containerVariants}
        initial="hidden"
        animate={pricingInView ? "visible" : "hidden"}
        className="grid md:grid-cols-3 gap-8 mb-24"
      >
        <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} className="relative">
          <Card className="h-full backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-l-4 border-green-500 overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />
            <CardHeader>
              <Badge
                variant="outline"
                className="w-fit mb-2 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
              >
                Most Popular
              </Badge>
              <CardTitle className="text-2xl">Simple Website</CardTitle>
              <CardDescription>Perfect for personal portfolios and landing pages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">£100 – £200</div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>1–3 pages</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Clean, mobile-friendly design</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Ideal for portfolios and landing pages</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Time: ~2–4 days</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Get Started</Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} className="relative">
          <Card className="h-full backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-l-4 border-yellow-500 overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none" />
            <CardHeader>
              <Badge
                variant="outline"
                className="w-fit mb-2 bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800"
              >
                Best Value
              </Badge>
              <CardTitle className="text-2xl">Medium Website</CardTitle>
              <CardDescription>Great for small businesses and professional services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">£250 – £400</div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>4–8 pages</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Custom animations, contact forms</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Optional blog (Notion/Sanity integration)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Time: ~5–7 days</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">Get Started</Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} className="relative">
          <Card className="h-full backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-l-4 border-red-500 overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
            <CardHeader>
              <Badge
                variant="outline"
                className="w-fit mb-2 bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
              >
                Premium
              </Badge>
              <CardTitle className="text-2xl">Complex Website</CardTitle>
              <CardDescription>For advanced web applications and e-commerce</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">£500 – £1000+</div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Logins, dashboards, admin panels</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Stripe integration, user systems, CMS</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Custom functionality and integrations</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Time: ~10–20 days</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Get Started</Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      {/* AI Plan Suggester */}
      <div className="mb-24 max-w-3xl mx-auto">
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border border-purple-300 dark:border-purple-800 overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600/10 to-purple-400/10">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <CardTitle>AI Plan Suggester</CardTitle>
            </div>
            <CardDescription>
              Not sure which plan is best? Tell us about your project and we'll recommend the right plan for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {!showResponse ? (
              <div className="space-y-4">
                <Textarea
                  placeholder="Describe your project: what type of site you need, how many pages, any special features, and your timeline..."
                  className="min-h-[120px] resize-none"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                />
                <Button
                  onClick={handleAiSuggestion}
                  disabled={isLoading || !projectDescription.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                      Analyzing your project...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Get Recommendation
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                    <div className="space-y-2">
                      <h3 className="font-medium text-purple-800 dark:text-purple-300">Our Recommendation</h3>
                      <p className="text-gray-700 dark:text-gray-300">{aiResponse}</p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setShowResponse(false)
                    setProjectDescription("")
                    setAiResponse("")
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Start Over
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Comparison Section */}
      <motion.div
        ref={comparisonRef}
        variants={containerVariants}
        initial="hidden"
        animate={comparisonInView ? "visible" : "hidden"}
        className="mb-24"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How We Compare</h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            See how ARPK Web Development stacks up against other popular website building options.
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[768px]">
            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid grid-cols-2 w-[400px] mx-auto mb-8">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
              </TabsList>

              <TabsContent value="features" className="space-y-4">
                <motion.div variants={itemVariants} className="grid grid-cols-4 gap-4">
                  <div className="font-medium"></div>
                  <div className="font-medium text-center bg-purple-100 dark:bg-purple-900/50 p-3 rounded-t-lg">
                    <span className="text-purple-600 dark:text-purple-400">ARPK</span>
                  </div>
                  <div className="font-medium text-center bg-gray-100 dark:bg-gray-800 p-3 rounded-t-lg">Wix</div>
                  <div className="font-medium text-center bg-gray-100 dark:bg-gray-800 p-3 rounded-t-lg">WordPress</div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-4 gap-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm"
                >
                  <div className="font-medium">Fully Custom Code</div>
                  <div className="text-center">
                    <div className="flex justify-center">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Yes</div>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center">
                      <X className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Template-Based</div>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Limited</div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-4 gap-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm"
                >
                  <div className="font-medium">Backend/Logins</div>
                  <div className="text-center">
                    <div className="flex justify-center">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Included on demand</div>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center">
                      <X className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">No</div>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Plugin Required</div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-4 gap-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm"
                >
                  <div className="font-medium">Timeline Flexibility</div>
                  <div className="text-center">
                    <div className="flex justify-center">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Tailored to you</div>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center">
                      <X className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Fixed</div>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center">
                      <X className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Depends on devs</div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-4 gap-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm"
                >
                  <div className="font-medium">One-to-One Support</div>
                  <div className="text-center">
                    <div className="flex justify-center">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Direct with devs</div>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center">
                      <X className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Bot/Forum</div>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Community</div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-4 gap-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm"
                >
                  <div className="font-medium">Stripe Integration</div>
                  <div className="text-center">
                    <div className="flex justify-center">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Built-in</div>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center">
                      <X className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Premium App</div>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Requires setup</div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-4 gap-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm"
                >
                  <div className="font-medium">Pricing Transparency</div>
                  <div className="text-center">
                    <div className="flex justify-center">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Fixed Quote</div>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center">
                      <X className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Hidden Fees</div>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Varies</div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-4">
                <motion.div variants={itemVariants} className="grid grid-cols-4 gap-4">
                  <div className="font-medium"></div>
                  <div className="font-medium text-center bg-purple-100 dark:bg-purple-900/50 p-3 rounded-t-lg">
                    <span className="text-purple-600 dark:text-purple-400">ARPK</span>
                  </div>
                  <div className="font-medium text-center bg-gray-100 dark:bg-gray-800 p-3 rounded-t-lg">Wix</div>
                  <div className="font-medium text-center bg-gray-100 dark:bg-gray-800 p-3 rounded-t-lg">WordPress</div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-4 gap-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm"
                >
                  <div className="font-medium">Starting Price</div>
                  <div className="text-center">£100</div>
                  <div className="text-center">£8.50/mo</div>
                  <div className="text-center">Free + hosting</div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-4 gap-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm"
                >
                  <div className="font-medium">Custom Domain</div>
                  <div className="text-center">Included</div>
                  <div className="text-center">Extra cost</div>
                  <div className="text-center">Extra cost</div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-4 gap-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm"
                >
                  <div className="font-medium">E-commerce</div>
                  <div className="text-center">From £500</div>
                  <div className="text-center">£15/mo+</div>
                  <div className="text-center">Plugin costs vary</div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-4 gap-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm"
                >
                  <div className="font-medium">Ongoing Costs</div>
                  <div className="text-center">None</div>
                  <div className="text-center">Monthly subscription</div>
                  <div className="text-center">Hosting + maintenance</div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-4 gap-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm"
                >
                  <div className="font-medium">Hidden Fees</div>
                  <div className="text-center">None</div>
                  <div className="text-center">Premium features</div>
                  <div className="text-center">Plugins & themes</div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.div>

      {/* Discount Section */}
      <motion.div
        ref={discountRef}
        variants={containerVariants}
        initial="hidden"
        animate={discountInView ? "visible" : "hidden"}
        className="mb-24"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Special Discounts</h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            We offer special discounts for the following groups. Please provide verification during the quote process.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }}>
            <Card className="h-full backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-lg overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-2xl">
                    🎓
                  </div>
                </div>
                <CardTitle className="text-center">Student Discount</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">15% off</p>
                <p className="text-gray-600 dark:text-gray-400">Available with valid .ac.uk email or student ID</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }}>
            <Card className="h-full backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-lg overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center text-2xl">
                    🏥
                  </div>
                </div>
                <CardTitle className="text-center">NHS Worker Discount</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">20% off</p>
                <p className="text-gray-600 dark:text-gray-400">Available with NHS ID badge or NHS email</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }}>
            <Card className="h-full backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-lg overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center text-2xl">
                    🧡
                  </div>
                </div>
                <CardTitle className="text-center">NHSF (NatCom) Discount</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">5% off</p>
                <p className="text-gray-600 dark:text-gray-400">For registered Hindu Society members</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div
        ref={quoteRef}
        variants={containerVariants}
        initial="hidden"
        animate={quoteInView ? "visible" : "hidden"}
        className="mb-24 max-w-3xl mx-auto"
      >
        <motion.div variants={itemVariants}>
          <Card className="border border-purple-500 rounded-lg overflow-hidden shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-600/10 to-purple-400/10">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-500" />
                <CardTitle>How It Works</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We price based on how complex the site is — for example:
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Simple portfolio sites are usually £100–200</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Business sites range from £250–400</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Bigger builds like e-commerce or dashboards start at £500+</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 dark:text-gray-300">
                    Once we see your request, we'll send a clear quote + timeline. No hidden fees or surprises!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to get started?</h2>
        <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8">
          Request a Quote
        </Button>
      </div>
    </div>
  )
}
