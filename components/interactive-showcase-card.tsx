"use client"
import React, { useState, useEffect, useRef } from "react"
import RevealOnView from "@/components/reveal-on-view"

const COLS = 10
const ROWS = 20
const COLORS = ["#dc2626", "#7c2d12", "#fbbf24", "#22d3ee", "#a3e635", "#818cf8", "#f472b6"]
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

function mergePiece(b: Board, p: Piece): Board {
	const newBoard = b.map((row) => [...row])
	for (let y = 0; y < p.shape.length; y++) {
		for (let x = 0; x < p.shape[y].length; x++) {
			if (p.shape[y][x]) {
				const newY = p.y + y
				const newX = p.x + x
				if (newY >= 0 && newY < ROWS && newX >= 0 && newX < COLS) {
					newBoard[newY][newX] = p.color
				}
			}
		}
	}
	return newBoard
}

function clearLines(b: Board, setScore: React.Dispatch<React.SetStateAction<number>>): Board {
	let cleared = 0
	const newBoard = b.filter((row) => {
		if (row.every((cell) => cell)) {
			cleared++
			return false
		}
		return true
	})
	while (newBoard.length < ROWS) newBoard.unshift(Array(COLS).fill(null))
	if (cleared) setScore((s) => s + cleared * 100)
	return newBoard
}

function TetrisGame({ blockOutline = "#000", size }: { blockOutline?: string, size?: number }) {
	const [board, setBoard] = useState<Board>(Array.from({ length: ROWS }, () => Array(COLS).fill(null)))
	const [piece, setPiece] = useState<Piece>(randomPiece())
	const [score, setScore] = useState<number>(0)
	const [gameOver, setGameOver] = useState<boolean>(false)
	const intervalRef = useRef<number | null>(null)

	function resetGame() {
		setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(null)))
		setPiece(randomPiece())
		setScore(0)
		setGameOver(false)
	}

	function drop() {
		if (gameOver) return
		const newPos = { ...piece, y: piece.y + 1 }
		if (isValid(newPos, piece.shape, board)) {
			setPiece(newPos)
		} else {
			const merged = mergePiece(board, piece)
			const cleared = clearLines(merged, setScore)
			setBoard(cleared)
			const next = randomPiece()
			if (!isValid(next, next.shape, cleared)) {
				setGameOver(true)
				if (intervalRef.current !== null) clearInterval(intervalRef.current)
			} else {
				setPiece(next)
			}
		}
	}

	// Controls
	function move(dx: number) {
		const newPos = { ...piece, x: piece.x + dx }
		if (isValid(newPos, piece.shape, board)) setPiece(newPos)
	}
	function rotate() {
		const newShape = piece.shape[0].map((_, i) => piece.shape.map((row) => row[i])).reverse()
		if (isValid(piece, newShape, board)) setPiece({ ...piece, shape: newShape })
	}

	useEffect(() => {
		function handleKey(e: KeyboardEvent) {
			if (gameOver) return
			if (e.key === "ArrowLeft") move(-1)
			if (e.key === "ArrowRight") move(1)
			if (e.key === "ArrowDown") drop()
			if (e.key === "ArrowUp") rotate()
		}
		window.addEventListener("keydown", handleKey)
		return () => window.removeEventListener("keydown", handleKey)
	})

	useEffect(() => {
		if (gameOver) return
		intervalRef.current = window.setInterval(drop, 500)
		return () => {
			if (intervalRef.current !== null) clearInterval(intervalRef.current)
		}
	})

	// Draw board + piece
	const display = board.map((row) => [...row])
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

		// Responsive size for mobile and desktop
		const isMobile = typeof window !== "undefined" && window.innerWidth <= 480;
		const boardWidth = isMobile ? 340 : 560;
		const boardHeight = isMobile ? 480 : 900;
		const blockSize = Math.floor(Math.min(boardWidth / COLS, boardHeight / ROWS));

	return (
			<div className="flex flex-col items-center justify-center h-full">
				<div
					className="bg-neutral-800 border border-white/20 rounded-lg"
					style={{ width: COLS * blockSize, height: ROWS * blockSize, position: "relative", maxWidth: boardWidth, maxHeight: boardHeight }}
				>
				{display.map((row, y) =>
					row.map((cell, x) => (
						<div
							key={x + "," + y}
							style={{
								position: "absolute",
								left: x * blockSize,
								top: y * blockSize,
								width: blockSize,
								height: blockSize,
								background: cell || "#222",
								border: cell ? `2px solid ${blockOutline}` : "1px solid #111",
								boxSizing: "border-box",
								borderRadius: cell ? 4 : 0,
								transition: "background 0.2s"
							}}
						/>
					))
				)}
			</div>
			<div className="mt-2 text-white/70 text-sm">Score: {score}</div>
			{gameOver && <div className="mt-2 text-red-500 font-bold">Game Over</div>}
			<div className="mt-2 text-white/60 text-xs">Use arrow keys or buttons below to play</div>
		</div>
	)
}

export default function InteractiveShowcaseCard({ revealDelay = 0 }: { revealDelay?: number }) {
	return (
		<article className="group relative lg:h-[calc(100svh-2rem)]">
			<RevealOnView
				delay={revealDelay}
				className="rounded-3xl border border-white/10 p-1 shadow-[0_10px_60px_-10px_rgba(0,0,0,0.6)] lg:h-full"
				style={{
					backgroundImage: `linear-gradient(135deg, #7c2d12, #dc2626)`,
				}}
			>
				<div className="relative overflow-hidden rounded-[1.35rem] bg-black lg:h-full p-0 flex flex-col md:flex-row justify-between items-stretch min-h-[60vh]">
					{/* Left: Controls & Title */}
					<div className="flex flex-col justify-center items-center w-full max-w-xl p-2 md:p-8 md:gap-10">
						<h2 className="text-2xl md:text-6xl font-extrabold mb-2 md:mb-8 text-white text-center leading-tight animate-accordion-down">Bored of scrolling?<br/>Play Tetris!</h2>
						<div className="flex flex-col gap-4 md:gap-8 items-center">
							<div className="flex gap-2 md:gap-4 flex-wrap justify-center">
								<button
									className="px-4 py-3 rounded-xl bg-gray-700 text-white border-none text-xl font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-yellow-400"
									onClick={() => document.getElementById('tetris-left')?.click()}
								>◀️</button>
								<button
									className="px-4 py-3 rounded-xl bg-gray-700 text-white border-none text-xl font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
									onClick={() => document.getElementById('tetris-rotate')?.click()}
								>🔄</button>
								<button
									className="px-4 py-3 rounded-xl bg-gray-700 text-white border-none text-xl font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
									onClick={() => document.getElementById('tetris-right')?.click()}
								>▶️</button>
								<button
									className="px-4 py-3 rounded-xl bg-gray-700 text-white border-none text-xl font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
									onClick={() => document.getElementById('tetris-down')?.click()}
								>⬇️</button>
							</div>
							<button
								className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-400 text-white border-none text-base md:text-2xl font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 mt-2 md:mt-6 focus:outline-none focus:ring-2 focus:ring-pink-400"
								onClick={() => document.getElementById('tetris-refresh')?.click()}
							>
								Refresh
							</button>
						</div>
					</div>
					{/* Right: Game - bigger and covers the card */}
					<div className="flex flex-col justify-center items-center flex-1 p-2 md:p-0 h-full animate-fade-in">
						<TetrisGame blockOutline="#000" size={Math.max(20, Math.min(32, Math.floor(window.innerWidth / (COLS + 2))))} />
						{/* Hidden buttons for controls, triggered by left panel */}
						<div style={{ display: 'none' }}>
							<button id="tetris-left" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))} />
							<button id="tetris-right" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))} />
							<button id="tetris-down" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))} />
							<button id="tetris-rotate" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))} />
							<button id="tetris-refresh" onClick={() => window.location.reload()} />
						</div>
					</div>
				</div>
			</RevealOnView>
		</article>
	)
}
