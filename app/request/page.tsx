"use client"

import React, { useEffect } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon, Loader2, ArrowRight, CheckCircle2, DollarSign, PaintBucket, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useAuth } from "@/lib/auth"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

const requestSchema = z.object({
  websiteType: z.string().min(1, { message: "Please select a website type" }),
  otherWebsiteType: z.string().optional().or(z.literal('')),
  features: z.array(z.string()).min(1, { message: "Please select at least one feature" }),
  deadline: z.string().min(1, { message: "Please provide a deadline" }),
  budget: z.string().min(1, { message: "Please provide a budget" }),
  designPreferences: z.string().optional(),
  additionalNotes: z.string().optional(),
})

const websiteTypes = [
  { value: "Portfolio", icon: "👤" },
  { value: "E-commerce", icon: "🛒" },
  { value: "Blog", icon: "📝" },
  { value: "Corporate", icon: "🏢" },
  { value: "Landing Page", icon: "🚀" },
  { value: "Web Application", icon: "💻" },
  { value: "Other", icon: "🔍" }
]

const featureOptions = [
  { id: "login", label: "User Authentication", description: "Secure login and user account management" },
  { id: "payments", label: "Payment Processing", description: "Accept payments online securely" },
  { id: "animations", label: "Advanced Animations", description: "Smooth transitions and interactive elements" },
  { id: "admin", label: "Admin Panel", description: "Manage your content and users" },
  { id: "blog", label: "Blog/Content Management", description: "Create and publish content easily" },
  { id: "responsive", label: "Responsive Design", description: "Perfect display on all devices" },
  { id: "seo", label: "SEO Optimization", description: "Improve your search engine rankings" },
  { id: "analytics", label: "Analytics Integration", description: "Track user behavior and performance" },
]

export default function RequestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState<Date>()
  const [showOtherField, setShowOtherField] = useState(false)
  const { user, userData } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      websiteType: "",
      otherWebsiteType: "",
      features: [],
      deadline: "",
      budget: "",
      designPreferences: "",
      additionalNotes: "",
    },
  })

  // Watch for changes to the websiteType field
  const websiteType = form.watch("websiteType")
  
  // Update showOtherField when websiteType changes
  useEffect(() => {
    setShowOtherField(websiteType === "Other")
  }, [websiteType])

  const onSubmit = async (values: z.infer<typeof requestSchema>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "🚫 Please sign in to submit a request.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setIsLoading(true)
    try {
      // Format the data before submission
      const submissionData = {
        ...values,
        // If websiteType is "Other", use the otherWebsiteType value
        websiteType: values.websiteType === "Other" && values.otherWebsiteType 
          ? values.otherWebsiteType 
          : values.websiteType,
        userId: user.uid,
        userEmail: user.email,
        userName: userData?.displayName || user.displayName,
        status: "pending",
        createdAt: serverTimestamp(),
      }

      // Remove otherWebsiteType from the final submission data
      if (submissionData.otherWebsiteType) {
        delete submissionData.otherWebsiteType
      }

      await addDoc(collection(db, "requests"), submissionData)

      toast({
        title: "Request Submitted",
        description: "Your website request has been submitted successfully!",
        variant: "default",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error submitting request:", error)
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="px-3 py-1 text-sm font-medium bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800">
            Website Request
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Let's Build Your <span className="text-purple-600 dark:text-purple-400">Dream Website</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Tell us about your project needs, and we'll craft a custom website solution that perfectly aligns with your vision.
          </p>
        </div>

        <Card className="border-0 shadow-lg bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 md:p-8">
            <CardTitle className="text-2xl font-bold">Website Request Form</CardTitle>
            <CardDescription className="text-purple-100">
              Fill out the details below and we'll get back to you with a proposal
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="websiteType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-gray-700 dark:text-gray-300">Website Type</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value)
                              if (value !== "Other") {
                                form.setValue("otherWebsiteType", "")
                              }
                            }} 
                            defaultValue={field.value} 
                            disabled={isLoading}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500">
                                <SelectValue placeholder="Select website type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {websiteTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value} className="flex items-center">
                                  <span className="mr-2">{type.icon}</span> {type.value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-xs text-gray-500 dark:text-gray-400">
                            Select the primary purpose of your website
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {showOtherField && (
                      <FormField
                        control={form.control}
                        name="otherWebsiteType"
                        render={({ field }) => (
                          <FormItem className="mt-3">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Please specify your website type"
                                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500"
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel className="font-medium text-gray-700 dark:text-gray-300">Project Deadline</FormLabel>
                        <div className="relative">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline" 
                                  className={cn(
                                    "w-full pl-3 text-left font-normal bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700",
                                    !field.value && "text-gray-400"
                                  )}
                                >
                                  {field.value ? (
                                    format(new Date(field.value), "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={(date) => {
                                  if (date) {
                                    setDate(date)
                                    field.onChange(date.toISOString().split('T')[0])
                                  }
                                }}
                                disabled={(date) => date < new Date() || isLoading}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <FormDescription className="text-xs text-gray-500 dark:text-gray-400">
                          When do you need your website to be completed?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel className="font-medium text-gray-700 dark:text-gray-300">Budget Range</FormLabel>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <FormControl>
                            <Input 
                              placeholder="e.g., $1,000-$5,000" 
                              {...field} 
                              disabled={isLoading} 
                              className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </FormControl>
                        </div>
                        <FormDescription className="text-xs text-gray-500 dark:text-gray-400">
                          Provide your budget range for this project
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Required Features</h3>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                    <FormField
                      control={form.control}
                      name="features"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormDescription className="text-sm text-gray-600 dark:text-gray-400">
                              Select all the features you need for your website:
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {featureOptions.map((option) => (
                              <FormField
                                key={option.id}
                                control={form.control}
                                name="features"
                                render={({ field }) => {
                                  return (
                                    <FormItem key={option.id} className="flex items-start space-x-3 space-y-0 p-3 rounded-md hover:bg-white dark:hover:bg-gray-800 transition-colors">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, option.id])
                                              : field.onChange(field.value?.filter((value) => value !== option.id))
                                          }}
                                          disabled={isLoading}
                                          className="border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500"
                                        />
                                      </FormControl>
                                      <div className="space-y-1">
                                        <FormLabel className="font-medium cursor-pointer text-gray-800 dark:text-gray-200">{option.label}</FormLabel>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{option.description}</p>
                                      </div>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="designPreferences"
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <PaintBucket className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          <FormLabel className="font-medium text-gray-700 dark:text-gray-300">Design Preferences</FormLabel>
                        </div>
                        <FormControl>
                          <Textarea
                            placeholder="Share links to websites you like or describe your design preferences..."
                            className="resize-none min-h-[120px] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Share any design preferences or examples of websites you like
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          <FormLabel className="font-medium text-gray-700 dark:text-gray-300">Additional Notes</FormLabel>
                        </div>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional information or requirements for your project..."
                            className="resize-none min-h-[120px] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Any other details or requirements for your project
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-6 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing Request...
                    </>
                  ) : (
                    <>
                      Submit Request
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Your information is secure and will only be used to process your website request.</p>
        </div>
      </div>
    </main>
  )
}