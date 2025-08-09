import Link from "next/link"
import { ArrowRight, Download, Mail, Github, Linkedin } from "lucide-react"

import { Button } from "@/components/ui/button"
import DotGridShader from "@/components/DotGridShader"

import ProjectCard from "@/components/project-card"
import AnimatedHeading from "@/components/animated-heading"
import RevealOnView from "@/components/reveal-on-view"
import SkillsCard from "@/components/skills-card"
import ExperienceCard from "@/components/experience-card"
import AboutCard from "@/components/about-card"
import ContactCard from "@/components/contact-card"
import LiveStatsCard from "@/components/live-stats-card"
import InteractiveShowcaseCard from "@/components/interactive-showcase-card"
import InterestsCard from "@/components/testimonials-card"
import LiveClock from "@/components/live-clock"

export default function Page() {
  const projects = [
    {
      title: "Art2Sprite",
      subtitle: "Pixel art generator",
      imageSrc: "/images/A2S-Video.MP4",
      tags: ["Generative AI", "Python", "Web App", "Github"],
      href: "https://github.com/Mattique20/Art2Sprite", // Github link
      priority: true,
      gradientFrom: "#0f172a",
      gradientTo: "#6d28d9",
      video: true, // Enable video for this project
    },
  ]

  return (
    <main className="bg-neutral-950 text-white">
      {/* HERO: full-viewport row. Left is sticky; right scrolls internally. */}
      <section className="px-4 pt-4 pb-16 lg:pb-4">
        <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[minmax(0,420px)_1fr]">
          {/* LEFT: sticky and full height, no cut off */}
          <aside className="lg:sticky lg:top-4 lg:h-[calc(100svh-2rem)]">
            <RevealOnView
              as="div"
              intensity="hero"
              className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60 p-6 sm:p-8"
              staggerChildren
            >
              {/* Texture background */}
              <div className="pointer-events-none absolute inset-0 opacity-5 mix-blend-soft-light">
                <DotGridShader />
              </div>

              {/* Floating particles animation */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-float-slow" />
                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/30 rounded-full animate-float-medium" />
                <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-white/15 rounded-full animate-float-fast" />
              </div>

              <div>
                {/* Wordmark with live status */}
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-extrabold tracking-tight">Attique</div>
                    <div
                      className="h-2 w-2 rounded-full bg-green-400 animate-pulse"
                      aria-hidden="true"
                      title="Available for work"
                    />
                  </div>
                  <div className="text-xs text-white/50 font-mono">
                    <LiveClock timeZone="Asia/Karachi" />
                  </div>
                </div>

                {/* Profile Picture with hover effect */}
                <div className="mb-6 flex justify-center">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 group">
                    <img
                      src="/placeholder-user.jpg"
                      alt="Attique's profile"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Headline with intro blur effect */}
                <AnimatedHeading
                  className="text-2xl font-black leading-[1.05] tracking-tight sm:text-5xl"
                  lines={["I build software", "that solves real problems"]}
                />

                <p className="mt-4 max-w-[42ch] text-lg text-white/70">
                 love building new things and then breaking them to make them even better. Let's create something resilient together!
                </p>

                {/* CTAs with enhanced styling */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link href="mailto:mattique02@outlook.com">
                      Hire me
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="rounded-full bg-transparent hover:bg-white/10 border-white/30 hover:border-white/50 transition-all duration-300"
                  >
                    <Link href="/public/Mohammad_Attique_Resume.pdf">
                      <Download className="mr-2 h-4 w-4" />
                      CV
                    </Link>
                  </Button>
                </div>

                {/* Social Links with hover effects */}
                <div className="mt-6 flex items-center gap-4">
                  <Link
                    href="https://github.com/Mattique20"
                    className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110"
                  >
                    <Github className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/attique20/"
                    className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link
                    href="mailto:mattique02@outlook.com"
                    className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110"
                  >
                    <Mail className="h-5 w-5" />
                  </Link>
                </div>

                {/* Experience & Education */}
                <div className="mt-10">
                  <p className="mb-3 text-3xl font-semibold tracking-widest text-white">EXPERIENCE & EDUCATION</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-1xl  font-semibold text-white/60 opacity-80">
                    <li className="hover:text-white transition-colors cursor-default">Alachisoft</li>
                    <li className="hover:text-white transition-colors cursor-default">FAST (NUCES)</li>
                    <li className="hover:text-white transition-colors cursor-default">Bitnine Global</li>
                    <li className="hover:text-white transition-colors cursor-default">IKNEX Lab</li>
                    
                  </ul>
                </div>
              </div>
            </RevealOnView>
          </aside>

          {/* RIGHT: horizontal scrollable sections */}
          <div className="space-y-4">
            {/* About Section */}
            <AboutCard revealDelay={0} />

            {/* Live Stats Card - NEW! */}
            <LiveStatsCard revealDelay={0.06} />

            {/* Skills Section */}
            <SkillsCard revealDelay={0.12} />

            {/* Interactive Showcase - NEW! */}
            <InteractiveShowcaseCard revealDelay={0.18} />

            {/* Projects Section */}
            {projects.map((p, idx) => (
              <ProjectCard
                key={p.title}
                title={p.title}
                subtitle={p.subtitle}
                imageSrc={p.imageSrc}
                tags={p.tags}
                href={p.href}
                priority={p.priority}
                gradientFrom={p.gradientFrom}
                gradientTo={p.gradientTo}
                imageContainerClassName="lg:h-full"
                containerClassName="lg:h-[calc(100svh-2rem)]"
                revealDelay={(idx + 4) * 0.06}
                video={p.video}
              />
            ))}

            {/* Interests Card - NEW! */}
            <InterestsCard />

            {/* Experience Section */}
            <ExperienceCard revealDelay={(projects.length + 5) * 0.06} />

            {/* Contact Section */}
            <ContactCard revealDelay={(projects.length + 6) * 0.06} />
          </div>
        </div>
      </section>
    </main>
  )
}
