"use client"
import React, { useState } from "react"
import dynamic from "next/dynamic"
import { Gamepad2, Grid3X3, Zap } from "lucide-react"
import { cn } from "@/lib/utils" 

// Loader now matches the responsive height
const CardLoader = () => (
  <div className="h-[900px] md:h-[600px] w-full rounded-3xl bg-neutral-900/50 animate-pulse border border-white/10" />
)

const TetrisCard = dynamic(() => import("@/components/interactive-showcase-card"), { 
  ssr: false, 
  loading: () => <CardLoader /> 
})
const SnakeCard = dynamic(() => import("@/components/snake-game-card"), { 
  ssr: false, 
  loading: () => <CardLoader /> 
})
const ColorCrashCard = dynamic(() => import("@/components/color-crash-game-card"), { 
  ssr: false, 
  loading: () => <CardLoader /> 
})

export default function InteractiveShowcaseClient(props: { revealDelay?: number }) {
  const [activeGame, setActiveGame] = useState<"tetris" | "snake" | "colorcrash">("tetris")

  return (
    // FIX: Taller min-height on mobile (900px) for vertical stacking, 600px on desktop
    <div className="relative w-full min-h-[900px] md:min-h-[600px] flex flex-col gap-4 transition-all duration-500">
      
      {/* Game Switcher */}
      <div className="absolute top-4 left-4 z-50 flex gap-1.5 p-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
        <button
          onClick={() => setActiveGame("tetris")}
          className={cn("flex items-center justify-center p-2 rounded-xl transition-all duration-300", activeGame === "tetris" ? "bg-blue-600 text-white shadow-lg" : "text-white/40 hover:bg-white/10")}
        >
          <Grid3X3 className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveGame("snake")}
          className={cn("flex items-center justify-center p-2 rounded-xl transition-all duration-300", activeGame === "snake" ? "bg-emerald-600 text-white shadow-lg" : "text-white/40 hover:bg-white/10")}
        >
          <Gamepad2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveGame("colorcrash")}
          className={cn("flex items-center justify-center p-2 rounded-xl transition-all duration-300", activeGame === "colorcrash" ? "bg-[#ff0055] text-white shadow-lg" : "text-white/40 hover:bg-white/10")}
        >
          <Zap className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 w-full animate-in fade-in zoom-in-95 duration-500">
        {activeGame === "tetris" && <TetrisCard {...props} />}
        {activeGame === "snake" && <SnakeCard {...props} />}
        {activeGame === "colorcrash" && <ColorCrashCard {...props} />}
      </div>
    </div>
  )
}