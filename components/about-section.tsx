import RevealOnView from "@/components/reveal-on-view"
import { Badge } from "@/components/ui/badge"

export default function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 bg-neutral-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <RevealOnView>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">About Me</h2>
            <div className="space-y-6 text-lg text-white/80">
              <p>
                Hi, I'm Mohammad Attique—a tech enthusiast, SQA engineer, and football fan from Islamabad! I love building, breaking, and improving software, and I'm always up for a challenge (or a FIFA match!).
              </p>
              <p>
                My journey has taken me from research labs to global tech companies, and I've worked on everything from NLP to database engines. Whether it's squashing bugs, optimizing performance, or collaborating with awesome teams, I bring energy and curiosity to every project.
              </p>
              <p>
                When I'm not coding or testing, you'll find me playing football, tennis, or swimming—or maybe enjoying a great cup of coffee. Let's connect if you want to talk tech, sports, or just share a laugh!
              </p>
            </div>
          </RevealOnView>

          <RevealOnView delay={0.2}>
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold mb-4">Experience</h3>
              <div className="space-y-4">
                <ExperienceItem
                  title="SQA Engineer"
                  org="Alachisoft"
                  date="May 2025 – Aug 2025"
                  location="Islamabad, Pakistan"
                  bullets={["Performed daily sanity, performance, and load tests on NCache to identify bottlenecks and ensure system stability.","Identified, tracked, and verified fixes for bugs within NCache, collaborating with developers to expedite resolution.","Maintained automated tests to improve test coverage and accelerate release timelines."]}
                />
                <ExperienceItem
                  title="Research Assistant"
                  org="FAST (NUCES)"
                  date="June 2024 – April 2025"
                  location="Islamabad, Pakistan"
                  bullets={["Reviewed 5+ academic papers to stay up-to-date on texture enhancement and image processing advancements.","Evaluated and applied 4 encoding strategies to enhance texture quality.","Collaborated with team members to discuss progress and integrate feedback."]}
                />
                <ExperienceItem
                  title="Software Engineering Intern"
                  org="Bitnine Global"
                  date="March 2024 – May 2024"
                  location="Islamabad, Pakistan"
                  bullets={["Actively contributed to the enhancement of Apache Age. (Git, GitHub)","Implemented 2 new features and 3 GraphQL functionalities on PostgreSQL.","Resolved critical bugs and improved documentation."]}
                />
                <ExperienceItem
                  title="NLP Intern"
                  org="IKNEX Lab"
                  date="June 2023 – August 2023"
                  location="Islamabad, Pakistan"
                  bullets={["Conducted Natural Language Processing (NLP) and data mining on an Arabic encyclopedia.","Achieved an impressive 95% accuracy rate in data extraction and categorization."]}
                />
              </div>

              <h3 className="text-2xl font-semibold mb-4 pt-6">Education</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-3 flex-shrink-0" />
                  <div>
                    <p className="text-white/90 font-semibold">Bachelors in Computer Science</p>
                    <p className="text-white/70 text-sm">National University of Computer and Emerging Sciences (FAST)</p>
                    <p className="text-white/50 text-xs">September 2021 – May 2025 · Islamabad, Pakistan</p>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-semibold mb-4 pt-6">Extracurricular</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-pink-400 mt-3 flex-shrink-0" />
                  <div>
                    <p className="text-white/90 font-semibold">Vice Head for Corporate Outreach and PR (External)</p>
                    <p className="text-white/70 text-sm">Google Developer Student Club (GDSC-FAST Islamabad)</p>
                    <p className="text-white/50 text-xs">1 year</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 mt-3 flex-shrink-0" />
                  <div>
                    <p className="text-white/90 font-semibold">Campus Ambassador</p>
                    <p className="text-white/70 text-sm">PriceOye.pk</p>
                    <p className="text-white/50 text-xs">8 months</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <h4 className="text-lg font-semibold mb-3">Currently Learning</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">AI/ML</Badge>
                  <Badge variant="secondary">Graph Databases</Badge>
                  <Badge variant="secondary">Performance Testing</Badge>
                  <Badge variant="secondary">Cloud Technologies</Badge>
                </div>
              </div>
            </div>
          </RevealOnView>
        </div>
      </div>
    </section>
  )
}

function ExperienceItem({ title, org, date, location, bullets }: {
  title: string;
  org: string;
  date: string;
  location: string;
  bullets: string[];
}) {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
        <span className="font-semibold text-white text-base">{title}</span>
        <span className="text-white/60 text-sm">{org}</span>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
        <span className="text-white/50 text-xs">{date}</span>
        <span className="text-white/50 text-xs">{location}</span>
      </div>
      <ul className="list-disc ml-6 text-white/80 text-sm space-y-1">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  )
}
