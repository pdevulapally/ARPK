"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Settings, Mail, CreditCard, Bell, Lock, Users, FileText, Save, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [isLoading, setIsLoading] = useState(false)

  const generalForm = useForm({
    defaultValues: {
      siteName: "ARPK Web Development",
      siteDescription: "Professional web development services",
      contactEmail: "admin@arpkwebdev.com",
      supportEmail: "support@arpkwebdev.com",
      phoneNumber: "+44 123 456 7890",
      address: "123 Web Dev Street, London, UK",
    },
  })

  const emailForm = useForm({
    defaultValues: {
      smtpHost: "smtp.example.com",
      smtpPort: "587",
      smtpUsername: "notifications@arpkwebdev.com",
      smtpPassword: "••••••••••••",
      fromName: "ARPK Web Development",
      fromEmail: "notifications@arpkwebdev.com",
      enableEmailNotifications: true,
    },
  })

  const paymentForm = useForm({
    defaultValues: {
      currency: "GBP",
      taxRate: "20",
      invoicePrefix: "INV-",
      paymentTerms: "14",
      enableStripe: true,
      enablePayPal: false,
      enableBankTransfer: true,
    },
  })

  const notificationForm = useForm({
    defaultValues: {
      newUserNotification: true,
      newPaymentNotification: true,
      newProjectNotification: true,
      projectUpdateNotification: true,
      marketingEmails: false,
      emailDigest: "daily",
    },
  })

  const securityForm = useForm({
    defaultValues: {
      requireMfa: false,
      passwordMinLength: "8",
      passwordRequireUppercase: true,
      passwordRequireNumbers: true,
      passwordRequireSymbols: false,
      sessionTimeout: "30",
      maxLoginAttempts: "5",
    },
  })

  const userForm = useForm({
    defaultValues: {
      allowRegistration: true,
      requireEmailVerification: true,
      defaultUserRole: "user",
      allowProfileCustomization: true,
      allowAvatarUpload: true,
      maxFileSize: "5",
    },
  })

  const backupForm = useForm({
    defaultValues: {
      enableAutomaticBackups: true,
      backupFrequency: "daily",
      backupRetention: "30",
      includeUserData: true,
      includeProjectData: true,
      includePaymentData: true,
    },
  })

  const onSubmit = async (data: any) => {
    setIsLoading(true)

    try {
      // In a real app, you would save this to your settings collection in Firestore
      const settingsRef = doc(db, "settings", "appSettings")
      await updateDoc(settingsRef, {
        [activeTab]: data,
      })

      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400">Manage your application settings and preferences.</p>
      </div>

      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-gray-900 border border-gray-800 p-0 h-auto flex flex-wrap">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-none flex-1 py-2.5 px-4"
          >
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-none flex-1 py-2.5 px-4"
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger
            value="payment"
            className="data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-none flex-1 py-2.5 px-4"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Payment
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-none flex-1 py-2.5 px-4"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-none flex-1 py-2.5 px-4"
          >
            <Lock className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-none flex-1 py-2.5 px-4"
          >
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger
            value="backup"
            className="data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-none flex-1 py-2.5 px-4"
          >
            <FileText className="h-4 w-4 mr-2" />
            Backup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Configure the general settings for your application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form onSubmit={generalForm.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={generalForm.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-gray-800 border-gray-700 text-white" />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          The name of your website or application.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="bg-gray-800 border-gray-700 text-white" />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          A brief description of your website or application.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={generalForm.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" className="bg-gray-800 border-gray-700 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={generalForm.control}
                      name="supportEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Support Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" className="bg-gray-800 border-gray-700 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={generalForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-gray-800 border-gray-700 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={generalForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="bg-gray-800 border-gray-700 text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => generalForm.reset()}
                      className="border-gray-700 text-white hover:bg-gray-800"
                    >
                      Reset
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Configure your email server settings and templates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={emailForm.control}
                      name="smtpHost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Host</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-gray-800 border-gray-700 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={emailForm.control}
                      name="smtpPort"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Port</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-gray-800 border-gray-700 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={emailForm.control}
                      name="smtpUsername"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Username</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-gray-800 border-gray-700 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={emailForm.control}
                      name="smtpPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Password</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" className="bg-gray-800 border-gray-700 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={emailForm.control}
                      name="fromName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-gray-800 border-gray-700 text-white" />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            The name that will appear in the from field.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={emailForm.control}
                      name="fromEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" className="bg-gray-800 border-gray-700 text-white" />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            The email address that will appear in the from field.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={emailForm.control}
                    name="enableEmailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Email Notifications</FormLabel>
                          <FormDescription className="text-gray-400">
                            Enable or disable all email notifications.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => emailForm.reset()}
                      className="border-gray-700 text-white hover:bg-gray-800"
                    >
                      Reset
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Configure your payment methods and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...paymentForm}>
                <form onSubmit={paymentForm.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={paymentForm.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                              <SelectItem value="GBP">GBP (£)</SelectItem>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={paymentForm.control}
                      name="taxRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax Rate (%)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" className="bg-gray-800 border-gray-700 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={paymentForm.control}
                      name="invoicePrefix"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Invoice Prefix</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-gray-800 border-gray-700 text-white" />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            Prefix for invoice numbers (e.g., INV-)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={paymentForm.control}
                      name="paymentTerms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Terms (days)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" className="bg-gray-800 border-gray-700 text-white" />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            Default number of days until payment is due
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-4 bg-gray-800" />

                  <h3 className="text-lg font-medium">Payment Methods</h3>

                  <FormField
                    control={paymentForm.control}
                    name="enableStripe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Stripe</FormLabel>
                          <FormDescription className="text-gray-400">Accept payments via Stripe</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={paymentForm.control}
                    name="enablePayPal"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">PayPal</FormLabel>
                          <FormDescription className="text-gray-400">Accept payments via PayPal</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={paymentForm.control}
                    name="enableBankTransfer"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Bank Transfer</FormLabel>
                          <FormDescription className="text-gray-400">Accept payments via bank transfer</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => paymentForm.reset()}
                      className="border-gray-700 text-white hover:bg-gray-800"
                    >
                      Reset
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription className="text-gray-400">Configure which notifications you receive.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onSubmit)} className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>

                  <FormField
                    control={notificationForm.control}
                    name="newUserNotification"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">New User Registration</FormLabel>
                          <FormDescription className="text-gray-400">
                            Receive notifications when a new user registers
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={notificationForm.control}
                    name="newPaymentNotification"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">New Payment</FormLabel>
                          <FormDescription className="text-gray-400">
                            Receive notifications for new payments
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={notificationForm.control}
                    name="newProjectNotification"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">New Project</FormLabel>
                          <FormDescription className="text-gray-400">
                            Receive notifications when a new project is created
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={notificationForm.control}
                    name="projectUpdateNotification"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Project Updates</FormLabel>
                          <FormDescription className="text-gray-400">
                            Receive notifications for project updates
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Separator className="my-4 bg-gray-800" />

                  <h3 className="text-lg font-medium">Marketing</h3>

                  <FormField
                    control={notificationForm.control}
                    name="marketingEmails"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Marketing Emails</FormLabel>
                          <FormDescription className="text-gray-400">
                            Receive marketing and promotional emails
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={notificationForm.control}
                    name="emailDigest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Digest Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-gray-400">
                          How often you want to receive email digests
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => notificationForm.reset()}
                      className="border-gray-700 text-white hover:bg-gray-800"
                    >
                      Reset
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Configure security settings for your application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form onSubmit={securityForm.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={securityForm.control}
                    name="requireMfa"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Require MFA</FormLabel>
                          <FormDescription className="text-gray-400">
                            Require multi-factor authentication for all users
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <h3 className="text-lg font-medium mt-6">Password Policy</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={securityForm.control}
                      name="passwordMinLength"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Password Length</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" className="bg-gray-800 border-gray-700 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={securityForm.control}
                      name="maxLoginAttempts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Login Attempts</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" className="bg-gray-800 border-gray-700 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={securityForm.control}
                      name="passwordRequireUppercase"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Require Uppercase</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={securityForm.control}
                      name="passwordRequireNumbers"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Require Numbers</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={securityForm.control}
                      name="passwordRequireSymbols"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Require Symbols</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <h3 className="text-lg font-medium mt-6">Session Settings</h3>

                  <FormField
                    control={securityForm.control}
                    name="sessionTimeout"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Session Timeout (minutes)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" className="bg-gray-800 border-gray-700 text-white" />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          How long until an inactive session expires
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => securityForm.reset()}
                      className="border-gray-700 text-white hover:bg-gray-800"
                    >
                      Reset
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle>User Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Configure user registration and account settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...userForm}>
                <form onSubmit={userForm.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={userForm.control}
                    name="allowRegistration"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Allow Registration</FormLabel>
                          <FormDescription className="text-gray-400">
                            Allow new users to register on the platform
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={userForm.control}
                    name="requireEmailVerification"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Require Email Verification</FormLabel>
                          <FormDescription className="text-gray-400">
                            Require users to verify their email address
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={userForm.control}
                    name="defaultUserRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default User Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-gray-400">
                          The default role assigned to new users
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <h3 className="text-lg font-medium mt-6">Profile Settings</h3>

                  <FormField
                    control={userForm.control}
                    name="allowProfileCustomization"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Allow Profile Customization</FormLabel>
                          <FormDescription className="text-gray-400">
                            Allow users to customize their profiles
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={userForm.control}
                    name="allowAvatarUpload"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Allow Avatar Upload</FormLabel>
                          <FormDescription className="text-gray-400">
                            Allow users to upload custom avatars
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={userForm.control}
                    name="maxFileSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max File Size (MB)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" className="bg-gray-800 border-gray-700 text-white" />
                        </FormControl>
                        <FormDescription className="text-gray-400">
                          Maximum file size for avatar uploads in MB
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => userForm.reset()}
                      className="border-gray-700 text-white hover:bg-gray-800"
                    >
                      Reset
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Backup & Data Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Configure backup settings and data management.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...backupForm}>
                <form onSubmit={backupForm.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={backupForm.control}
                    name="enableAutomaticBackups"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Automatic Backups</FormLabel>
                          <FormDescription className="text-gray-400">Enable automatic database backups</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={backupForm.control}
                      name="backupFrequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Backup Frequency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                              <SelectItem value="hourly">Hourly</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={backupForm.control}
                      name="backupRetention"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Backup Retention (days)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" className="bg-gray-800 border-gray-700 text-white" />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            How long to keep backups before deleting
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <h3 className="text-lg font-medium mt-6">Data Inclusion</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={backupForm.control}
                      name="includeUserData"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">User Data</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={backupForm.control}
                      name="includeProjectData"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Project Data</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={backupForm.control}
                      name="includePaymentData"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Payment Data</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => backupForm.reset()}
                      className="border-gray-700 text-white hover:bg-gray-800"
                    >
                      Reset
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your application data and perform maintenance tasks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-gray-800 p-4">
                <h3 className="text-lg font-medium mb-2">Manual Backup</h3>
                <p className="text-gray-400 mb-4">Create a manual backup of your database.</p>
                <Button className="bg-purple-600 hover:bg-purple-700">Create Backup</Button>
              </div>

              <div className="rounded-lg border border-gray-800 p-4">
                <h3 className="text-lg font-medium mb-2">Export Data</h3>
                <p className="text-gray-400 mb-4">Export your application data in various formats.</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                    Export as JSON
                  </Button>
                  <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                    Export as CSV
                  </Button>
                  <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                    Export as SQL
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border border-red-900/20 bg-red-900/10 p-4">
                <h3 className="text-lg font-medium mb-2 text-red-500">Danger Zone</h3>
                <p className="text-gray-400 mb-4">These actions are destructive and cannot be undone.</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
