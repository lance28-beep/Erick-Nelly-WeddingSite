import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Users, TrendingUp, Calendar } from 'lucide-react'

export interface RSVPEntry {
  id: string
  name: string
  email: string
  guestCount: number
  message?: string
  date: string
  source: 'local' | 'api'
}

interface GuestCounterProps {
  entries: RSVPEntry[]
  className?: string
}

export function GuestCounter({ entries, className }: GuestCounterProps) {
  const [totalGuests, setTotalGuests] = useState(0)
  const [uniqueGuests, setUniqueGuests] = useState(0)

  useEffect(() => {
    const total = entries.reduce((sum, entry) => sum + entry.guestCount, 0)
    const unique = entries.length
    setTotalGuests(total)
    setUniqueGuests(unique)
  }, [entries])

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center p-4 bg-rose-50 rounded-lg">
            <Users className="w-8 h-8 text-rose-600 mb-2" />
            <span className="text-2xl font-bold text-rose-700">{totalGuests}</span>
            <span className="text-sm text-rose-600">Total Guests</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-amber-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-amber-600 mb-2" />
            <span className="text-2xl font-bold text-amber-700">{uniqueGuests}</span>
            <span className="text-sm text-amber-600">Unique RSVPs</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 