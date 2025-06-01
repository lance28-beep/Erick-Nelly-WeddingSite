"use client"

import { useState, useEffect, useRef } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { v4 as uuidv4 } from "uuid"
import { Loader2, CheckCircle, AlertCircle, UserPlus, Calendar, Mail, MessageSquare, RefreshCw, Users, Info, Database } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { RSVPEntry } from "@/components/guest-counter"
import Stack from './Stack'
import { Marquee } from "@/components/ui/marquee"
import { GeometricFrame } from "@/components/ui/geometric-frame"

// Constants
const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSe9DJ56X0_6IOoC3U4VGfASjJ_WAbCC5UKw6eIGtHh4TAQCWw/formResponse"
const GOOGLE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQf21bVCWUFKtqpD7T1ZNd6ttMybFLoWyOb3HNp3dFAUvIaETPvr1phWN0ytj5LiyvXXrYLtNPx1aDG/pubhtml?gid=2108938434&single=true"
  
const RSVP_STORAGE_KEY = "wedding-rsvp-entries"

// Form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  guestCount: z.string().refine((val) => !isNaN(Number.parseInt(val)), {
    message: "Please select the number of guests",
  }),
  message: z.string().optional(),
})

const images = [
  { id: 1, img: "/coupleIMG/image_1.png" },
  { id: 2, img: "/coupleIMG/image_2.png" },
  { id: 3, img: "/coupleIMG/image_3.png" },

];

export default function RsvpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rsvpEntries, setRsvpEntries] = useState<RSVPEntry[]>([])
  const [totalGuests, setTotalGuests] = useState(0)
  const [activeTab, setActiveTab] = useState("form")
  const [isLoading, setIsLoading] = useState(false)

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      guestCount: "1",
      message: "",
    },
  })

  // Fetch RSVP entries from Google Apps Script endpoint ONLY (no localStorage, no fallback)
  const fetchAndUpdateEntries = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch from Google Apps Script endpoint
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwshakuclRCEYTjGXvCYYwEBSM7IDlXlQw8EeFI3Hxl42uYenNNFbe2wfjjPMEpaURtJg/exec",
        { cache: "no-store" }
      )
      
      if (!response.ok) {
        throw new Error("Failed to fetch guest list from Google Sheet. Please check if your Google Apps Script is deployed as a web app and set to 'Anyone' can access.")
      }

      const data = await response.json()
      
      // Check if data exists and has the expected structure
      if (!data || !data.GoogleSheetData) {
        setRsvpEntries([])
        setTotalGuests(0)
        return
      }

      const rows: string[][] = data.GoogleSheetData
      
      // If no rows or only header row exists, set empty state
      if (!Array.isArray(rows) || rows.length <= 1) {
        setRsvpEntries([])
        setTotalGuests(0)
        return
      }

      // The first row is the header
      const header = rows[0]
      const entries = rows.slice(1)

      // Map Google Sheet rows to RSVPEntry objects
      const apiEntries: RSVPEntry[] = entries.map((row, idx) => {
        const rowObj: Record<string, string> = {}
        header.forEach((col, i) => {
          rowObj[col] = row[i] || ""
        })
        return {
          id: `api-${idx}-${rowObj["Email"] || rowObj["Full Name"] || idx}`,
          name: rowObj["Full Name"] || "Guest",
          email: rowObj["Email"] || `no-email-${idx}@example.com`,
          guestCount: Number.parseInt(rowObj["Number Of Guests"] || "1"),
          message: rowObj["Message"] || undefined,
          date: rowObj["Timestamp"] || new Date().toISOString(),
          source: "api",
        }
      })

      // Set state directly from API
      setRsvpEntries(apiEntries)
      setTotalGuests(apiEntries.reduce((sum, entry) => sum + entry.guestCount, 0))
    } catch (error: any) {
      console.error("Failed to load entries:", error)
      setError(error?.message || "Failed to load entries. Please try again.\nIf this persists, check your Google Apps Script deployment and permissions.")
      setRsvpEntries([])
      setTotalGuests(0)
    } finally {
      setIsLoading(false)
    }
  }

  // Load saved entries from localStorage on component mount
  useEffect(() => {
    fetchAndUpdateEntries()

    // Set up event listener for RSVP updates
    const handleRsvpUpdate = () => {
      fetchAndUpdateEntries()
    }

    window.addEventListener("rsvpUpdated", handleRsvpUpdate)

    return () => {
      window.removeEventListener("rsvpUpdated", handleRsvpUpdate)
    }
  }, [])

  // Update the onSubmit function to match the Google Sheet format
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    setError(null)

    try {
      console.log("Submitting RSVP form...", values)

      // Create form data for Google Form submission
      const formData = new URLSearchParams()
      formData.append("entry.405401269", values.name) // Full Name
      formData.append("entry.1755234596", values.email) // Email
      formData.append("entry.1335956832", values.guestCount) // Number of Guests
      formData.append("entry.893740636", values.message || "") // Message

      // Submit to Google Form using a hidden iframe
      const form = document.createElement("form")
      form.method = "POST"
      form.action = GOOGLE_FORM_URL
      form.target = "hidden-iframe"
      form.style.display = "none"

      // Add form fields
      for (const [key, value] of formData.entries()) {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = key
        input.value = value
        form.appendChild(input)
      }

      // Create hidden iframe if it doesn't exist
      let iframe = document.getElementById("hidden-iframe") as HTMLIFrameElement
      if (!iframe) {
        iframe = document.createElement("iframe")
        iframe.name = "hidden-iframe"
        iframe.id = "hidden-iframe"
        iframe.style.display = "none"
        document.body.appendChild(iframe)
      }

      // Add form to document and submit
      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)

      // Create a new entry from the submitted data
      const newEntry: RSVPEntry = {
        id: uuidv4(),
        name: values.name,
        email: values.email,
        guestCount: Number.parseInt(values.guestCount) || 1,
        message: values.message,
        date: new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        }),
        source: "local",
      }

      // Get existing entries
      let existingEntries: RSVPEntry[] = []
      try {
        const savedEntries = localStorage.getItem(RSVP_STORAGE_KEY)
        if (savedEntries) {
          existingEntries = JSON.parse(savedEntries)
        }
      } catch (error) {
        console.error("Failed to load saved entries:", error)
      }

      // Add the new entry
      const updatedEntries = [newEntry, ...existingEntries]

      // Save to localStorage
      try {
        localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(updatedEntries))
        console.log("Saved updated entries to localStorage")

        // Update state
        setRsvpEntries(updatedEntries)
        setTotalGuests((prev) => prev + (Number.parseInt(values.guestCount) || 1))

        // Dispatch a custom event to notify other components of the update
        window.dispatchEvent(new Event("rsvpUpdated"))
      } catch (error) {
        console.error("Failed to save to localStorage:", error)
        setError("Failed to save your RSVP locally. Please try again.")
      }

      // Show success message and reset form
      setIsSuccess(true)
      form.reset()

      // Switch to responses tab after successful submission
      setTimeout(() => {
        setActiveTab("responses")
      }, 1500)

      // Fetch updated data after a delay to allow Google Sheets to update
      setTimeout(() => {
        fetchAndUpdateEntries()
      }, 5000) // Try after 5 seconds to get the updated list

    } catch (error) {
      console.error("Error submitting form:", error)
      setError("There was a problem submitting your RSVP. Please try again.")
    } finally {
      setIsSubmitting(false)
      // Reset success message after a delay
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center py-2 px-1 md:py-4 md:px-2 bg-[#800020]/5 relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: 'url("/decorations/image.png")' }}
      />
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white/95 shadow-2xl rounded-2xl overflow-hidden border-none relative z-10 min-h-[90vh] md:min-h-0">
        {/* Couple Image Section - Adjusted for mobile */}
        <div className="w-full md:w-2/5 flex flex-col items-center justify-center bg-[#800020]/5 p-2 md:p-10 min-h-[220px] md:min-h-[600px] relative overflow-hidden">
          {/* Decorative background for Stack - hidden on mobile */}
          <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat hidden md:block" style={{ backgroundImage: 'url("/decorations/image.png")' }} />
          {/* Optional overlay for elegance - hidden on mobile */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-white/80 via-[#800020]/10 to-transparent hidden md:block" />
          {/* Stack - hidden on mobile */}
          <div className="relative flex items-center justify-center w-full z-20 min-h-[120px] md:min-h-[180px]" style={{ display: 'none' }}>
            <Stack
              sensitivity={150}
              sendToBackOnClick={false}
              cardDimensions={{ width: 180, height: 260 }}
              cardsData={images}
              animationConfig={{ stiffness: 200, damping: 25 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#800020]/10 to-transparent rounded-2xl pointer-events-none" />
          </div>
          {/* Eric & Nelly section - full width and larger on mobile */}
          <div className="text-center space-y-1 mt-2 z-20 w-full flex flex-col items-center justify-center min-h-[120px] md:min-h-0">
            <h2 className="text-3xl sm:text-4xl md:text-4xl great-vibes-regular text-[#800020] leading-tight">Eric &amp; Nelly</h2>
            <p className="text-[#800020]/80 text-base sm:text-lg md:text-base font-medium leading-relaxed max-w-xs sm:max-w-md md:max-w-none mx-auto">
              Together with their families<br />
              invite you to celebrate their wedding
            </p>
          </div>
        </div>
        {/* RSVP Form Section - Mobile optimized */}
        <div className="w-full md:w-3/5 flex flex-col justify-center p-2 md:p-10 min-h-[350px] md:min-h-[600px] max-h-full">
          <Card className="border-none shadow-none bg-transparent h-full flex flex-col">
            <CardHeader className="bg-transparent p-0 mb-2 md:mb-4 flex flex-col items-center">
              <img src="/decorations/flower_3.png" alt="Wedding Flowers" className="h-8 md:h-12 mb-2" />
              <CardTitle className="text-2xl md:text-4xl great-vibes-regular text-[#800020] mb-1 text-center">Wedding RSVP</CardTitle>
              <CardDescription className="text-[#800020]/80 text-xs md:text-base font-medium text-center">
                Please let us know if you'll be joining us
              </CardDescription>
            </CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
              <div className="px-0 mt-2 md:mt-6 mb-2 md:mb-8 flex justify-center">
                <TabsList className="flex w-auto bg-[#800020]/5 p-1.5 md:p-2 rounded-full shadow-lg gap-2 md:gap-3 border border-[#800020]/10 backdrop-blur-sm">
                  <TabsTrigger
                    value="form"
                    className={`relative rounded-full px-4 md:px-6 py-2 md:py-3 font-semibold text-sm md:text-base transition-all duration-300 ease-in-out flex items-center gap-1.5 md:gap-2
                      ${activeTab === 'form'
                        ? 'bg-[#800020] text-white border-2 border-[#800020] shadow-md scale-105'
                        : 'bg-[#800020]/10 text-[#800020] border-2 border-[#800020]/20 hover:bg-[#800020]/20 hover:scale-[1.02]'}
                    `}
                  >
                    <UserPlus className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:scale-110" />
                    <span className="relative">RSVP</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="responses"
                    className={`relative rounded-full px-4 md:px-6 py-2 md:py-3 font-semibold text-sm md:text-base transition-all duration-300 ease-in-out flex items-center gap-1.5 md:gap-2
                      ${activeTab === 'responses'
                        ? 'bg-[#800020] text-white border-2 border-[#800020] shadow-md scale-105'
                        : 'bg-[#800020]/10 text-[#800020] border-2 border-[#800020]/20 hover:bg-[#800020]/20 hover:scale-[1.02]'}
                    `}
                  >
                    <Users className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:scale-110" />
                    <span className="relative">Guests</span>
                    <Badge className={`transition-all duration-300 text-xs md:text-sm ${
                      activeTab === 'responses'
                        ? 'bg-white/90 text-[#800020] border-none font-semibold px-2 md:px-3 py-0.5 ml-1 shadow-sm'
                        : 'bg-[#800020]/10 text-[#800020] border-none font-semibold px-2 md:px-3 py-0.5 ml-1'
                    }`}>
                      {totalGuests}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="form" className="flex-1 flex flex-col h-0 min-h-0">
                <CardContent className="p-0 flex-1 flex flex-col h-0 min-h-0">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full max-w-full md:max-w-2xl mx-auto px-1 md:px-6">
                      <div className="flex-1 pr-0 md:pr-2">
                        <div className="space-y-3 md:space-y-6 animate-fade-in">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem className="transform transition-all duration-300 hover:scale-[1.01]">
                                <FormLabel className="text-[#800020] font-semibold text-sm md:text-base flex items-center gap-2">
                                  <UserPlus className="w-4 h-4" />
                                  Full Name
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Enter your full name" 
                                    {...field} 
                                    className="bg-[#800020]/5 rounded-lg focus:ring-2 focus:ring-[#800020]/30 border-[#800020]/20 text-[#800020] placeholder:text-[#800020]/40 text-sm md:text-base h-10 md:h-11 transition-all duration-200 hover:border-[#800020]/30 focus:border-[#800020]/40" 
                                  />
                                </FormControl>
                                <FormMessage className="text-xs md:text-sm" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem className="transform transition-all duration-300 hover:scale-[1.01]">
                                <FormLabel className="text-[#800020] font-semibold text-sm md:text-base flex items-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  Email Address
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Enter your email address" 
                                    {...field} 
                                    className="bg-[#800020]/5 rounded-lg focus:ring-2 focus:ring-[#800020]/30 border-[#800020]/20 text-[#800020] placeholder:text-[#800020]/40 text-sm md:text-base h-10 md:h-11 transition-all duration-200 hover:border-[#800020]/30 focus:border-[#800020]/40" 
                                  />
                                </FormControl>
                                <FormMessage className="text-xs md:text-sm" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="guestCount"
                            render={({ field }) => (
                              <FormItem className="transform transition-all duration-300 hover:scale-[1.01]">
                                <FormLabel className="text-[#800020] font-semibold text-sm md:text-base flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  Number of Guests
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-[#800020]/5 rounded-lg focus:ring-2 focus:ring-[#800020]/30 border-[#800020]/20 text-[#800020] placeholder:text-[#800020]/40 text-sm md:text-base h-10 md:h-11 transition-all duration-200 hover:border-[#800020]/30 focus:border-[#800020]/40">
                                      <SelectValue placeholder="Select number of guests" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-white text-[#800020] border border-[#800020]/20 shadow-lg">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                      <SelectItem 
                                        key={num} 
                                        value={num.toString()} 
                                        className="text-sm md:text-base text-[#800020] hover:bg-[#800020]/5 data-[state=checked]:bg-[#800020]/10 data-[state=checked]:font-semibold transition-colors duration-200"
                                      >
                                        {num} {num === 1 ? 'Guest' : 'Guests'}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-xs md:text-sm" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem className="transform transition-all duration-300 hover:scale-[1.01]">
                                <FormLabel className="text-[#800020] font-semibold text-sm md:text-base flex items-center gap-2">
                                  <MessageSquare className="w-4 h-4" />
                                  Message (Optional)
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Share a message or any dietary restrictions"
                                    className="resize-none bg-[#800020]/5 rounded-lg focus:ring-2 focus:ring-[#800020]/30 border-[#800020]/20 text-[#800020] placeholder:text-[#800020]/40 text-sm md:text-base min-h-[80px] md:min-h-[100px] transition-all duration-200 hover:border-[#800020]/30 focus:border-[#800020]/40"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription className="text-xs md:text-sm text-[#800020]/60 flex items-center gap-1">
                                  <Info className="w-3 h-3" />
                                  Let us know if you have any dietary restrictions or special requests.
                                </FormDescription>
                                <FormMessage className="text-xs md:text-sm" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div className="sticky bottom-0 bg-white/95 pt-3 pb-2 z-20 border-t border-[#800020]/10 mt-auto">
                        <Button
                          type="submit"
                          className="w-full bg-[#800020] hover:bg-[#800020]/90 text-white text-base md:text-lg font-semibold py-2 md:py-3 rounded-xl shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              <span>Submitting...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-5 w-5" />
                              <span>Submit RSVP</span>
                            </>
                          )}
                        </Button>

                        {isSuccess && (
                          <div className="flex items-center justify-center mt-4 p-4 bg-green-50 text-green-700 rounded-lg shadow-sm text-sm md:text-base animate-fade-in border border-green-100">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            <span>Thank you! Your RSVP has been submitted successfully.</span>
                          </div>
                        )}

                        {error && (
                          <div className="flex items-center justify-center mt-4 p-4 bg-[#800020]/10 text-[#800020] rounded-lg shadow-sm text-sm md:text-base animate-fade-in border border-[#800020]/20">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            <span>{error}</span>
                          </div>
                        )}
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </TabsContent>
              <TabsContent value="responses" className="h-[550px] md:h-[500px]">
                <CardContent className="p-0">
                  <div className="space-y-4 md:space-y-6 h-full px-4 md:px-6">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center gap-3 animate-fade-in">
                          <Loader2 className="h-8 w-8 animate-spin text-[#800020]" />
                          <span className="text-[#800020] font-medium">Loading responses...</span>
                        </div>
                      </div>
                    ) : error ? (
                      <div className="flex items-center justify-center h-full text-[#800020] text-sm md:text-base">
                        <div className="flex flex-col items-center gap-3 animate-fade-in">
                          <AlertCircle className="h-8 w-8" />
                          <span>{error}</span>
                        </div>
                      </div>
                    ) : rsvpEntries.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-[#800020] text-sm md:text-base">
                        <div className="flex flex-col items-center gap-3 animate-fade-in">
                          <MessageSquare className="h-8 w-8" />
                          <span>No responses yet</span>
                        </div>
                      </div>
                    ) : (
                      <Marquee
                        direction="up"
                        vertical
                        pauseOnHover
                        speed={30}
                        gradientColor="from-[#800020]/5 via-transparent to-[#800020]/5"
                        gradientWidth="120px"
                        className="h-[calc(550px-80px)] md:h-[calc(500px-80px)] custom-scrollbar"
                      >
                        {rsvpEntries.map((entry, idx) => (
                          <Card 
                            key={entry.id} 
                            className={`${
                              idx % 2 === 0 ? "bg-[#800020]/5" : "bg-white"
                            } border-none shadow-sm rounded-xl mb-4 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md`}
                          >
                            <CardContent className="p-4 md:p-6">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-base md:text-lg text-[#800020] flex items-center gap-2">
                                    <UserPlus className="w-4 h-4" />
                                    {entry.name}
                                  </h4>
                                  <div className="flex items-center text-xs md:text-sm text-[#800020]/60 mt-2">
                                    <Mail className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                    <span>{entry.email}</span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end">
                                  <Badge
                                    variant="outline"
                                    className={`bg-[#800020]/10 text-[#800020] border-none font-semibold px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm flex items-center gap-1.5`}
                                  >
                                    <Users className="w-3 h-3" />
                                    {entry.guestCount} {entry.guestCount === 1 ? "Guest" : "Guests"}
                                  </Badge>
                                  <span className="text-[10px] md:text-xs text-[#800020]/40 mt-2 flex items-center gap-1">
                                    <Database className="w-3 h-3" />
                                    {entry.source === "api" ? "Google Sheet" : "Website"}
                                  </span>
                                </div>
                              </div>

                              {entry.message && (
                                <div className="mt-4 pt-4 border-t border-[#800020]/10">
                                  <div className="flex items-start">
                                    <MessageSquare className="h-4 w-4 mr-2 mt-0.5 text-[#800020]/30" />
                                    <p className="text-xs md:text-sm text-[#800020]/80 leading-relaxed">{entry.message}</p>
                                  </div>
                                </div>
                              )}

                              <div className="mt-4 text-[10px] md:text-xs text-[#800020]/40 flex items-center gap-1.5">
                                <Calendar className="h-3 w-3" />
                                <span>Submitted: {formatDate(entry.date)}</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </Marquee>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-[#800020]/10 pt-4 md:pt-6 bg-[#800020]/5 rounded-b-2xl">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 text-[#800020] hover:text-[#800020] hover:bg-[#800020]/10 border-[#800020]/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() => window.open('https://docs.google.com/spreadsheets/d/e/2PACX-1vQf21bVCWUFKtqpD7T1ZNd6ttMybFLoWyOb3HNp3dFAUvIaETPvr1phWN0ytj5LiyvXXrYLtNPx1aDG/pubhtml?gid=2108938434&single=true', '_blank')}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <path d="M8 13h8" />
                      <path d="M8 17h8" />
                      <path d="M8 9h1" />
                    </svg>
                    View in Google Sheets
                  </Button>
                </CardFooter>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
} 