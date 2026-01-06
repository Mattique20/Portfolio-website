"use client"

import { useEffect, useState } from "react"

interface LiveClockProps {
  timeZone: string
}

export default function LiveClock({ timeZone }: LiveClockProps) {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    // Initial format
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
    })

    const updateTime = () => {
      const now = new Date()
      setTime(formatter.format(now))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [timeZone])

  // Don't render anything on the server to prevent hydration mismatch
  if (!time) {
    return <div className="h-4 w-48 animate-pulse rounded bg-white/10" /> 
  }

  return (
    <div className="text-xs text-white/50 font-mono tabular-nums">
      {time}
    </div>
  )
}