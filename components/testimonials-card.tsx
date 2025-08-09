"use client"
import RevealOnView from "@/components/reveal-on-view"

export default function InterestsCard() {
  return (
    <article className="group relative lg:h-[calc(100svh-2rem)]">
      <RevealOnView
        className="rounded-3xl border border-white/10 p-1 shadow-[0_10px_60px_-10px_rgba(0,0,0,0.6)] lg:h-full"
        style={{
          backgroundImage: `linear-gradient(135deg, #0ea5e9, #a21caf)`,
        }}
      >
        <div className="relative overflow-hidden rounded-[1.35rem] bg-black lg:h-full p-6 sm:p-8">
          <div className="lg:h-full flex flex-col justify-center items-center gap-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white text-center">Hey there! 👋</h2>
            <p className="text-lg text-white/90 text-center max-w-xl">
              When I'm not coding, you'll find me on the football pitch, playing competitive FIFA, or enjoying a tennis match. I'm a coffee lover always up for a chat over a fresh brew, and I love swimming to recharge. <br /><br />
              Want to play a FIFA match, grab a coffee, or join me for some sports? <span className="font-bold text-cyan-400">Let's connect!</span> Friendly faces always welcome.
            </p>
            <div className="flex flex-wrap gap-6 justify-center mt-4">
              <InterestBubble icon="⚽" label="Football" />
              <InterestBubble icon="🎮" label="FIFA" />
              <InterestBubble icon="☕" label="Coffee" />
              <InterestBubble icon="🎾" label="Tennis" />
              <InterestBubble icon="🏊‍♂️" label="Swimming" />
            </div>
            <div className="mt-8 text-center">
              <span className="inline-block px-4 py-2 rounded-full bg-cyan-700/30 text-cyan-200 font-semibold shadow">Open to new friends & fun challenges!</span>
            </div>
          </div>
        </div>
      </RevealOnView>
    </article>
  )
}

function InterestBubble({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 shadow-lg transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl hover:bg-white/20">
      <span className="text-3xl transition-all duration-300 ease-in-out hover:rotate-20">
        {icon}
      </span>
      <span className="text-white font-medium text-base transition-all duration-300 ease-in-out">
        {label}
      </span>
    </div>
  )
}