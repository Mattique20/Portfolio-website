import RevealOnView from "@/components/reveal-on-view"
import { Badge } from "@/components/ui/badge"

type Props = {
  revealDelay?: number
}

export default function ExperienceCard({ revealDelay = 0 }: Props) {
  const experiences = [
    {
      title: "SQA Engineer",
      company: "Alachisoft",
      period: "May 2025 – Aug 2025 | Islamabad, Pakistan",
      description: [
        "Performed daily sanity, performance, and load tests on NCache to identify bottlenecks and ensure system stability.",
        "Identified, tracked, and verified fixes for bugs within NCache, collaborating with developers to expedite resolution.",
        "Maintained automated tests to improve test coverage and accelerate release timelines."
      ],
      technologies: ["NCache", "Automation", "Testing"]
    },
    {
      title: "Research Assistant",
      company: "FAST (NUCES)",
      period: "June 2024 – April 2025 | Islamabad, Pakistan",
      description: [
        "Reviewed 5+ academic papers to stay up-to-date on texture enhancement and image processing advancements.",
        "Evaluated and applied 4 encoding strategies to enhance texture quality.",
        "Collaborated with team members to discuss progress and integrate feedback."
      ],
      technologies: ["Image Processing", "Research", "Python"]
    },
    {
      title: "Software Engineering Intern",
      company: "Bitnine Global",
      period: "March 2024 – May 2024 | Islamabad, Pakistan",
      description: [
        "Actively contributed to the enhancement of Apache Age. (Git, GitHub)",
        "Implemented 2 new features and 3 GraphQL functionalities on PostgreSQL.",
        "Resolved critical bugs and improved documentation."
      ],
      technologies: ["Apache Age", "PostgreSQL", "GraphQL", "Git"]
    },
    {
      title: "NLP Intern",
      company: "IKNEX Lab",
      period: "June 2023 – August 2023 | Islamabad, Pakistan",
      description: [
        "Conducted Natural Language Processing (NLP) and data mining on an Arabic encyclopedia.",
        "Achieved an impressive 95% accuracy rate in data extraction and categorization."
      ],
      technologies: ["NLP", "Data Mining", "Python"]
    }
  ]

  return (
    <article className="group relative lg:h-[calc(100svh-2rem)]">
      <RevealOnView
        delay={revealDelay}
        className="rounded-3xl border border-white/10 p-1 shadow-[0_10px_60px_-10px_rgba(0,0,0,0.6)] lg:h-full"
        style={{
          backgroundImage: `linear-gradient(135deg, #581c87, #7c3aed)`,
        }}
      >
        <div className="relative overflow-hidden rounded-[1.35rem] bg-black lg:h-full p-6 sm:p-8">
          <div className="lg:h-full flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Experience</h2>
            <p className="text-white/70 mb-8">
              My professional journey in software engineering, research, and quality assurance.
            </p>

            <div className="space-y-6 overflow-y-auto max-h-[60vh] lg:max-h-none">
              {experiences.map((exp, idx) => (
                <div
                  key={exp.company}
                  className="border-l-2 border-white/20 pl-4 pb-6 last:pb-0 animate-fadein"
                  style={{
                    animationDelay: `${idx * 0.15 + 0.1}s`,
                    animationDuration: "0.8s",
                    animationFillMode: "both"
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{exp.title}</h3>
                      <p className="text-white/80">{exp.company}</p>
                    </div>
                    <Badge variant="outline" className="border-white/20 text-white/80 mt-1 sm:mt-0 self-start">
                      {exp.period}
                    </Badge>
                  </div>

                  <ul className="text-white/70 text-sm mb-3 list-disc ml-5">
                    {exp.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1">
                    {exp.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
                        {tech}
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
