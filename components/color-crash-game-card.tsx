"use client"
import React, { useState, useEffect, useRef, useCallback } from "react"
import RevealOnView from "@/components/reveal-on-view"
import { Play, RotateCcw, Trophy, Ghost, Magnet, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

const COLORS = ["#ff0055", "#00ddff", "#ffcc00", "#cc00ff"]

const CONFIG = {
  gravity: 0.55,
  jumpStrength: -9.5,
  baseSpeed: 4.8,
  spawnRate: 160
}

const POWER = { NONE: 0, GHOST: 1, MAGNET: 2, SLOW: 3 }

// --- Haptics & Audio ---
const Haptics = {
    trigger: (pattern: number | number[]) => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern); },
    stop: () => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(0); }
}

class SoundSynth {
  ctx: AudioContext | null = null;
  masterGain: GainNode | null = null;
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }
  playTone(freq: number, type: OscillatorType, duration: number, slide = 0) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    if (slide !== 0) osc.frequency.linearRampToValueAtTime(freq + slide, this.ctx.currentTime + duration);
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    osc.connect(gain); gain.connect(this.masterGain); osc.start(); osc.stop(this.ctx.currentTime + duration);
  }
  jump() { this.playTone(300, 'square', 0.1, 150); }
  score() { this.playTone(800, 'sine', 0.1, 200); this.playTone(1200, 'sine', 0.1, 0); }
  die() { this.playTone(150, 'sawtooth', 0.4, -100); }
  powerup() { this.playTone(400, 'sine', 0.3, 600); }
}

export default function ColorCrashGameCard({ revealDelay = 0 }: { revealDelay?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>(0)
  const audioRef = useRef(new SoundSynth())
  
  const lastTimeRef = useRef<number>(0)
  
  const stateRef = useRef({
    lastTime: 0,
    bird: { x: 80, y: 300, dy: 0, r: 12, color: COLORS[0], trail: [] as any[] },
    obstacles: [] as any[],
    items: [] as any[], 
    particles: [] as any[],
    activePowerups: { ghost: 0, magnet: 0, slow: 0 },
    spawnTimer: CONFIG.spawnRate,
    score: 0,
    width: 0,
    height: 0,
    shake: 0,
    speedMult: 1.0,
    lastGenColor: COLORS[0],
    isPlaying: false,
    isGameOver: false,
    stars: [] as any[]
  })

  const [uiState, setUiState] = useState<'ready' | 'playing' | 'gameover'>('ready')
  const [displayScore, setDisplayScore] = useState(0) 
  const [activeIcons, setActiveIcons] = useState({ ghost: false, magnet: false, slow: false })

  const spawnEverything = () => {
    const s = stateRef.current;
    const { width, height, score } = s;
    const x = width + 200;
    const wallX = x + 200; 
    let moveY = 0;
    if (score >= 15) moveY = 1.2;
    if (score >= 25) moveY = 2.2;
    if (score > 50 && Math.random() > 0.8) moveY = -2.2;

    const wallColors = [];
    for(let i=0; i<4; i++) wallColors.push(COLORS[Math.floor(Math.random() * COLORS.length)]);
    const safeAndDifferent = wallColors.filter(c => c !== s.lastGenColor);
    const safeColors = safeAndDifferent.length > 0 ? safeAndDifferent : wallColors;
    const targetColor = safeColors[Math.floor(Math.random() * safeColors.length)];

    s.obstacles.push({ x: wallX, w: 30, colors: wallColors, yOffset: 0, moveY });

    if (score < 30) {
        s.items.push({ x: x, y: height/2 + (Math.random()*200-100), r: 18, type: 'orb', color: targetColor });
        s.lastGenColor = targetColor;
    } else { s.lastGenColor = targetColor; }

    if ((Math.random() < 0.2 || (score > 0 && score % 15 === 0)) && score > 2) {
        const types = [POWER.GHOST, POWER.MAGNET, POWER.SLOW];
        const pType = types[Math.floor(Math.random()*types.length)];
        s.items.push({ x: x + 100, y: height/2 + (Math.random()*150-75), r: 20, type: 'power', pType });
    }
  }

  const spawnParticles = (x: number, y: number, count: number, color: string, type = 'circle') => {
      if (stateRef.current.particles.length > 60) return;
      for(let i=0; i<count; i++) {
          let speed = type === 'square' ? 20 : 15;
          stateRef.current.particles.push({
              x, y, color, type,
              dx: (Math.random()-0.5)*speed, dy: (Math.random()-0.5)*speed,
              size: Math.random()*5+2, alpha: 1, decay: 0.04,
              angle: Math.random() * Math.PI, spin: (Math.random()-0.5) * 0.5
          });
      }
  }

  const activatePowerup = (type: number) => {
      const s = stateRef.current;
      if(type === POWER.GHOST) s.activePowerups.ghost = 600;
      if(type === POWER.MAGNET) s.activePowerups.magnet = 600;
      if(type === POWER.SLOW) s.activePowerups.slow = 600;
  }

  const update = (dt: number, time: number) => {
    const s = stateRef.current;

    // --- FIX: VISUAL SHAKE DECAY ---
    // Moved this block to the top so it runs even if game is over/paused.
    // This ensures the screen settles down after a death.
    if (s.shake > 0) {
        s.shake -= dt;
        if (s.shake < 0) s.shake = 0;
    }

    if (!s.isPlaying || s.isGameOver) return;

    let effectsChanged = false;
    const updateP = (key: 'ghost' | 'magnet' | 'slow') => {
        if (s.activePowerups[key] > 0) {
            s.activePowerups[key] -= (dt * 1.5);
            if (!activeIcons[key]) effectsChanged = true;
        } else if (activeIcons[key]) effectsChanged = true;
    };
    updateP('ghost'); updateP('magnet'); updateP('slow');
    if (effectsChanged) setActiveIcons({ ghost: s.activePowerups.ghost > 0, magnet: s.activePowerups.magnet > 0, slow: s.activePowerups.slow > 0 });

    s.speedMult = s.activePowerups.slow > 0 ? 0.6 : 1.0;
    s.stars.forEach(star => { star.x -= star.speed * (s.speedMult * 5) * dt; if(star.x < 0) { star.x = s.width; star.y = Math.random() * s.height; } });

    if (s.bird) {
        s.bird.dy += (CONFIG.gravity * s.speedMult) * dt;
        s.bird.y += s.bird.dy * dt;
        s.bird.trail.push({x: s.bird.x, y: s.bird.y});
        if(s.bird.trail.length > 10) s.bird.trail.shift();
        if(s.bird.y > s.height + 50 || s.bird.y < -50) die("Void");
    }

    const speed = CONFIG.baseSpeed * s.speedMult;
    const sectionH = s.height / 4;

    s.obstacles.forEach(o => {
        o.x -= speed * dt;
        if(o.moveY) {
            o.yOffset += o.moveY * s.speedMult * dt * 1.5;
            if(o.yOffset >= sectionH) { o.yOffset -= sectionH; o.colors.unshift(o.colors.pop()); } 
            else if(o.yOffset <= -sectionH) { o.yOffset += sectionH; o.colors.push(o.colors.shift()); }
        }
        if (!o.passed && o.x + o.w < s.bird.x - s.bird.r) {
            o.passed = true; s.score++; setDisplayScore(s.score); audioRef.current.score();
            if (s.score >= 30) {
                const nextWall = s.obstacles.find(w => w.x > s.bird.x);
                let newColor = nextWall ? nextWall.colors[Math.floor(Math.random() * nextWall.colors.length)] : COLORS[Math.floor(Math.random() * COLORS.length)];
                s.bird.color = newColor; s.lastGenColor = newColor;
                spawnParticles(s.bird.x, s.bird.y, 15, newColor, 'circle'); audioRef.current.powerup();
            }
        }
        if (s.bird.x + s.bird.r > o.x && s.bird.x - s.bird.r < o.x + o.w) {
            if (s.activePowerups.ghost > 0) return;
            let relY = s.bird.y - o.yOffset;
            let idx = Math.floor(relY / sectionH);
            if (idx < 0) idx = 3; if (idx > 3) idx = 0;
            if (idx >= 0 && idx <= 3 && o.colors[idx] !== s.bird.color) die("Mismatch");
        }
    });

    s.items.forEach((i, index) => {
        let processed = false;
        if (s.activePowerups.magnet > 0 && i.type === 'orb') {
            let nearestWall = s.obstacles.find(o => o.x + o.w > s.bird.x - 10);
            if (!(nearestWall && (nearestWall.x - s.bird.x < 280))) {
                let dx = s.bird.x - i.x; let dy = s.bird.y - i.y;
                let dist = Math.hypot(dx, dy);
                if (dist < 350) { i.x += (dx/dist)*18*dt; i.y += (dy/dist)*18*dt; processed = true; }
            }
        }
        if (!processed) i.x -= speed * dt;
        let dist = Math.hypot(s.bird.x - i.x, s.bird.y - i.y);
        if (dist < s.bird.r + i.r) {
            if (i.type === 'orb') { s.bird.color = i.color; spawnParticles(i.x, i.y, 8, i.color, 'circle'); audioRef.current.score(); } 
            else if (i.type === 'power') { activatePowerup(i.pType); spawnParticles(i.x, i.y, 10, "#fff", 'circle'); audioRef.current.powerup(); }
            s.items.splice(index, 1);
        }
    });

    for (let i = s.particles.length - 1; i >= 0; i--) {
        let p = s.particles[i];
        p.x += p.dx * dt; p.y += p.dy * dt; p.alpha -= p.decay * dt;
        if(p.type === 'square') p.angle += p.spin * dt;
        if(p.alpha <= 0) s.particles.splice(i, 1);
    }

    s.spawnTimer += dt;
    let scoreMod = Math.min(100, s.score);
    let adjustedRate = (CONFIG.spawnRate - (scoreMod * 0.5)) / s.speedMult;
    if(s.spawnTimer > adjustedRate) { s.spawnTimer = 0; spawnEverything(); }
    s.obstacles = s.obstacles.filter(o => o.x > -100);
    s.items = s.items.filter(i => i.x > -100);
  }

  const die = (reason: string) => {
      const s = stateRef.current;
      if (s.activePowerups.ghost > 0 || s.isGameOver) return;
      s.isGameOver = true; audioRef.current.die(); s.shake = 20;
      spawnParticles(s.bird.x, s.bird.y, 20, s.bird.color, 'square');
      setUiState('gameover');
  }

  const draw = () => {
      const cvs = canvasRef.current; if(!cvs) return;
      const ctx = cvs.getContext('2d'); if(!ctx) return;
      const s = stateRef.current;
      ctx.save();
      if(s.shake > 0) { ctx.translate((Math.random()-0.5)*s.shake, (Math.random()-0.5)*s.shake); }
      ctx.fillStyle = "#050505"; ctx.fillRect(0, 0, s.width, s.height);
      ctx.fillStyle = "white"; s.stars.forEach(st => { ctx.globalAlpha = (Math.random()*0.3+0.7); ctx.beginPath(); ctx.arc(st.x, st.y, st.size, 0, Math.PI*2); ctx.fill(); }); ctx.globalAlpha = 1;
      const sectionH = s.height / 4;
      s.obstacles.forEach(ob => {
          ctx.fillStyle = ob.colors[3]; ctx.fillRect(ob.x, -sectionH + ob.yOffset, ob.w, sectionH+1);
          for(let i=0; i<4; i++) { ctx.fillStyle = ob.colors[i]; ctx.fillRect(ob.x, (i*sectionH)+ob.yOffset, ob.w, sectionH+1); }
          ctx.fillStyle = ob.colors[0]; ctx.fillRect(ob.x, (4*sectionH)+ob.yOffset, ob.w, sectionH+1);
      });
      s.items.forEach(i => {
          if (i.type === 'orb') {
              ctx.globalAlpha = 0.3; ctx.fillStyle = i.color; ctx.beginPath(); ctx.arc(i.x, i.y, i.r*1.5, 0, Math.PI*2); ctx.fill();
              ctx.globalAlpha = 1.0; ctx.beginPath(); ctx.arc(i.x, i.y, i.r, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = "white"; ctx.lineWidth = 2; ctx.stroke();
          } else {
              ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(i.x, i.y, i.r, 0, Math.PI*2); ctx.fill();
              ctx.font = "20px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
              ctx.fillText(i.pType===POWER.GHOST?"👻":(i.pType===POWER.MAGNET?"🧲":"🐌"), i.x, i.y+2);
          }
      });
      s.particles.forEach(p => {
          ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color; ctx.save(); ctx.translate(p.x, p.y);
          if (p.type === 'square') { ctx.rotate(p.angle); ctx.fillRect(-p.size, -p.size, p.size*2, p.size*2); } 
          else { ctx.beginPath(); ctx.arc(0, 0, p.size, 0, Math.PI*2); ctx.fill(); }
          ctx.restore();
      });
      ctx.globalAlpha = 1;
      if (!s.isGameOver && s.bird.visible !== false) {
          ctx.save(); ctx.translate(s.bird.x, s.bird.y);
          ctx.rotate(Math.min(Math.PI/3, Math.max(-0.5, (s.bird.dy*0.1))));
          ctx.globalAlpha = s.activePowerups.ghost > 0 ? 0.4 : 1.0;
          ctx.fillStyle = s.bird.color; ctx.beginPath(); ctx.arc(0, 0, s.bird.r, 0, Math.PI*2); ctx.fill();
          ctx.strokeStyle = "white"; ctx.lineWidth = 3; ctx.stroke();
          ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc(6, -6, 5, 0, Math.PI*2); ctx.fill();
          ctx.restore();
          s.bird.trail.forEach((pos, i) => { ctx.globalAlpha = (i/s.bird.trail.length)*0.5; ctx.fillStyle = s.bird.color; ctx.beginPath(); ctx.arc(pos.x, pos.y, s.bird.r*0.8, 0, Math.PI*2); ctx.fill(); });
      }
      ctx.restore();
  }

  const loop = (timestamp: number) => {
      const s = stateRef.current;
      if (!s.lastTime) s.lastTime = timestamp;
      let dt = (timestamp - s.lastTime) / (1000/60);
      s.lastTime = timestamp;
      if (dt > 2.5) dt = 2.5;
      update(dt, timestamp);
      draw();
      requestRef.current = requestAnimationFrame(loop);
  }

  const jump = useCallback(() => {
      const s = stateRef.current;
      if (uiState === 'ready') { setUiState('playing'); s.isPlaying = true; audioRef.current.init(); }
      if (s.isPlaying && !s.isGameOver) {
          let jumpMod = s.activePowerups.slow > 0 ? 0.8 : 1.0;
          s.bird.dy = CONFIG.jumpStrength * jumpMod;
          audioRef.current.jump();
          spawnParticles(s.bird.x, s.bird.y + 10, 5, "#fff", 'circle');
      }
  }, [uiState]);

  const resetGame = () => {
      Haptics.stop();
      const s = stateRef.current;
      s.bird.y = s.height / 2; s.bird.dy = 0; s.bird.color = COLORS[0];
      s.obstacles = []; s.items = []; s.particles = [];
      s.activePowerups = { ghost: 0, magnet: 0, slow: 0 };
      s.score = 0; s.speedMult = 1.0;
      s.isGameOver = false; s.isPlaying = false;
      s.shake = 0; // Fix: Ensure shake is cleared
      setDisplayScore(0); setActiveIcons({ ghost: false, magnet: false, slow: false });
      setUiState('ready');
  }

  useEffect(() => {
      if (!containerRef.current || !canvasRef.current) return;
      const resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
              const { width, height } = entry.contentRect;
              canvasRef.current!.width = width; canvasRef.current!.height = height;
              stateRef.current.width = width; stateRef.current.height = height;
              if(!stateRef.current.isPlaying) stateRef.current.bird.y = height/2;
              if(stateRef.current.stars.length === 0) { for(let i=0; i<50; i++) stateRef.current.stars.push({ x: Math.random()*width, y: Math.random()*height, size: Math.random()*2 + 0.5, speed: Math.random()*0.5+0.1 }); }
          }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => { if (e.code === 'Space') { e.preventDefault(); jump(); } };
      window.addEventListener('keydown', handleKeyDown);
      requestRef.current = requestAnimationFrame(loop);
      return () => {
          window.removeEventListener('keydown', handleKeyDown);
          if (requestRef.current) cancelAnimationFrame(requestRef.current);
      }
  }, [jump]);

  return (
    <article className="group relative h-[calc(100svh-2rem)] md:h-[900px] w-full select-none">
      <RevealOnView
        delay={revealDelay}
        className="rounded-3xl border border-white/10 p-1 shadow-[0_10px_60px_-10px_rgba(0,0,0,0.6)] h-full flex flex-col"
        style={{ backgroundImage: `linear-gradient(135deg, #111, #000)` }}
      >
        <div className="flex-1 rounded-[1.35rem] bg-black overflow-hidden flex flex-col-reverse md:flex-row items-center justify-between p-0 gap-0 md:p-4 md:gap-8 h-full">
            
            <div className="flex flex-col justify-center items-center w-full md:w-5/25 p-4 gap-6 z-10 bg-neutral-900/80 md:bg-transparent border-t md:border-t-0 border-white/10">
                <div className="hidden md:flex flex-col items-center">
                    <h2 className="text-3xl font-black text-white italic tracking-tighter">
                        COLOR <span className="text-[#ff0055]">CRASH</span>
                    </h2>
                    <div className="mt-2 inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                        <Trophy className="w-4 h-4 text-yellow-400 mr-2" />
                        <span className="text-white font-mono text-xl font-bold">{displayScore}</span>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        <span className="text-[10px] text-white/50 tracking-[0.2em]">MATCH</span>
                        <div className="w-4 h-4 rounded-full transition-colors duration-300" style={{ backgroundColor: stateRef.current.bird.color, boxShadow: `0 0 10px ${stateRef.current.bird.color}` }}></div>
                    </div>
                    <p className="text-xs text-white/30 font-mono">Tap area above to jump</p>
                </div>
            </div>

            <div 
                ref={containerRef}
                className="flex-1 relative w-full h-full min-h-[50%] md:min-h-[400px] cursor-pointer md:rounded-2xl md:border border-white/5"
                onPointerDown={(e) => { e.preventDefault(); jump(); }}
            >
                <canvas ref={canvasRef} className="block w-full h-full" />
                
                <div className="md:hidden absolute top-20 right-6 font-black text-6xl text-white/10 select-none pointer-events-none">
                    {displayScore}
                </div>

                <div className="absolute top-20 left-6 flex flex-col gap-2 pointer-events-none">
                    {activeIcons.ghost && <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-2 py-1 rounded-full border border-white/20"><Ghost className="w-4 h-4 text-purple-400" /><span className="text-[10px] text-white font-bold">GHOST</span></div>}
                    {activeIcons.magnet && <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-2 py-1 rounded-full border border-white/20"><Magnet className="w-4 h-4 text-red-400" /><span className="text-[10px] text-white font-bold">MAGNET</span></div>}
                    {activeIcons.slow && <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-2 py-1 rounded-full border border-white/20"><Clock className="w-4 h-4 text-blue-400" /><span className="text-[10px] text-white font-bold">SLOW</span></div>}
                </div>

                {uiState === 'ready' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <div className="flex items-center justify-center gap-2 text-white/80 text-sm font-mono border border-white/20 rounded-full px-6 py-2 bg-black/60 backdrop-blur-md animate-pulse">
                            <Play className="w-4 h-4 fill-current" /> TAP TO JUMP
                        </div>
                    </div>
                )}

                {uiState === 'gameover' && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-auto z-20">
                         <h3 className="text-5xl font-black text-white mb-4 italic tracking-tighter">GAME OVER</h3>
                         <div className="flex items-center gap-3 text-yellow-400 mb-8 scale-125">
                            <Trophy className="w-6 h-6" />
                            <span className="font-mono text-2xl font-bold">{displayScore}</span>
                         </div>
                         <Button 
                            onClick={(e) => { e.stopPropagation(); resetGame(); }} 
                            size="lg" 
                            className="bg-[#ff0055] hover:bg-[#d40047] text-white font-bold text-xl py-6 px-10 rounded-full shadow-[0_0_30px_rgba(255,0,85,0.4)] transition-transform active:scale-95"
                         >
                            <RotateCcw className="mr-3 w-6 h-6" /> TRY AGAIN
                         </Button>
                    </div>
                )}
            </div>
        </div>
      </RevealOnView>
    </article>
  )
}