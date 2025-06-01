export interface RSVPEntry {
  id: string
  name: string
  email: string
  guestCount: number
  message?: string
  date: string
  source: 'local' | 'api'
} 