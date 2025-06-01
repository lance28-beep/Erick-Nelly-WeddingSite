"use client"

import { Share2 } from "lucide-react"
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GeometricFrame } from "@/components/GeometricFrame"

export default function ShareSection() {
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Lance & Rosa Wedding',
        text: 'Join us in celebrating our special day!',
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-red-900 via-red-800 to-red-900 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 great-vibes-regular">Share Our Wedding</h2>
          <p className="text-lg md:text-xl text-yellow-200 max-w-2xl mx-auto">
            Help us spread the joy by sharing our wedding invitation with family and friends
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <GeometricFrame>
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm shadow-2xl">
              <CardContent className="p-8 md:p-12">
                <div className="w-48 h-48 md:w-56 md:h-56 bg-white/20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/30">
                  {url && (
                    <QRCodeSVG
                      value={url}
                      size={180}
                      level="H"
                      includeMargin={false}
                      className="p-2 bg-white rounded-lg"
                    />
                  )}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 great-vibes-regular">Scan to Share</h3>
                <p className="text-white/80 mb-6">Share this beautiful invitation with your loved ones</p>

                <Button 
                  onClick={handleShare}
                  className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-300"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Website
                </Button>
              </CardContent>
            </Card>
          </GeometricFrame>
        </div>
      </div>
    </section>
  )
} 