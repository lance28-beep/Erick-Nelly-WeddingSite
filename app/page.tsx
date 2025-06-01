"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Heart,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Gift,
  QrCode,
  Camera,
  Wine,
  Users,
  Crown,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Music,
  Car,
  Utensils,
  Menu,
  X,
} from "lucide-react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import ShareSection from './components/ShareSection'
import { QRCodeSVG } from 'qrcode.react'
import RsvpForm from './components/RsvpForm'

export default function WeddingInvitation() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [websiteUrl, setWebsiteUrl] = useState('')

  useEffect(() => {
    // Set the wedding date using local time (not UTC)
    const weddingDate = new Date(2025, 5, 6, 10, 30, 0) // Months are 0-indexed: 5 = June

    const timer = setInterval(() => {
      const now = new Date()
      const distance = weddingDate.getTime() - now.getTime()

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        clearInterval(timer)
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft({
        days: days >= 0 ? days : 0,
        hours: hours >= 0 ? hours : 0,
        minutes: minutes >= 0 ? minutes : 0,
        seconds: seconds >= 0 ? seconds : 0,
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Set the website URL for QR code
    setWebsiteUrl(window.location.href)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMenuOpen(false)
    }
  }

  const navItems = [
    { id: "home", label: "Home" },
    { id: "details", label: "Details" },
    { id: "story", label: "Our Story" },
    { id: "timeline", label: "Timeline" },
    { id: "entourage", label: "Entourage" },
    { id: "rsvp", label: "RSVP" },
    { id: "faq", label: "FAQ" },
    { id: "location", label: "Location" },
  ]

  const faqData = [
    {
      question: "What time should I arrive?",
      answer:
        "Please arrive 15-30 minutes before the ceremony starts at 10:30 AM to allow time for seating and photos.",
    },
    {
      question: "Is there parking available at the venue?",
      answer:
        "Yes, Carolyna Hotel provides complimentary parking for all wedding guests. Valet service will also be available.",
    },
    {
      question: "What is the dress code?",
      answer:
        "We kindly request formal or semi-formal attire. We'd love to see our wedding colors - burgundy, gold, and rose - incorporated into your outfit if possible.",
    },
    {
      question: "Can I bring my children?",
      answer:
        "We love your little ones! Children are welcome at our celebration. We'll have some activities to keep them entertained during the reception.",
    },
    {
      question: "Will there be vegetarian/special dietary options?",
      answer:
        "Yes, we'll have vegetarian options available. Please let us know about any specific dietary restrictions when you RSVP.",
    },
    {
      question: "Is the venue wheelchair accessible?",
      answer: "Yes, Carolyna Hotel is fully wheelchair accessible with ramps and accessible restrooms available.",
    },
    {
      question: "What if it rains?",
      answer:
        "Don't worry! Our ceremony and reception are held indoors at Carolyna Hotel, so weather won't affect our celebration.",
    },
    {
      question: "Can I take photos during the ceremony?",
      answer:
        "We'd prefer an unplugged ceremony to ensure everyone is present in the moment. Our professional photographer will capture all the special moments to share with you later.",
    },
    {
      question: "How do I get to the venue?",
      answer:
        "Carolyna Hotel is located in San Roque, Tabaco City. You can scan our location QR code for detailed directions, or contact us for specific travel assistance.",
    },
    {
      question: "What time will the reception end?",
      answer:
        "The reception will continue until approximately 6:00 PM, giving us plenty of time to celebrate, dance, and create beautiful memories together.",
    },
  ]

  // Floral SVG Component
  const FloralDecoration = ({ className = "", position = "top-right" }: { className?: string; position?: string }) => (
    <div className={`absolute ${className} pointer-events-none`}>
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${position.includes("right") ? "" : "scale-x-[-1]"} ${position.includes("bottom") ? "scale-y-[-1]" : ""}`}
      >
        {/* Large Burgundy Rose */}
        <g transform="translate(50, 30)">
          <circle cx="25" cy="25" r="20" fill="#722F37" opacity="0.9" />
          <circle cx="25" cy="25" r="15" fill="#8B4B5C" opacity="0.8" />
          <circle cx="25" cy="25" r="10" fill="#A0616A" opacity="0.7" />
          <circle cx="25" cy="25" r="5" fill="#B87A7A" opacity="0.6" />
        </g>

        {/* Medium Pink Rose */}
        <g transform="translate(20, 80)">
          <circle cx="20" cy="20" r="15" fill="#D4A5A5" opacity="0.8" />
          <circle cx="20" cy="20" r="12" fill="#E8B5B5" opacity="0.7" />
          <circle cx="20" cy="20" r="8" fill="#F2C5C5" opacity="0.6" />
        </g>

        {/* Small White Flowers */}
        <g transform="translate(80, 60)">
          <circle cx="8" cy="8" r="6" fill="#F8F8F8" opacity="0.9" />
          <circle cx="8" cy="8" r="3" fill="#FFF" opacity="0.8" />
        </g>

        <g transform="translate(100, 90)">
          <circle cx="6" cy="6" r="4" fill="#F8F8F8" opacity="0.9" />
          <circle cx="6" cy="6" r="2" fill="#FFF" opacity="0.8" />
        </g>

        {/* Leaves and Foliage */}
        <g transform="translate(40, 60)">
          <ellipse cx="15" cy="8" rx="12" ry="4" fill="#4A5D23" opacity="0.7" transform="rotate(45)" />
          <ellipse cx="10" cy="15" rx="10" ry="3" fill="#5A6D33" opacity="0.6" transform="rotate(-30)" />
          <ellipse cx="25" cy="12" rx="8" ry="3" fill="#6A7D43" opacity="0.5" transform="rotate(60)" />
        </g>

        {/* Additional small elements */}
        <g transform="translate(70, 40)">
          <ellipse cx="5" cy="3" rx="6" ry="2" fill="#8A9D53" opacity="0.4" transform="rotate(20)" />
          <ellipse cx="12" cy="8" rx="5" ry="2" fill="#7A8D43" opacity="0.5" transform="rotate(-45)" />
        </g>
      </svg>
    </div>
  )

  // Geometric Frame Component
  const GeometricFrame = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 border-2 border-yellow-400/30 transform rotate-1"></div>
      <div className="absolute inset-2 border border-yellow-400/20 transform -rotate-1"></div>
      <div className="relative z-10">{children}</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-rose-50 to-amber-50">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg border-b border-red-100">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-900 mr-1 sm:mr-2" />
              <span className="text-lg sm:text-xl font-bold text-red-900 great-vibes-regular">Eric & Nelly</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-red-900 hover:text-red-600 transition-colors duration-200 font-medium text-sm lg:text-base"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-red-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-red-100">
              <div className="py-2 sm:py-4 space-y-1 sm:space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-red-900 hover:bg-red-50 transition-colors duration-200"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-[100vh] flex items-center justify-center bg-gradient-to-br from-[#800020] via-[#9B2D30] to-[#800020] text-white overflow-hidden pt-16 sm:pt-20 pb-8"
        style={{ marginTop: '64px' }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Enhanced Floral Decorations */}
        <Image
          src="/decorations/flower_1.png"
          alt="Floral Decoration"
          width={220}
          height={220}
          className="absolute top-0 right-0 opacity-20 sm:opacity-30 md:opacity-40 transform rotate-45 scale-40 sm:scale-50 md:scale-75 lg:scale-100 animate-float"
        />
        <Image
          src="/decorations/flower_1.png"
          alt="Floral Decoration"
          width={140}
          height={140}
          className="absolute bottom-2 left-2 opacity-20 sm:opacity-30 md:opacity-40 transform -rotate-12 scale-30 sm:scale-40 md:scale-60 lg:scale-75 animate-float"
          style={{ animationDelay: '1.5s' }}
        />
        <Image
          src="/decorations/flower_1.png"
          alt="Floral Decoration"
          width={100}
          height={100}
          className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 sm:opacity-15 md:opacity-20 scale-20 sm:scale-30 md:scale-50 lg:scale-75 animate-float"
          style={{ animationDelay: '2s' }}
        />

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <p className="text-sm sm:text-base md:text-xl mb-4 sm:mb-6 font-light tracking-[0.3em] uppercase">
              The Honor of Your Presence
            </p>
            <p className="text-xs sm:text-sm md:text-lg mb-3 sm:mb-4 font-light">is requested at the marriage of</p>

            <div className="relative mb-6 sm:mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-bold mb-3 sm:mb-4 text-yellow-400 great-vibes-regular drop-shadow-lg">
                Eric
              </h1>
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl text-yellow-300 great-vibes-regular mb-3 sm:mb-4 drop-shadow-lg">&</div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-bold mb-4 sm:mb-6 text-yellow-400 great-vibes-regular drop-shadow-lg">
                Nelly
              </h1>
            </div>

            <div className="space-y-1 sm:space-y-2 text-sm sm:text-base md:text-xl mb-6 sm:mb-8 font-light">
              <p>Saturday, the sixth of June</p>
              <p>two thousand twenty-five</p>
              <p className="mt-2 sm:mt-4">at half past ten in the morning</p>
            </div>

            <div className="mb-6 sm:mb-8">
              <p className="text-base sm:text-lg md:text-2xl font-light mb-1 sm:mb-2">Carolyna Hotel</p>
              <p className="text-sm sm:text-base md:text-lg text-yellow-200">San Roque, Tabaco City</p>
            </div>
          </div>

          {/* Enhanced Countdown Timer */}
          <div className="mb-8 sm:mb-12 mt-4 sm:mt-6">
            <h3 className="text-base sm:text-lg md:text-2xl font-light mb-4 sm:mb-6 text-yellow-200 great-vibes-regular">
              Until We Say "I Do"
            </h3>
            <div className="grid grid-cols-4 gap-1 sm:gap-2 md:gap-4 max-w-[280px] sm:max-w-xs md:max-w-2xl mx-auto px-1 sm:px-0">
              {[
                { value: timeLeft.days, label: "Days" },
                { value: timeLeft.hours, label: "Hours" },
                { value: timeLeft.minutes, label: "Minutes" },
                { value: timeLeft.seconds, label: "Seconds" },
              ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-1.5 sm:p-2 md:p-4 lg:p-6 border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 min-w-[50px] sm:min-w-[60px] md:min-w-[80px] mx-0.5"
              >
                <div className="text-sm sm:text-lg md:text-2xl lg:text-4xl font-bold text-yellow-400 mb-0.5 sm:mb-1">{item.value}</div>
                <div className="text-[10px] sm:text-xs md:text-base text-yellow-200 font-light">{item.label}</div>
              </div>
            ))}
            </div>
          </div>

          <p className="text-base sm:text-xl md:text-3xl great-vibes-regular text-yellow-300">Dancing & dinner follow</p>
        </div>
      </section>

      {/* Enhanced Love Story */}
      <section
        id="story"
        className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-red-50 via-rose-50 to-amber-50 relative overflow-hidden"
      >
        <FloralDecoration className="top-10 left-10 opacity-30 sm:opacity-40" position="top-left" />
        <FloralDecoration className="bottom-20 right-10 opacity-30 sm:opacity-40" position="bottom-right" />
        <Image
          src="/decorations/flower_4.png"
          alt="Floral decoration"
          width={200}
          height={200}
          className="absolute top-0 right-0 w-16 sm:w-24 md:w-48 opacity-40 sm:opacity-60 transform -rotate-12"
        />
        <Image
          src="/decorations/flower_4.png"
          alt="Floral decoration"
          width={200}
          height={200}
          className="absolute bottom-0 left-0 w-14 sm:w-20 md:w-40 opacity-30 sm:opacity-40 transform rotate-45"
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-red-900 mb-3 sm:mb-4 great-vibes-regular">Our Love Story</h2>
            <p className="text-lg sm:text-xl md:text-2xl text-red-700 mb-3 sm:mb-4 font-light italic">From Strangers to Soulmates</p>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-red-200 via-red-400 to-red-200 mx-auto rounded-full"></div>
          </div>

          {/* Enhanced Couple Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12 max-w-4xl mx-auto">
            {[1, 2, 4].map((num) => (
              <div 
                key={num} 
                className={`relative aspect-square overflow-hidden rounded-lg shadow-lg transform hover:scale-105 transition-all duration-500 ${
                  num === 2 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <Image
                  src={`/coupleIMG/image_${num}.png`}
                  alt={`Couple photo ${num}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          <div className="max-w-5xl mx-auto">
            <GeometricFrame>
              <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6 md:p-8 lg:p-16 relative">
                  <div className="absolute top-2 sm:top-4 md:top-8 left-2 sm:left-4 md:left-8 text-2xl sm:text-4xl md:text-6xl text-rose-200 great-vibes-regular">"</div>
                  <div className="absolute bottom-2 sm:bottom-4 md:bottom-8 right-2 sm:right-4 md:right-8 text-2xl sm:text-4xl md:text-6xl text-rose-200 great-vibes-regular rotate-180">
                    "
                  </div>

                  <div className="prose prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-none text-gray-700 leading-relaxed space-y-3 sm:space-y-4 md:space-y-6">
                    <p className="text-sm sm:text-base md:text-xl font-light first-letter:text-2xl sm:first-letter:text-4xl md:first-letter:text-5xl first-letter:font-bold first-letter:text-red-900 first-letter:float-left first-letter:mr-2 first-letter:mt-1">
                      We've crossed paths many times—through high school, college, and even as co-workers at LCC Malls
                      Legazpi. But back then, we were simply strangers in the same crowd—no conversations, no spark,
                      just fleeting glances and silent moments.
                    </p>

                    <p className="text-sm sm:text-base md:text-xl font-light">
                      It wasn't until 2016, while both working abroad, that fate took a gentle turn. Through Facebook,
                      we reconnected. (To this day, we still laugh about who sent the friend request first!) What
                      started as casual kumustahan turned into deep conversations about life, dreams, and everything in
                      between. After a year of heartfelt messages and late-night chats, I finally expressed what my
                      heart had been trying to say—and to my joy, she felt the same.
                    </p>

                    <p className="text-sm sm:text-base md:text-xl font-light">
                      We entered a long-distance relationship, me in Bahrain and her in Taiwan. The five-hour time
                      difference and the challenges of LDR eventually wore us down, and after two years, we parted ways.
                      It was a painful goodbye, but destiny had other plans.
                    </p>

                    <p className="text-sm sm:text-base md:text-xl font-light">
                      In November 2023, during her vacation to the Philippines, I made a bold decision—without telling
                      her, I booked a flight home. I went straight to her hometown in Tanglad, Hamorawon, and attended
                      her mother's birthday. After so many years apart, seeing her again face to face was a moment I'll
                      never forget. Though I didn't win her heart back that day, I knew I couldn't give up.
                    </p>

                    <p className="text-sm sm:text-base md:text-xl font-light">
                      Before her vacation ended, I promised myself—I wouldn't let this love slip away again. I poured my
                      heart out and this time, love found its way back to us.
                    </p>

                    <p className="text-sm sm:text-base md:text-xl font-light">
                      We're once again in a long-distance relationship, but now with deeper commitment, more maturity,
                      and a promise to never let time or distance break us again. We reached out to each other every
                      single day, building not just love, but a life together.
                    </p>

                    <div className="text-center mt-6 sm:mt-8 md:mt-12 p-3 sm:p-4 md:p-8 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl sm:rounded-2xl border border-red-100 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-200 via-red-400 to-red-200"></div>
                      <p className="text-base sm:text-lg md:text-2xl text-red-900 font-light mb-3 sm:mb-4">
                        Despite all the obstacles we faced, with the support and blessings of her parents and my family,
                        we're now ready to say our vows and finally hear the words we've waited so long for:
                      </p>
                      <p className="text-xl sm:text-2xl md:text-4xl text-yellow-600 font-bold great-vibes-regular">"I do."</p>
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-200 via-red-400 to-red-200"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GeometricFrame>
          </div>
        </div>
      </section>

      {/* Enhanced Wedding Timeline */}
      <section id="timeline" className="py-12 sm:py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-rose-50/30"></div>
        <FloralDecoration className="top-20 right-20 opacity-20 sm:opacity-30" position="top-right" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-red-900 mb-3 sm:mb-4 great-vibes-regular">Wedding Timeline</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              A perfect day planned with love and attention to every detail
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 sm:left-8 md:left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-400 via-yellow-400 to-red-400"></div>

              <div className="space-y-8 sm:space-y-12">
                {[
                  {
                    time: "10:00 AM",
                    event: "Ceremony",
                    icon: Crown,
                    description: "Exchange of vows and rings",
                    color: "bg-red-500",
                  },
                  {
                    time: "12:00 PM",
                    event: "Photos",
                    icon: Camera,
                    description: "Capturing beautiful memories",
                    color: "bg-yellow-500",
                  },
                  {
                    time: "12:30 PM",
                    event: "Reception",
                    icon: Users,
                    description: "Welcome cocktails and mingling",
                    color: "bg-rose-500",
                  },
                  {
                    time: "1:00 PM",
                    event: "Lunch",
                    icon: Utensils,
                    description: "Delicious wedding feast",
                    color: "bg-amber-500",
                  },
                  {
                    time: "2:00 PM",
                    event: "Party",
                    icon: Music,
                    description: "Dancing and celebration",
                    color: "bg-red-600",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 sm:gap-6 md:gap-8 relative">
                    <div
                      className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 ${item.color} rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 relative z-10`}
                    >
                      <item.icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <GeometricFrame className="flex-1">
                      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
                        <CardContent className="p-4 sm:p-6 md:p-8">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-red-900 great-vibes-regular">
                              {item.event}
                            </h3>
                            <span className="text-base sm:text-lg md:text-xl font-bold text-yellow-600">{item.time}</span>
                          </div>
                          <p className="text-sm sm:text-base text-gray-600 font-light">{item.description}</p>
                        </CardContent>
                      </Card>
                    </GeometricFrame>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Dress Code */}
      <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-red-50 via-rose-50 to-amber-50 relative overflow-hidden">
        <FloralDecoration className="top-10 left-10 opacity-30 sm:opacity-40" position="top-left" />

        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-red-900 mb-3 sm:mb-4 great-vibes-regular">Dress Code</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">Help us create a beautiful, cohesive celebration</p>
          </div>

          <GeometricFrame className="max-w-3xl mx-auto">
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6 md:p-8 lg:p-12 text-center">
                <div className="mb-6 sm:mb-8">
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed mb-4 sm:mb-6">
                    We kindly encourage our guests to wear{" "}
                    <strong className="text-red-900">formal/semi-formal attire</strong> with these beautiful colors on
                    our special day.
                  </p>

                  <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-6 sm:mb-8">
                    <div className="text-center group">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-red-900 rounded-full border-2 sm:border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-300 mb-2 sm:mb-3"></div>
                      <p className="text-xs sm:text-sm md:text-base font-semibold text-red-900">Burgundy</p>
                    </div>
                    <div className="text-center group">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-yellow-500 rounded-full border-2 sm:border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-300 mb-2 sm:mb-3"></div>
                      <p className="text-xs sm:text-sm md:text-base font-semibold text-yellow-700">Gold</p>
                    </div>
                    <div className="text-center group">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-rose-600 rounded-full border-2 sm:border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-300 mb-2 sm:mb-3"></div>
                      <p className="text-xs sm:text-sm md:text-base font-semibold text-rose-700">Rose</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-red-100">
                  <h3 className="text-lg sm:text-xl font-bold text-red-900 mb-3 sm:mb-4 great-vibes-regular">Style Guidelines</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    <div>
                      <h4 className="font-semibold text-red-800 mb-1 sm:mb-2">For Ladies:</h4>
                      <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                        <li>• Elegant dresses or formal separates</li>
                        <li>• Midi to floor-length preferred</li>
                        <li>• Comfortable heels for dancing</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-800 mb-1 sm:mb-2">For Gentlemen:</h4>
                      <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                        <li>• Suit or dress shirt with slacks</li>
                        <li>• Tie or bow tie encouraged</li>
                        <li>• Dress shoes recommended</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </GeometricFrame>
        </div>
      </section>

      {/* Enhanced Wedding Entourage */}
      <section id="entourage" className="py-12 sm:py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-rose-50/30"></div>
        <FloralDecoration className="bottom-20 right-20 opacity-20 sm:opacity-30" position="bottom-right" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-red-900 mb-3 sm:mb-4 great-vibes-regular">Wedding Entourage</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              The special people who will stand with us on our big day
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
            {/* Parents */}
            <GeometricFrame>
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/95 backdrop-blur-sm h-full">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                      <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-red-900 great-vibes-regular">Parents</h3>
                  </div>
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-red-100">
                      <h4 className="font-bold text-red-800 mb-2 sm:mb-3 text-center text-sm sm:text-base">Parents of the Groom</h4>
                      <div className="text-center space-y-1">
                        <p className="text-sm sm:text-base text-gray-700 font-medium">Anatolio Bibon</p>
                        <p className="text-sm sm:text-base text-gray-700 font-medium">Juliana Bibon</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-rose-50 to-red-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-rose-100">
                      <h4 className="font-bold text-red-800 mb-2 sm:mb-3 text-center text-sm sm:text-base">Parents of the Bride</h4>
                      <div className="text-center space-y-1">
                        <p className="text-sm sm:text-base text-gray-700 font-medium">Ulpiano Bernal</p>
                        <p className="text-sm sm:text-base text-gray-700 font-medium">Erlinia Bernal</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GeometricFrame>

            {/* Principal Sponsors */}
            <GeometricFrame>
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/95 backdrop-blur-sm h-full">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                      <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-red-900 great-vibes-regular">
                      Principal Sponsors
                    </h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div className="space-y-1 sm:space-y-2">
                      <p className="text-gray-700">Mrs. Rosa Boncay</p>
                      <p className="text-gray-700">Mrs. Benita Bergonio Groth</p>
                      <p className="text-gray-700">Mrs. Margie Conor</p>
                      <p className="text-gray-700">Mrs. Elisa Bas</p>
                      <p className="text-gray-700">Mrs. Imelda Bermas</p>
                      <p className="text-gray-700">Mrs. Lilia B. Buama</p>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <p className="text-gray-700">Mr. Juan Boncay</p>
                      <p className="text-gray-700">Mr. Noel Bunao</p>
                      <p className="text-gray-700">Mr. Adrian Borlado</p>
                      <p className="text-gray-700">Hon. Capt. Elias Toto Bobiles</p>
                      <p className="text-gray-700">Mr. Jovito Oriola</p>
                      <p className="text-gray-700">Mr. Eduardo B. Buama</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GeometricFrame>

            {/* Best Man & Maid of Honor */}
            <GeometricFrame>
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/95 backdrop-blur-sm h-full">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                      <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-red-900 great-vibes-regular">
                      Best Man & Maid of Honor
                    </h3>
                  </div>
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-blue-100">
                      <h4 className="font-bold text-red-800 mb-2 sm:mb-2 text-center text-sm sm:text-base">Best Man</h4>
                      <p className="text-sm sm:text-base text-gray-700 font-medium text-center">Iron Bibon</p>
                    </div>
                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-pink-100">
                      <h4 className="font-bold text-red-800 mb-2 sm:mb-2 text-center text-sm sm:text-base">Maid of Honor</h4>
                      <p className="text-sm sm:text-base text-gray-700 font-medium text-center">Shyren G. Bernal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GeometricFrame>

            {/* Groomsmen & Bridesmaids */}
            <GeometricFrame>
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/95 backdrop-blur-sm h-full">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                      <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-red-900 great-vibes-regular">
                      Groomsmen & Bridesmaids
                    </h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-blue-100">
                      <h4 className="font-bold text-red-800 mb-2 sm:mb-3 text-center text-sm sm:text-base">Groomsmen</h4>
                      <div className="text-xs sm:text-sm space-y-1 sm:space-y-2 text-center">
                        <p className="text-gray-700">Ej Broqueza</p>
                        <p className="text-gray-700">Lance Vergil Basallote</p>
                        <p className="text-gray-700">Justine Dave Bibon</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-pink-100">
                      <h4 className="font-bold text-red-800 mb-2 sm:mb-3 text-center text-sm sm:text-base">Bridesmaids</h4>
                      <div className="text-xs sm:text-sm space-y-1 sm:space-y-2 text-center">
                        <p className="text-gray-700">Ana Sofia Balonzo</p>
                        <p className="text-gray-700">Alexcel Bendal</p>
                        <p className="text-gray-700">Nicole Bernal</p>
                        <p className="text-gray-700">Avegail Mora</p>
                        <p className="text-gray-700">Cindy Bibat</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GeometricFrame>

            {/* Secondary Sponsors */}
            <GeometricFrame className="lg:col-span-2">
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/95 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                      <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-red-900 great-vibes-regular">
                      Secondary Sponsors
                    </h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 sm:gap-6 text-xs sm:text-sm">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-yellow-100">
                        <h4 className="font-bold text-red-800 mb-1 sm:mb-2 text-center text-sm sm:text-base">Candle</h4>
                        <p className="text-gray-700 text-center">Grig Vargas and Erica Diaz</p>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-100">
                        <h4 className="font-bold text-red-800 mb-1 sm:mb-2 text-center text-sm sm:text-base">Veil</h4>
                        <p className="text-gray-700 text-center">Marlon Boncay</p>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-100">
                        <h4 className="font-bold text-red-800 mb-1 sm:mb-2 text-center text-sm sm:text-base">Cord</h4>
                        <p className="text-gray-700 text-center">Roy Escota</p>
                      </div>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-pink-100">
                        <h4 className="font-bold text-red-800 mb-1 sm:mb-2 text-center text-sm sm:text-base">Flower Girls</h4>
                        <div className="text-center space-y-1">
                          <p className="text-gray-700">Cate Andrie Lopez</p>
                          <p className="text-gray-700">Sofia Datu</p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-100">
                        <h4 className="font-bold text-red-800 mb-1 sm:mb-2 text-center text-sm sm:text-base">Bible Bearer</h4>
                        <p className="text-gray-700 text-center">Matthew Biron</p>
                      </div>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-orange-100">
                        <h4 className="font-bold text-red-800 mb-1 sm:mb-2 text-center text-sm sm:text-base">Coin Bearer</h4>
                        <p className="text-gray-700 text-center">Sky Diaz</p>
                      </div>

                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-indigo-100">
                        <h4 className="font-bold text-red-800 mb-1 sm:mb-2 text-center text-sm sm:text-base">Ring Bearer</h4>
                        <div className="text-center space-y-1">
                          <p className="text-gray-700">Luna Bibat</p>
                          <p className="text-gray-700">Kate Ashly Bernal</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GeometricFrame>
          </div>
        </div>
      </section>

      {/* Enhanced RSVP Section */}
      <section id="rsvp" className="py-16 md:py-24 bg-gradient-to-br from-red-50 via-rose-50 to-amber-50 relative overflow-hidden">
        <FloralDecoration className="top-20 left-20 opacity-40" position="top-left" />
        <FloralDecoration className="bottom-20 right-20 opacity-40 rotate-180" position="bottom-right" />
        <div className="absolute inset-0 bg-[url('/patterns/pattern-light.png')] opacity-5"></div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-red-900 mb-4 great-vibes-regular">RSVP</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Please let us know if you'll be joining us on our special day
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <RsvpForm />
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section
        id="faq"
        className="py-16 md:py-24 bg-gradient-to-br from-red-50 via-rose-50 to-amber-50 relative overflow-hidden"
      >
        <FloralDecoration className="top-10 left-10 opacity-40" position="top-left" />
        <FloralDecoration className="bottom-20 right-10 opacity-40" position="bottom-right" />
        <Image
          src="/decorations/flower_4.png"
          alt="Floral decoration"
          width={200}
          height={200}
          className="absolute top-0 right-0 w-24 md:w-48 opacity-60 transform -rotate-12"
        />

        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-red-900 mb-4 great-vibes-regular">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Everything you need to know for our special day</p>
            <div className="w-24 h-1 bg-gradient-to-r from-red-200 via-red-400 to-red-200 mx-auto rounded-full mt-6"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  question: "What is the dress code?",
                  answer: "We kindly request formal or semi-formal attire. We'd love to see our wedding colors - burgundy, gold, and rose - incorporated into your outfit if possible. For ladies: elegant dresses or formal separates, midi to floor-length preferred. For gentlemen: suit or dress shirt with slacks, tie or bow tie encouraged.",
                  icon: Crown,
                },
                {
                  question: "What time should I arrive?",
                  answer: "Please arrive 15-30 minutes before the ceremony starts at 10:30 AM to allow time for seating and photos. The ceremony will begin promptly at 10:30 AM.",
                  icon: Clock,
                },
                {
                  question: "Is there parking available?",
                  answer: "Yes, Carolyna Hotel provides complimentary parking for all wedding guests. The parking area is well-lit and secure.",
                  icon: Car,
                },
                {
                  question: "Can I bring my children?",
                  answer: "We love your little ones! Children are welcome at our celebration. Please let us know in your RSVP if you're bringing children so we can prepare accordingly.",
                  icon: Users,
                },
                {
                  question: "Will there be vegetarian options?",
                  answer: "Yes, we'll have vegetarian options available. Please let us know about any specific dietary restrictions when you RSVP so we can accommodate your needs.",
                  icon: Utensils,
                },
                {
                  question: "How do I get to the venue?",
                  answer: "Carolyna Hotel is located in San Roque, Tabaco City. You can scan our location QR code for detailed directions, or contact us at +639353510431 for specific travel assistance. The venue is approximately 10 minutes from Tabaco City proper.",
                  icon: MapPin,
                },
              ].map((faq, index) => (
                <GeometricFrame key={index}>
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm h-full">
                    <CardContent className="p-0">
                      <button
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="w-full p-6 md:p-8 text-left flex items-start gap-4 hover:bg-red-50/50 transition-colors duration-200"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                          <faq.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg md:text-xl font-semibold text-red-900 mb-2">{faq.question}</h3>
                          {openFaq === index && (
                            <div className="mt-4">
                              <div className="border-t border-red-100 pt-4">
                                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          {openFaq === index ? (
                            <ChevronUp className="w-6 h-6 text-red-500" />
                          ) : (
                            <ChevronDown className="w-6 h-6 text-red-500" />
                          )}
                        </div>
                      </button>
                    </CardContent>
                  </Card>
                </GeometricFrame>
              ))}
            </div>

            {/* Additional Information Box */}
            <div className="mt-12">
              <GeometricFrame>
                <Card className="border-0 shadow-xl bg-gradient-to-r from-red-50 to-rose-50">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                        <MessageCircle className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-red-900">Still Have Questions?</h3>
                    </div>
                    <p className="text-gray-700 mb-4">
                      Don't hesitate to reach out to us directly. We're here to help make your experience as smooth as possible.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a
                        href="tel:+639353510431"
                        className="flex items-center justify-center gap-2 bg-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-red-900"
                      >
                        <Phone className="w-5 h-5" />
                        Call Us
                      </a>
                      <a
                        href="https://m.me/ric205"
                        className="flex items-center justify-center gap-2 bg-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-red-900"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Message Us
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </GeometricFrame>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Gift Registry */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-red-50 via-rose-50 to-amber-50 relative overflow-hidden">
        <FloralDecoration className="top-20 left-20 opacity-40" position="top-left" />
        <FloralDecoration className="bottom-20 right-20 opacity-40 rotate-180" position="bottom-right" />
        <div className="absolute inset-0 bg-[url('/patterns/pattern-light.png')] opacity-5"></div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-red-900 mb-4 great-vibes-regular">Gift Registry</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your love and presence are the greatest gifts of all
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <GeometricFrame>
              <Card className="border-0 shadow-2xl bg-white/98 backdrop-blur-sm">
                <CardContent className="p-8 md:p-12 text-center">
                  <div className="mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Gift className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-red-900 mb-6 great-vibes-regular">
                      A Note About Gifts
                    </h3>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 md:p-8 mb-8 border border-purple-100">
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed italic">
                      "Having you on our wedding day is what truly makes it special, but if you are thinking of giving a
                      gift of cash towards our new beginning, it would really help us on our way."
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 md:p-8 shadow-inner border border-gray-100">
                    <h4 className="text-xl md:text-2xl font-bold text-red-900 mb-6 great-vibes-regular">
                      GCash Payment
                    </h4>
                    <div className="w-56 h-56 md:w-64 md:h-64 bg-gradient-to-br from-gray-100 to-gray-200 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white relative overflow-hidden">
                      <Image
                        src="/gcash/gcashQR.png"
                        alt="GCash QR Code"
                        width={200}
                        height={200}
                        className="object-contain p-2"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-base md:text-lg font-semibold text-gray-700">
                        Scan the QR code to send your gift via GCash
                      </p>
                      <p className="text-sm text-gray-500">Safe, secure, and convenient</p>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                    <p className="text-sm md:text-base text-gray-600">
                      <strong>Alternative:</strong> Cash gifts can also be given during the reception. We'll have a
                      beautiful gift box available at the entrance.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </GeometricFrame>
          </div>
        </div>
      </section>

      {/* Enhanced Location */}
      <section id="location" className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-rose-50/30"></div>
        <FloralDecoration className="top-20 right-20 opacity-30" position="top-right" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-red-900 mb-4 great-vibes-regular">
              Location & Directions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Find your way to our celebration</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              <GeometricFrame>
                <Card className="border-0 shadow-2xl bg-white/98 backdrop-blur-sm h-full">
                  <CardContent className="p-8 md:p-12 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <MapPin className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-red-900 mb-4 great-vibes-regular">
                      St. John the Baptist Church
                    </h3>
                    <p className="text-lg md:text-xl text-gray-700 mb-6">Tabaco City, Albay</p>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center justify-center gap-3 text-gray-600">
                        <Car className="w-5 h-5" />
                        <span>Street parking available</span>
                      </div>
                      <div className="flex items-center justify-center gap-3 text-gray-600">
                        <Users className="w-5 h-5" />
                        <span>Wheelchair accessible</span>
                      </div>
                      <div className="flex items-center justify-center gap-3 text-gray-600">
                        <Clock className="w-5 h-5" />
                        <span>Historic landmark</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl p-6 border border-red-100">
                      <h4 className="text-lg font-bold text-red-900 mb-4 great-vibes-regular">Getting There</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Located in the heart of Tabaco City, Albay. The church is easily accessible by car, jeepney, or tricycle. 
                        Landmark: Near the Tabaco City Hall and public market. The church is a prominent historical landmark in the city center.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </GeometricFrame>

              <GeometricFrame>
                <Card className="border-0 shadow-2xl bg-white/98 backdrop-blur-sm h-full">
                  <CardContent className="p-8 md:p-12 text-center">
                    <h4 className="text-xl md:text-2xl font-bold text-red-900 mb-6 great-vibes-regular">
                      Scan for Directions
                    </h4>
                    <div className="w-56 h-56 md:w-64 md:h-64 bg-white mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
                      <QRCodeSVG
                        value="https://www.google.com/maps/place/St.+John+the+Baptist+Church/@13.359739,123.7290858,17z/data=!4m6!3m5!1s0x33a1adc7889ea233:0xceee1ff5090e429e!8m2!3d13.359739!4d123.7290858!16s%2Fm%2F012205n8?entry=ttu"
                        size={200}
                        level="H"
                        includeMargin={true}
                        className="p-2"
                      />
                    </div>
                    <p className="text-base md:text-lg font-semibold text-gray-700 mb-4">
                      Scan for location details
                    </p>
                    <p className="text-sm text-gray-500 mb-6">Opens in your preferred maps application</p>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                      <h5 className="font-bold text-red-800 mb-2 great-vibes-regular">Need Help?</h5>
                      <p className="text-sm text-gray-600">
                        Call us at <strong>+639353510431</strong> if you need assistance finding the venue.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </GeometricFrame>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Share Website */}
      <ShareSection />

      {/* Enhanced Footer */}
      <footer className="py-12 md:py-16 bg-gradient-to-b from-red-950 to-red-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/pattern-light.png')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="mb-8">
            <h3 className="text-3xl md:text-4xl font-bold mb-2 great-vibes-regular">Eric & Nelly</h3>
            <p className="text-lg md:text-xl text-yellow-200 mb-4">06.05.2025</p>
            <p className="text-white/80">Carolyna Hotel • San Roque, Tabaco City</p>
          </div>

          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
              <a
                href="tel:+639353510431"
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                +639353510431
              </a>
              <div className="hidden md:block w-1 h-1 bg-white/40 rounded-full"></div>
              <a href="https://m.me/ric205" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" />
                Facebook Messenger
              </a>
            </div>

            <p className="text-sm text-white/60 great-vibes-regular mb-8">
              With love and gratitude • Thank you for being part of our journey
            </p>

            {/* Website QR Code */}
            <div className="mb-8">
              <div className="inline-block bg-white p-2 rounded-xl shadow-lg">
                {websiteUrl && (
                  <QRCodeSVG
                    value={websiteUrl}
                    size={120}
                    level="H"
                    includeMargin={true}
                    className="rounded-lg"
                  />
                )}
              </div>
              <p className="text-sm text-white/70 mt-2">Scan to visit our website</p>
            </div>

            {/* Creator Attribution */}
            <div className="border-t border-white/10 pt-8">
              <p className="text-sm text-white/50 mb-2">Created by:</p>
              <a 
                href="https://www.facebook.com/WeddingInvitationNaga" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4"
              >
                <span className="text-yellow-200">Wedding Invitation Naga</span>
                <svg 
                  className="w-4 h-4" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* Copyright Notice */}
              <div className="border-t border-white/10 pt-4">
                <p className="text-xs text-white/40">
                  © {new Date().getFullYear()} Eric & Nelly's Wedding. All rights reserved.
                </p>
                <p className="text-xs text-white/40 mt-1">
                  Designed with ❤️ by Wedding Invitation Naga
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
