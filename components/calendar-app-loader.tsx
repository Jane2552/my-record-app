'use client'

import dynamic from 'next/dynamic'

// Client-only so "today" reflects the visitor's timezone instead of the server's.
export const CalendarAppLoader = dynamic(() => import('@/components/calendar-app').then((m) => m.CalendarApp), {
  ssr: false,
  loading: () => <div className="min-h-dvh" aria-busy="true" />,
})
