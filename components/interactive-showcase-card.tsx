"use client"
import React, { useState, useEffect, useRef, useCallback } from "react"
import RevealOnView from "@/components/reveal-on-view"
import { ArrowLeft, ArrowRight, ArrowDown, RotateCw, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

// --- Constants & Types ---
const COLS = 10
const ROWS = 20
// Brighter colors to pop against the black bg
const COLORS = ["#ef4444", "#f97316", "#facc15", "#22d3ee", "#4ade80", "#818cf8", "#e879f9"]
const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 0, 0], [1, 1, 1]], // J
  [[0, 0, 1], [1, 1, 1]], // L
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]], // Z
]

type Piece = {
  shape: number[][],
  color: string,
  x: number,
  y: number,
}

type Board = (string | null)[][]

// --- Helper Functions ---
function randomPiece(): Piece {
  const type = Math.floor(Math.random() * SHAPES.length)
  return {
    shape: SHAPES[type],
    color: COLORS[type],
    x: Math.floor(COLS / 2) - 1,
    y: 0,
  }
}

function isValid(pos: Piece, shape: number[][], board: Board): boolean {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const newY = pos.y + y
        const newX = pos.x + x
        if (
          newY >= ROWS ||
          newX < 0 ||
          newX >= COLS ||
          (newY >= 0 && board[newY][newX])
        ) {
          return false
        }
      }
    }
  }
  return true
}

// --- Main Component ---
export default function InteractiveShowcaseCard({ revealDelay = 0 }: { revealDelay?: number }) {
  // Game State
  const [board, setBoard] = useState<Board>(Array.from({ length: ROWS }, () => Array(COLS).fill(null)))
  const [piece, setPiece] = useState<Piece | null>(null)
  const [score, setScore] = useState<number>(0)
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  
  // UI State
  const [blockSize, setBlockSize] = useState(20)
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize Game
  useEffect(() => {
    setPiece(randomPiece())
    setIsPlaying(true)
  }, [])

  // --- Game Logic ---
  const resetGame = useCallback(() => {
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(null)))
    setPiece(randomPiece())
    setScore(0)
    setGameOver(false)
    setIsPlaying(true)
  }, [])

  const clearLines = useCallback((b: Board) => {
    let cleared = 0
    const newBoard = b.filter((row) => {
      if (row.every((cell) => cell)) {
        cleared++
        return false
      }
      return true
    })
    while (newBoard.length < ROWS) newBoard.unshift(Array(COLS).fill(null))
    if (cleared > 0) setScore((prev) => prev + cleared * 100)
    return newBoard
  }, [])

  const drop = useCallback(() => {
    if (gameOver || !piece || !isPlaying) return

    const newPos = { ...piece, y: piece.y + 1 }
    if (isValid(newPos, piece.shape, board)) {
      setPiece(newPos)
    } else {
      const newBoard = board.map((row) => [...row])
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
             const newY = piece.y + y
             const newX = piece.x + x
             if (newY >= 0 && newY < ROWS && newX >= 0 && newX < COLS) {
               newBoard[newY][newX] = piece.color
             }
          }
        }
      }
      const clearedBoard = clearLines(newBoard)
      setBoard(clearedBoard)
      const next = randomPiece()
      if (!isValid(next, next.shape, clearedBoard)) {
        setGameOver(true)
        setIsPlaying(false)
      } else {
        setPiece(next)
      }
    }
  }, [board, piece, gameOver, isPlaying, clearLines])

  const move = useCallback((dx: number) => {
    if (gameOver || !piece || !isPlaying) return
    const newPos = { ...piece, x: piece.x + dx }
    if (isValid(newPos, piece.shape, board)) setPiece(newPos)
  }, [board, piece, gameOver, isPlaying])

  const rotate = useCallback(() => {
    if (gameOver || !piece || !isPlaying) return
    const newShape = piece.shape[0].map((_, i) => piece.shape.map((row) => row[i])).reverse()
    if (isValid(piece, newShape, board)) setPiece({ ...piece, shape: newShape })
  }, [board, piece, gameOver, isPlaying])

  // --- Scale Logic (Perfect Fit) ---
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

  // Keyboard Controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameOver || !isPlaying) return
      if (["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault()
      }
      if (e.key === "ArrowLeft") move(-1)
      if (e.key === "ArrowRight") move(1)
      if (e.key === "ArrowDown") drop()
      if (e.key === "ArrowUp") rotate()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [move, rotate, drop, gameOver, isPlaying])

  // Game Loop
  useEffect(() => {
    if (gameOver || !isPlaying) return
    const interval = setInterval(drop, 600)
    return () => clearInterval(interval)
  }, [drop, gameOver, isPlaying])

  // --- Render Grid ---
  const renderGrid = () => {
    const display = board.map((row) => [...row])
    if (piece) {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const newY = piece.y + y
                    const newX = piece.x + x
                    if (newY >= 0 && newY < ROWS && newX >= 0 && newX < COLS) {
                        display[newY][newX] = piece.color
                    }
                }
            }
        }
    }

    return (
        <div 
            // CHANGE: Reverted background to solid black for contrast
            className="bg-black border border-white/20 relative shadow-2xl transition-all duration-75"
            style={{ 
                width: COLS * blockSize, 
                height: ROWS * blockSize,
            }}
        >
            {display.map((row, y) =>
                row.map((cell, x) => (
                    <div
                        key={`${x}-${y}`}
                        style={{
                            position: "absolute",
                            left: x * blockSize,
                            top: y * blockSize,
                            width: blockSize,
                            height: blockSize,
                            backgroundColor: cell || "rgba(255,255,255,0.03)",
                            // CHANGE: Added strong dark outline if cell has color, subtle if empty
                            border: cell ? "2px solid #171717" : "1px solid rgba(255,255,255,0.05)",
                            // CHANGE: Increased border radius slightly for distinct blocks
                            borderRadius: cell ? "4px" : "0px",
                            boxShadow: cell ? "inset 0 0 4px rgba(0,0,0,0.25)" : "none",
                            boxSizing: "border-box", // Ensure border doesn't add size
                        }}
                    />
                ))
            )}
             {gameOver && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 backdrop-blur-sm p-4 text-center">
                    <span className="text-2xl font-bold text-white mb-2">Game Over</span>
                    <span className="text-lg text-white/70 mb-4">Score: {score}</span>
                    <Button onClick={resetGame} variant="outline" size="sm" className="text-black bg-white hover:bg-white/90">Play Again</Button>
                </div>
            )}
        </div>
    )
  }

  return (
    <article className="group relative lg:h-[calc(100svh-2rem)]">
      <RevealOnView
        delay={revealDelay}
        className="rounded-3xl border border-white/10 p-1 shadow-[0_10px_60px_-10px_rgba(0,0,0,0.6)] lg:h-full flex flex-col"
        style={{
          backgroundImage: `linear-gradient(135deg, #7c2d12, #dc2626)`,
        }}
      >
        {/* CHANGE: Reverted inner container background to solid bg-black */}
        <div className="flex-1 rounded-[1.35rem] bg-black overflow-hidden flex flex-col md:flex-row items-center justify-between p-4 gap-8">
            
            {/* LEFT COLUMN: Controls */}
            <div className="flex flex-col justify-center items-center w-full md:w-5/12 space-y-8 z-10 shrink-0">
                
                {/* Title Section */}
                <div className="text-center space-y-3">
                    <h2 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-lg">
                    Bored? <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-pulse-slow">
                        Play Tetris!
                    </span>
                    </h2>
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-inner">
                    <span className="text-white/60 font-mono text-sm tracking-wider uppercase mr-2">Score</span>
                    <span className="text-white font-mono text-lg font-bold">{score}</span>
                    </div>
                </div>

                {/* Controls Cluster */}
                <div className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm shadow-xl">
                    
                    {/* Rotate */}
                    <Button
                    variant="secondary"
                    size="icon"
                    className="h-14 w-14 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] border-none transition-all duration-200 active:scale-90"
                    onClick={rotate}
                    aria-label="Rotate"
                    >
                    <RotateCw className="w-6 h-6" />
                    </Button>

                    {/* D-Pad */}
                    <div className="flex gap-4 items-end">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-2xl bg-neutral-800/80 border-white/10 hover:bg-neutral-700 hover:border-white/30 text-white transition-all active:scale-95"
                        onClick={() => move(-1)}
                        aria-label="Move Left"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-2xl bg-neutral-800/80 border-white/10 hover:bg-neutral-700 hover:border-white/30 text-white transition-all active:scale-95"
                        onClick={drop}
                        aria-label="Soft Drop"
                    >
                        <ArrowDown className="w-5 h-5" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-2xl bg-neutral-800/80 border-white/10 hover:bg-neutral-700 hover:border-white/30 text-white transition-all active:scale-95"
                        onClick={() => move(1)}
                        aria-label="Move Right"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </Button>
                    </div>
                </div>

                {/* Reset Action */}
                <Button
                    variant="ghost"
                    className="group text-white/40 hover:text-white hover:bg-white/5 transition-all"
                    onClick={resetGame}
                >
                    <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                    New Game
                </Button>
            </div>

            {/* RIGHT COLUMN: Game Grid */}
            <div 
                ref={containerRef}
                // CHANGE: Removed bg-black/20 to let main bg show through
                className="flex-1 w-full h-full min-h-[400px] flex items-center justify-center rounded-2xl border border-white/5"
            >
                {renderGrid()}
            </div>
        </div>
      </RevealOnView>
    </article>
  )
}