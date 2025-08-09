import RevealOnView from "@/components/reveal-on-view"
import { Badge } from "@/components/ui/badge"

export default function SkillsSection() {
  const skillCategories = [
    {
      title: "Design Tools",
      skills: ["Figma", "Sketch", "Adobe Creative Suite", "Framer", "Principle", "ProtoPie"],
    },
    {
      title: "Frontend Development",
      skills: ["HTML/CSS", "JavaScript", "React", "Next.js", "Tailwind CSS", "TypeScript"],
    },
    {
      title: "Design Systems",
      skills: ["Component Libraries", "Design Tokens", "Style Guides", "Documentation", "Accessibility"],
    },
    {
      title: "Research & Strategy",
      skills: ["User Research", "Usability Testing", "Information Architecture", "Journey Mapping", "A/B Testing"],
    },
    {
      title: "Collaboration",
      skills: ["Cross-functional Teams", "Stakeholder Management", "Design Workshops", "Agile/Scrum"],
    },
    {
      title: "Specializations",
      skills: ["Mobile Design", "Web Applications", "SaaS Products", "E-commerce", "Fintech"],
    },
  ]

  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <RevealOnView className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Skills & Expertise</h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            A comprehensive toolkit built through years of hands-on experience in product design and development.
          </p>
        </RevealOnView>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, idx) => (
            <RevealOnView
              key={category.title}
              delay={idx * 0.1}
              className="bg-neutral-900/60 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold mb-4 text-white">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-white/10 text-white border-white/20">
                    {skill}
                  </Badge>
                ))}
              </div>
            </RevealOnView>
          ))}
        </div>
      </div>
    </section>
  )
}
