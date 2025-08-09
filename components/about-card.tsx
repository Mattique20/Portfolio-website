import RevealOnView from "@/components/reveal-on-view"
import { Badge } from "@/components/ui/badge"

type Props = {
  revealDelay?: number
}

export default function AboutCard({ revealDelay = 0 }: Props) {
  const achievements = [
    "Graduated with a BSc in Computer Science from FAST NUCES (2025)",
    "Researched in texture enhancement and image processing",
    "Contributed to open-source projects",
    "Always learning new tech!",
    "Vibecoded over 1247 coffees ☕",
  ]

  return (
    <article className="group relative lg:h-[calc(100svh-2rem)]">
      <RevealOnView
        delay={revealDelay}
        className="rounded-3xl border border-white/10 p-1 shadow-[0_10px_60px_-10px_rgba(0,0,0,0.6)] lg:h-full"
        style={{
          backgroundImage: `linear-gradient(135deg, #1f2937, #374151)`,
        }}
      >
        <div className="relative overflow-hidden rounded-[1.35rem] bg-black lg:h-full p-6 sm:p-8">
          <div className="lg:h-full flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">About Me</h2>

            <div className="space-y-4 text-white/80 mb-8">
              <p>
                Hi, I'm Mohammad Attique a tech enthusiast, and a football fan from Islamabad! I love building, breaking, and improving software, and I'm always up for a challenge (or a FIFA match!).
              </p>
              <p>
                My journey has taken me from research labs to global tech companies, and I've worked on everything from NLP to database engines. Whether it's squashing bugs, optimizing performance, or collaborating with awesome teams, I bring energy and curiosity to every project.
              </p>
              <p>
                When I'm not coding or testing, you'll find me playing football, tennis, or swimming or maybe enjoying a great cup of coffee. Let's connect if you want to talk tech, sports, or just share a laugh!
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-semibold text-white">Key Achievements</h3>
              <div className="space-y-3">
                {achievements.map((achievement, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-white/60 mt-2 flex-shrink-0" />
                    <p className="text-white/80 text-sm">{achievement}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-white">Check Out My Blog</h4>
              <div className="flex flex-wrap gap-2">

                <a
                  href="https://medium.com/@mattique02/an-introduction-to-kubernetes-simplifying-container-orchestration-d7cd9f3a4c7f"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 font-semibold hover:bg-white/20 transition"
                >
                  Medium: Introduction to Kubernetes
                </a>
                <a
                  href="https://medium.com/@mattique02/building-and-optimizing-beowulf-clusters-with-docker-on-windows-1b1e83532c27"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 font-semibold hover:bg-white/20 transition"
                >
                  Medium: Beowulf Clusters with Docker
                </a>
              </div>
            </div>
          </div>
        </div>
      </RevealOnView>
    </article>
  )
}
