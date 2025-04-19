"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  User,
  FileText,
  CreditCard,
  LogOut,
  Upload,
  Clock,
  Calendar,
  BarChart,
  Award,
  Zap,
  Edit,
  Trash2,
  Download,
  ExternalLink,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"
import { db, storage } from "@/lib/firebase"
import { doc, getDoc, updateDoc, collection, query, where, getDocs, orderBy, limit, addDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

// Premium plan features
const PREMIUM_FEATURES = [
  { name: "Custom Profile", description: "Personalize your profile with custom themes and layouts", icon: Edit },
  { name: "Priority Support", description: "Get priority access to our support team", icon: Zap },
  { name: "Advanced Analytics", description: "Access detailed analytics for your projects", icon: BarChart },
  { name: "Unlimited Projects", description: "Create unlimited projects with no restrictions", icon: FileText },
  { name: "Team Collaboration", description: "Invite team members to collaborate on projects", icon: User },
  { name: "Custom Domain", description: "Use your own domain for your projects", icon: ExternalLink },
]

export default function ProfilePage() {
  const { user, userData, loading, signOut } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // User profile state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [company, setCompany] = useState("")
  const [website, setWebsite] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [coverImage, setCoverImage] = useState("")

  // UI state
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [projects, setProjects] = useState([])
  const [invoices, setInvoices] = useState([])
  const [activities, setActivities] = useState([])
  const [isPremium, setIsPremium] = useState(false)
  const [storageUsed, setStorageUsed] = useState(0)
  const [fileInputRef, setFileInputRef] = useState(null)

  // Fetch user data from Firestore
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      const fetchUserData = async () => {
        try {
          const userDocRef = doc(db, "users", user.uid)
          const userDoc = await getDoc(userDocRef)

          if (userDoc.exists()) {
            const data = userDoc.data()
            setName(data.displayName || user.displayName || "")
            setEmail(data.email || user.email || "")
            setBio(data.bio || "")
            setCompany(data.company || "")
            setWebsite(data.website || "")
            setPhone(data.phone || "")
            setLocation(data.location || "")
            setProfileImage(data.profileImage || user.photoURL || "")
            setCoverImage(data.coverImage || "")
            setIsPremium(data.isPremium || false)
            setStorageUsed(data.storageUsed || 0)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          toast({
            title: "Error",
            description: "Failed to load profile data. Please try again.",
            variant: "destructive",
          })
        }
      }

      fetchUserData()
      fetchUserProjects()
      fetchUserInvoices()
      fetchUserActivities()
    }
  }, [user, loading, router, toast])

  // Fetch user projects
  const fetchUserProjects = async () => {
    if (!user) return

    try {
      const projectsQuery = query(
        collection(db, "projects"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(5),
      )

      const querySnapshot = await getDocs(projectsQuery)
      const projectsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setProjects(projectsData)
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }

  // Fetch user invoices
  const fetchUserInvoices = async () => {
    if (!user) return

    try {
      const invoicesQuery = query(
        collection(db, "invoices"),
        where("userId", "==", user.uid),
        orderBy("date", "desc"),
        limit(5),
      )

      const querySnapshot = await getDocs(invoicesQuery)
      const invoicesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setInvoices(invoicesData)
    } catch (error) {
      console.error("Error fetching invoices:", error)
    }
  }

  // Fetch user activities
  const fetchUserActivities = async () => {
    if (!user) return

    try {
      const activitiesQuery = query(
        collection(db, "activities"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc"),
        limit(10),
      )

      const querySnapshot = await getDocs(activitiesQuery)
      const activitiesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setActivities(activitiesData)
    } catch (error) {
      console.error("Error fetching activities:", error)
    }
  }

  // Handle profile image upload
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)

    try {
      const storageRef = ref(storage, `profile-images/${user.uid}/${Date.now()}-${file.name}`)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)

      setProfileImage(downloadURL)

      // Update user document with new profile image
      const userDocRef = doc(db, "users", user.uid)
      await updateDoc(userDocRef, {
        profileImage: downloadURL,
        updatedAt: new Date().toISOString(),
      })

      toast({
        title: "Profile image updated",
        description: "Your profile image has been updated successfully.",
      })
    } catch (error) {
      console.error("Error uploading profile image:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your profile image.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  // Handle cover image upload
  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)

    try {
      const storageRef = ref(storage, `cover-images/${user.uid}/${Date.now()}-${file.name}`)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)

      setCoverImage(downloadURL)

      // Update user document with new cover image
      const userDocRef = doc(db, "users", user.uid)
      await updateDoc(userDocRef, {
        coverImage: downloadURL,
        updatedAt: new Date().toISOString(),
      })

      toast({
        title: "Cover image updated",
        description: "Your cover image has been updated successfully.",
      })
    } catch (error) {
      console.error("Error uploading cover image:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your cover image.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  // Save profile information
  const handleSaveProfile = async () => {
    setSaving(true)

    try {
      const userDocRef = doc(db, "users", user.uid)
      await updateDoc(userDocRef, {
        displayName: name,
        email: email,
        bio: bio,
        company: company,
        website: website,
        phone: phone,
        location: location,
        updatedAt: new Date().toISOString(),
      })

      // Add activity record
      const activityRef = collection(db, "activities")
      await addDoc(activityRef, {
        userId: user.uid,
        type: "profile_update",
        description: "Updated profile information",
        timestamp: new Date().toISOString(),
      })

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "There was an error updating your profile.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/")
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error logging out.",
        variant: "destructive",
      })
    }
  }

  // Handle upgrade to premium
  const handleUpgradeToPremium = () => {
    router.push("/pricing")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center items-center min-h-screen">
        <div className="w-full max-w-4xl">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="max-w-6xl mx-auto">
        {/* Cover Image */}
        <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden mb-16 bg-gradient-to-r from-purple-900 to-indigo-900">
          {coverImage ? (
            <Image src={coverImage || "/placeholder.svg"} alt="Cover" fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-indigo-900">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute bottom-4 left-4 text-white text-lg font-medium">
                {isPremium ? "Premium Member" : "Add a cover image"}
              </div>
            </div>
          )}

          {/* Upload cover image button */}
          <Button
            size="sm"
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70"
            onClick={() => document.getElementById("cover-upload").click()}
            disabled={uploading}
          >
            {uploading ? <Clock className="h-4 w-4 mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
            {uploading ? "Uploading..." : "Change Cover"}
          </Button>
          <input id="cover-upload" type="file" accept="image/*" className="hidden" onChange={handleCoverImageUpload} />

          {/* Profile image */}
          <div className="absolute -bottom-12 left-8 rounded-full border-4 border-background">
            <div className="relative">
              <Avatar className="h-24 w-24 md:h-32 md:w-32">
                <AvatarImage src={profileImage || "/placeholder.svg"} alt={name} />
                <AvatarFallback className="bg-purple-800 text-white text-xl">
                  {name ? name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-purple-600 hover:bg-purple-700"
                onClick={() => document.getElementById("profile-upload").click()}
                disabled={uploading}
              >
                {uploading ? <Clock className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
              </Button>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageUpload}
              />
            </div>
          </div>

          {/* Premium badge */}
          {isPremium && (
            <div className="absolute -bottom-6 right-8">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-3 py-1">
                <Award className="h-4 w-4 mr-1" /> Premium
              </Badge>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar */}
          <div className="md:w-64 space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold">{name || "User"}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
                    {location && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{location}</p>}
                  </div>

                  {bio && (
                    <div>
                      <p className="text-sm">{bio}</p>
                    </div>
                  )}

                  {website && (
                    <div className="flex items-center text-sm text-purple-600 dark:text-purple-400">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      <a href={website} target="_blank" rel="noopener noreferrer" className="truncate">
                        {website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}

                  <Separator />

                  {/* Account stats */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Member since</span>
                      <span>{new Date(userData?.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Projects</span>
                      <span>{projects.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Storage</span>
                      <span>{(storageUsed / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Premium status */}
                  {isPremium ? (
                    <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 p-3 rounded-lg border border-purple-800/30">
                      <div className="flex items-center mb-2">
                        <Award className="h-5 w-5 text-amber-500 mr-2" />
                        <span className="font-medium">Premium Account</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        You have access to all premium features and priority support.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-gray-900/20 to-gray-800/20 p-3 rounded-lg border border-gray-800/30">
                      <div className="flex items-center mb-2">
                        <Lock className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="font-medium">Free Account</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        Upgrade to premium to unlock all features and benefits.
                      </p>
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        onClick={handleUpgradeToPremium}
                      >
                        <Zap className="h-4 w-4 mr-1" /> Upgrade to Premium
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick links */}
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm h-9"
                    onClick={() => router.push("/dashboard")}
                  >
                    <BarChart className="h-4 w-4 mr-2" /> Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm h-9"
                    onClick={() => router.push("/request")}
                  >
                    <FileText className="h-4 w-4 mr-2" /> New Request
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm h-9"
                    onClick={() => router.push("/pricing")}
                  >
                    <CreditCard className="h-4 w-4 mr-2" /> Pricing
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm h-9 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Log out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-4 bg-background border dark:border-gray-800 p-1">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-0 space-y-4">
                {/* Activity Feed */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your recent actions and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activities.length > 0 ? (
                      <div className="space-y-4">
                        {activities.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-4">
                            <div className="mt-1 rounded-full bg-purple-100 dark:bg-purple-900/30 p-2">
                              {activity.type === "profile_update" && (
                                <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              )}
                              {activity.type === "project_created" && (
                                <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              )}
                              {activity.type === "payment" && (
                                <CreditCard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              )}
                              {activity.type === "login" && (
                                <LogOut className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{activity.description}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(activity.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No recent activity</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Your recent actions will appear here.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Projects Overview */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Your Projects</CardTitle>
                        <CardDescription>Recent projects you've created</CardDescription>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => router.push("/request")}>
                        New Project
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {projects.length > 0 ? (
                      <div className="space-y-4">
                        {projects.map((project) => (
                          <div
                            key={project.id}
                            className="flex items-center gap-4 p-3 rounded-lg border dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                          >
                            <div className="rounded-md bg-purple-100 dark:bg-purple-900/30 p-2">
                              <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium truncate">{project.title}</h3>
                                <Badge
                                  variant={project.status === "completed" ? "default" : "outline"}
                                  className="text-xs"
                                >
                                  {project.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                Created {new Date(project.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Button size="sm" variant="ghost" onClick={() => router.push(`/project/${project.id}`)}>
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          You haven't created any projects yet. Get started by requesting a new website.
                        </p>
                        <Button
                          onClick={() => router.push("/request")}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          Request Website
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Premium Features */}
                {!isPremium && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Premium Features</CardTitle>
                      <CardDescription>Unlock these features with a premium account</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {PREMIUM_FEATURES.map((feature) => (
                          <div
                            key={feature.name}
                            className="flex items-start gap-3 p-3 rounded-lg border dark:border-gray-800"
                          >
                            <div className="rounded-md bg-gray-100 dark:bg-gray-800 p-2">
                              <feature.icon className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                              <h3 className="font-medium">{feature.name}</h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{feature.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button
                        className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        onClick={handleUpgradeToPremium}
                      >
                        <Zap className="h-4 w-4 mr-2" /> Upgrade to Premium
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects" className="mt-0">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>My Projects</CardTitle>
                        <CardDescription>View and manage your web development projects</CardDescription>
                      </div>
                      <Button
                        onClick={() => router.push("/request")}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        New Project
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {projects.length > 0 ? (
                      <div className="space-y-4">
                        {projects.map((project) => (
                          <div
                            key={project.id}
                            className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg border dark:border-gray-800"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">{project.title}</h3>
                                <Badge
                                  variant={
                                    project.status === "completed"
                                      ? "default"
                                      : project.status === "in_progress"
                                        ? "secondary"
                                        : "outline"
                                  }
                                >
                                  {project.status === "in_progress"
                                    ? "In Progress"
                                    : project.status === "completed"
                                      ? "Completed"
                                      : project.status === "pending"
                                        ? "Pending"
                                        : project.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                {project.description?.substring(0, 100)}
                                {project.description?.length > 100 ? "..." : ""}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Created: {new Date(project.createdAt).toLocaleDateString()}
                                </div>
                                {project.deadline && (
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Due: {new Date(project.deadline).toLocaleDateString()}
                                  </div>
                                )}
                                {project.budget && (
                                  <div className="flex items-center">
                                    <CreditCard className="h-3 w-3 mr-1" />
                                    Budget: ${project.budget}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 self-end md:self-auto">
                              <Button size="sm" variant="outline" onClick={() => router.push(`/project/${project.id}`)}>
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <div className="p-8 text-center">
                          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            You haven't created any projects yet. Get started by requesting a new website.
                          </p>
                          <Button
                            onClick={() => router.push("/request")}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            Request Website
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Billing Tab */}
              <TabsContent value="billing" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Information</CardTitle>
                    <CardDescription>Manage your billing information and view payment history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Subscription Status */}
                      <div className="p-4 rounded-lg border dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                        <h3 className="font-medium mb-2">Current Plan</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-semibold">{isPremium ? "Premium Plan" : "Free Plan"}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {isPremium
                                ? "Your premium subscription is active"
                                : "Upgrade to premium for additional features"}
                            </p>
                          </div>
                          {!isPremium && (
                            <Button
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                              onClick={handleUpgradeToPremium}
                            >
                              Upgrade
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Payment Methods */}
                      <div>
                        <h3 className="font-medium mb-2">Payment Methods</h3>
                        <div className="rounded-lg border dark:border-gray-800 overflow-hidden">
                          <div className="p-8 text-center">
                            <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium mb-2">No payment methods</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                              You haven't added any payment methods yet.
                            </p>
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white">Add Payment Method</Button>
                          </div>
                        </div>
                      </div>

                      {/* Invoices */}
                      <div>
                        <h3 className="font-medium mb-2">Recent Invoices</h3>
                        {invoices.length > 0 ? (
                          <div className="rounded-lg border dark:border-gray-800 overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="bg-gray-50 dark:bg-gray-900/50">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                      Invoice
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                      Date
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                      Amount
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                      Status
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                      Actions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                  {invoices.map((invoice) => (
                                    <tr key={invoice.id}>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm">{invoice.number}</td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                                        {new Date(invoice.date).toLocaleDateString()}
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                                        ${invoice.amount.toFixed(2)}
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                                        <Badge variant={invoice.status === "paid" ? "default" : "outline"}>
                                          {invoice.status}
                                        </Badge>
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                                        <Button size="sm" variant="ghost">
                                          <Download className="h-4 w-4" />
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-lg border dark:border-gray-800 overflow-hidden">
                            <div className="p-8 text-center">
                              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                              <h3 className="text-lg font-medium mb-2">No invoices yet</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Your invoices will appear here once you make a purchase.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your account information and profile details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Tell us about yourself"
                          className="min-h-[100px]"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {saving ? "Saving..." : "Save changes"}
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive email notifications about your projects
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Project Updates</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Get notified when there are updates to your projects
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Marketing Emails</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive marketing emails about new features and offers
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">Save preferences</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security and password</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">Update Password</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Danger Zone</CardTitle>
                    <CardDescription>Irreversible account actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20">
                      <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Delete Account</h3>
                      <p className="text-sm text-red-600/70 dark:text-red-400/70 mb-4">
                        Once you delete your account, there is no going back. This action is permanent and will remove
                        all your data.
                      </p>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" /> Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
