import RevealOnView from "@/components/reveal-on-view"
import { Badge } from "@/components/ui/badge"

export default function ExperienceSection() {
  const experiences = [
    {
      title: "SQA Engineer",
      company: "Alachisoft",
      period: "May 2025 – Aug 2025",
      location: "Islamabad, Pakistan",
      description: "Performed daily sanity, performance, and load tests on NCache to identify bottlenecks and ensure system stability.",
      achievements: [
        "Identified, tracked, and verified fixes for bugs within NCache, collaborating with developers to expedite resolution.",
        "Maintained automated tests to improve test coverage and accelerate release timelines."
      ],
      technologies: ["NCache", "Automation", "Testing"]
    },
    {
      title: "Research Assistant",
      company: "FAST (NUCES)",
      period: "June 2024 – April 2025",
      location: "Islamabad, Pakistan",
      description: "Reviewed 5+ academic papers to stay up-to-date on texture enhancement and image processing advancements.",
      achievements: [
        "Evaluated and applied 4 encoding strategies to enhance texture quality.",
        "Collaborated with team members to discuss progress and integrate feedback."
      ],
      technologies: ["Image Processing", "Research", "Python"]
    },
    {
      title: "Software Engineering Intern",
      company: "Bitnine Global",
      period: "March 2024 – May 2024",
      location: "Islamabad, Pakistan",
      description: "Actively contributed to the enhancement of Apache Age. (Git, GitHub)",
      achievements: [
        "Implemented 2 new features and 3 GraphQL functionalities on PostgreSQL.",
        "Resolved critical bugs and improved documentation."
      ],
      technologies: ["Apache Age", "PostgreSQL", "GraphQL", "Git"]
    },
    {
      title: "NLP Intern",
      company: "IKNEX Lab",
      period: "June 2023 – August 2023",
      location: "Islamabad, Pakistan",
      description: "Conducted Natural Language Processing (NLP) and data mining on an Arabic encyclopedia.",
      achievements: [
        "Achieved an impressive 95% accuracy rate in data extraction and categorization."
      ],
      technologies: ["NLP", "Data Mining", "Python"]
    }
  ]

  const education = [
    {
      degree: "Bachelor of Fine Arts in Graphic Design",
      school: "Parsons School of Design",
      period: "2015 - 2019",
      location: "New York, NY",
    },
  ]

  return (
    <section id="experience" className="py-20 px-4 bg-neutral-900/50">
      <div className="max-w-7xl mx-auto">
        <RevealOnView className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Experience</h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            My professional journey in product design and the impact I've made along the way.
          </p>
        </RevealOnView>

        {/* Work Experience */}
        <div className="mb-16">
          <RevealOnView>
            <h3 className="text-2xl font-semibold mb-8">Work Experience</h3>
          </RevealOnView>

          <div className="space-y-8">
            {experiences.map((exp, idx) => (
              <RevealOnView
                key={exp.company}
                delay={idx * 0.1}
                className="bg-neutral-900/60 rounded-2xl p-6 lg:p-8 border border-white/10"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-semibold text-white">{exp.title}</h4>
                    <p className="text-lg text-white/80">{exp.company}</p>
                    <p className="text-white/60">{exp.location}</p>
                  </div>
                  <div className="mt-2 lg:mt-0">
                    <Badge variant="outline" className="border-white/20 text-white/80">
                      {exp.period}
                    </Badge>
                  </div>
                </div>

                <p className="text-white/80 mb-4">{exp.description}</p>

                <div className="mb-4">
                  <h5 className="font-semibold mb-2 text-white">Key Achievements:</h5>
                  <ul className="space-y-1">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/80">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/60 mt-2 flex-shrink-0" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold mb-2 text-white">Technologies:</h5>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="bg-white/10 text-white border-white/20">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <RevealOnView>
            <h3 className="text-2xl font-semibold mb-8">Education</h3>
          </RevealOnView>

          {education.map((edu, idx) => (
            <RevealOnView
              key={edu.school}
              delay={idx * 0.1}
              className="bg-neutral-900/60 rounded-2xl p-6 lg:p-8 border border-white/10"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h4 className="text-xl font-semibold text-white">{edu.degree}</h4>
                  <p className="text-lg text-white/80">{edu.school}</p>
                  <p className="text-white/60">{edu.location}</p>
                </div>
                <div className="mt-2 lg:mt-0">
                  <Badge variant="outline" className="border-white/20 text-white/80">
                    {edu.period}
                  </Badge>
                </div>
              </div>
            </RevealOnView>
          ))}
        </div>
      </div>
    </section>
  )
}
