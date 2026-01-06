"use client"
import React, { useState, useEffect, useRef, useCallback } from "react"
import RevealOnView from "@/components/reveal-on-view"
import { ArrowLeft, ArrowRight, ArrowDown, ArrowUp, Play, RefreshCw, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"

const COLS = 20
const ROWS = 20
const SPEED = 150

type Point = { x: number; y: number }

export default function SnakeGameCard({ revealDelay = 0 }: { revealDelay?: number }) {
  // Game State
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Point>({ x: 5, y: 5 })
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 })
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [blockSize, setBlockSize] = useState(20)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const directionRef = useRef(direction)

  useEffect(() => { directionRef.current = direction }, [direction])

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point
    let isOnSnake
    do {
      newFood = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }
      isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)
    } while (isOnSnake)
    return newFood
  }, [])

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }])
    setFood(generateFood([{ x: 10, y: 10 }]))
    setDirection({ x: 0, y: -1 })
    directionRef.current = { x: 0, y: -1 }
    setScore(0); setGameOver(false); setIsPlaying(true)
  }

  const changeDirection = useCallback((x: number, y: number) => {
    if (directionRef.current.x + x === 0 && directionRef.current.y + y === 0) return
    setDirection({ x, y })
  }, [])

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return
    const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y }

    if (newHead.x < 0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS) { setGameOver(true); setIsPlaying(false); return }
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) { setGameOver(true); setIsPlaying(false); return }

    const newSnake = [newHead, ...snake]
    if (newHead.x === food.x && newHead.y === food.y) { setScore(s => s + 10); setFood(generateFood(newSnake)); } 
    else { newSnake.pop(); }
    setSnake(newSnake)
  }, [snake, direction, food, gameOver, isPlaying, generateFood])

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(moveSnake, SPEED)
    return () => clearInterval(interval)
  }, [moveSnake, isPlaying])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault()
      if (!isPlaying && !gameOver && e.key.startsWith("Arrow")) setIsPlaying(true);
      if (e.key === "ArrowUp") changeDirection(0, -1)
      if (e.key === "ArrowDown") changeDirection(0, 1)
      if (e.key === "ArrowLeft") changeDirection(-1, 0)
      if (e.key === "ArrowRight") changeDirection(1, 0)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [changeDirection, isPlaying, gameOver])

  useEffect(() => {
    if (!containerRef.current) return
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        const maxBlockH = Math.floor(height / ROWS) - 1
        const maxBlockW = Math.floor(width / COLS) - 1
        setBlockSize(Math.max(10, Math.min(maxBlockH, maxBlockW)))
      }
    })
    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  return (
    // FIX: Taller on Mobile, Fixed on Desktop
    <article className="group relative h-[calc(100svh+2rem)] md:h-[600px] w-full select-none">
      <RevealOnView
        delay={revealDelay}
        className="rounded-3xl border border-white/10 p-1 shadow-[0_10px_60px_-10px_rgba(0,0,0,0.6)] h-full flex flex-col"
        style={{ backgroundImage: `linear-gradient(135deg, #059669, #10b981)` }}
      >
        {/* FIX: flex-col-reverse (Controls Bottom on Mobile), md:flex-row (Controls Left on Desktop) */}
        <div className="flex-1 rounded-[1.35rem] bg-black overflow-hidden flex flex-col-reverse md:flex-row items-center justify-between p-0 gap-0 md:p-4 md:gap-8 h-full">
            
            {/* CONTROLS: Left on Desktop, Bottom on Mobile */}
            <div className="flex flex-col justify-center items-center w-full md:w-5/12 p-4 gap-6 z-10 shrink-0 bg-neutral-900/80 md:bg-transparent border-t md:border-t-0 border-white/10">
                <div className="text-center space-y-2 md:space-y-3">
                    <h2 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-lg">
                    Hungry? <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 animate-pulse-slow">
                        Play Snake!
                    </span>
                    </h2>
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-inner">
                        <Trophy className="w-4 h-4 text-yellow-400 mr-2" />
                        <span className="text-white font-mono text-lg font-bold">{score}</span>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2 p-4 md:p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm shadow-xl">
                    <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl bg-neutral-800/80 border-white/10 text-white active:scale-95 transition-transform" onClick={() => changeDirection(0, -1)}>
                        <ArrowUp className="w-6 h-6" />
                    </Button>
                    <div className="flex gap-4">
                        <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl bg-neutral-800/80 border-white/10 text-white active:scale-95 transition-transform" onClick={() => changeDirection(-1, 0)}>
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl bg-neutral-800/80 border-white/10 text-white active:scale-95 transition-transform" onClick={() => changeDirection(0, 1)}>
                            <ArrowDown className="w-6 h-6" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl bg-neutral-800/80 border-white/10 text-white active:scale-95 transition-transform" onClick={() => changeDirection(1, 0)}>
                            <ArrowRight className="w-6 h-6" />
                        </Button>
                    </div>
                </div>

                <Button variant="ghost" className="text-white/40 hover:text-white" onClick={resetGame}>
                    <RefreshCw className="w-4 h-4 mr-2" /> {gameOver ? "Try Again" : "Reset Game"}
                </Button>
            </div>

            {/* BOARD: Right on Desktop, Top on Mobile */}
            <div 
                ref={containerRef} 
                // FIX: Full height on mobile, bordered card on desktop
                className="flex-1 w-full h-full min-h-[50%] md:min-h-[400px] flex items-center justify-center bg-black/20 md:rounded-2xl md:border border-white/5"
            >
                <div style={{ width: COLS * blockSize, height: ROWS * blockSize, position: 'relative' }} className="bg-black border border-white/10 shadow-2xl">
                    <div style={{ position: 'absolute', left: food.x * blockSize, top: food.y * blockSize, width: blockSize, height: blockSize }} className="bg-red-500 rounded-full shadow-[0_0_10px_#ef4444] animate-pulse" />
                    {snake.map((segment, i) => (
                        <div key={i} style={{ position: 'absolute', left: segment.x * blockSize, top: segment.y * blockSize, width: blockSize, height: blockSize }} className={`${i === 0 ? 'bg-emerald-400 z-10' : 'bg-emerald-600'} border border-black rounded-sm transition-all duration-75`} />
                    ))}
                    {(!isPlaying && !gameOver) && (
                         <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
                            <Button onClick={resetGame} size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xl py-6 px-8 rounded-2xl shadow-lg border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1">
                                <Play className="mr-2 fill-current" /> Start Game
                            </Button>
                         </div>
                    )}
                    {gameOver && (
                         <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/80 backdrop-blur-md z-20">
                            <h3 className="text-4xl font-black text-white mb-2">GAME OVER</h3>
                            <p className="text-white/80 mb-6 font-mono">Final Score: {score}</p>
                            <Button onClick={resetGame} variant="secondary">Try Again</Button>
                         </div>
                    )}
                </div>
            </div>
        </div>
      </RevealOnView>
    </article>
  )
}