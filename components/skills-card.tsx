import RevealOnView from "@/components/reveal-on-view"
import { Badge } from "@/components/ui/badge"

type Props = {
  revealDelay?: number
}

export default function SkillsCard({ revealDelay = 0 }: Props) {
  const skillCategories = [
    {
      title: "Languages",
      skills: ["C#", "Python", "C/C++", "Java", "Go"],
    },
    {
      title: "Frameworks & Libraries",
      skills: [".NET", "ASP.NET", "React", "NextJS", "NodeJS", "FastAPI", "PyTorch", "TensorFlow"],
    },
    {
      title: "Databases & Caching",
      skills: ["MySQL", "MongoDB", "PostgreSQL", "NCache"],
    },
    {
      title: "AI/ML",
      skills: ["PyTorch", "TensorFlow", "OpenCV"],
    },
    {
      title: "DevOps & Tools",
      skills: ["Docker", "Git/GitHub", "Azure Devops", "AWS", "Kubernetes"],
    },
    {
      title: "Software Development Methodologies",
      skills: ["Agile", "Scrum", "CI/CD"],
    },
  ]
    
  

  return (
    <article className="group relative lg:h-[calc(100svh-2rem)] transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <RevealOnView
        delay={revealDelay}
        className="rounded-3xl border border-white/10 p-1 shadow-[0_10px_60px_-10px_rgba(0,0,0,0.6)] lg:h-full"
        style={{
          backgroundImage: `linear-gradient(135deg, #0f172a, #1e293b)`,
        }}
      >
        <div className="relative overflow-hidden rounded-[1.35rem] bg-black lg:h-full p-6 sm:p-8">
          <div className="lg:h-full flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Technical Skills & Expertise</h2>
            <p className="text-white/70 mb-8">
              My toolkit spans modern programming languages, frameworks, databases, AI/ML, DevOps, and agile methodologies—built through hands-on engineering and research.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {skillCategories.map((category, idx) => (
                <div key={category.title} className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">{category.title}</h3>
                  <div className="flex flex-wrap gap-2 ">
                    {category.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-white/10 text-white border-white/20 text-s transition-all duration-300 ease-in-out hover:scale-125 hover:text-2xl ">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </RevealOnView>
    </article>
  )
}
