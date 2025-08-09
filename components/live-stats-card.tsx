"use client"

import { useEffect, useState } from "react"
import RevealOnView from "@/components/reveal-on-view"
import { TrendingUp, Users, Coffee, Zap } from "lucide-react"

type Props = {
  revealDelay?: number
}

export default function LiveStatsCard({ revealDelay = 0 }: Props) {
  const [stats, setStats] = useState({
    skillsLearned: 18,
    personalProjects: 7,
    coffeesCoded: 1247,
    applicationsSent: 9999,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        coffeesCoded: prev.coffeesCoded + Math.floor(Math.random() * 3),
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const statItems = [
    {
      icon: TrendingUp,
      label: "Skills Learned",
      value: stats.skillsLearned,
      suffix: "+",
      color: "text-green-400",
    },
    {
      icon: Zap,
      label: "Personal Projects",
      value: stats.personalProjects,
      suffix: "",
      color: "text-purple-400",
    },
    {
      icon: Coffee,
      label: "Coffees Coded",
      value: stats.coffeesCoded,
      suffix: "",
      color: "text-amber-400",
    },
    {
      icon: Users,
      label: "Job Applications Sent",
      value: stats.applicationsSent,
      suffix: "",
      color: "text-blue-400",
    },
  ]

  return (
    <article className="group relative lg:h-[calc(100svh-2rem)]">
      <RevealOnView
        delay={revealDelay}
        className="rounded-3xl border border-white/10 p-1 shadow-[0_10px_60px_-10px_rgba(0,0,0,0.6)] lg:h-full"
        style={{
          backgroundImage: `linear-gradient(135deg, #0c4a6e, #0369a1)`,
        }}
      >
        <div className="relative overflow-hidden rounded-[1.35rem] bg-black lg:h-full p-6 sm:p-8">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          </div>

          <div className="lg:h-full flex flex-col justify-center relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Live Graduate Stats</h2>
            </div>

            <p className="text-white/70 mb-8">
              Fresh out of university and actively seeking my first opportunity! Here are some stats from my journey so far.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {statItems.map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.label}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                      <div className="text-2xl font-bold text-white">
                        {typeof stat.value === "number" && stat.value % 1 !== 0 ? stat.value.toFixed(1) : stat.value}
                        {stat.suffix}
                      </div>
                    </div>
                    <p className="text-white/70 text-sm">{stat.label}</p>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <p className="text-blue-300 font-semibold text-sm">Open to new Opportunities</p>
              </div>
              
            </div>
          </div>
        </div>
      </RevealOnView>
    </article>
  )
}
