import Link from "next/link"
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import RevealOnView from "@/components/reveal-on-view"

export default function ContactSection() {
  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "mattique02@outlook.com",
      href: "mailto:mattique02@outlook.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+92-331-3994197",
      href: "tel:+923313994197",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Islamabad, PK",
      href: "#",
    },
  ]

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/Mattique20",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/attique20/",
    },
    
  ]

  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <RevealOnView className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Let's Work Together</h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Ready to bring your next project to life? I'd love to hear about your ideas and discuss how we can
            collaborate.
          </p>
        </RevealOnView>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <RevealOnView>
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-6">Get in Touch</h3>
                <p className="text-white/80 mb-8">
                  I'm always open to discussing new opportunities, interesting projects, or just having a chat about
                  design and technology.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/60 border border-white/10 hover:bg-neutral-900/80 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-white/70">{item.value}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>

              <div>
                <h4 className="font-semibold mb-4">Follow Me</h4>
                <div className="flex gap-4">
                  {socialLinks.map((social) => {
                    const Icon = social.icon
                    return (
                      <Link
                        key={social.label}
                        href={social.href}
                        className="w-12 h-12 rounded-lg bg-neutral-900/60 border border-white/10 flex items-center justify-center hover:bg-neutral-900/80 transition-colors"
                        aria-label={social.label}
                      >
                        <Icon className="h-5 w-5" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </RevealOnView>

          {/* CTA */}
          <RevealOnView delay={0.2}>
            <div className="bg-neutral-900/60 rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-semibold mb-4">Ready to Start?</h3>
              <p className="text-white/80 mb-6">
                Whether you have a specific project in mind or just want to explore possibilities, I'm here to help turn
                your vision into reality.
              </p>

              <div className="space-y-4">
                <Button asChild size="lg" className="w-full rounded-full">
                  <Link href="mailto:brandon@portfolio.dev">
                    <Mail className="mr-2 h-4 w-4" />
                    Send me an email
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg" className="w-full rounded-full bg-transparent">
                  <Link href="/calendar">Schedule a call</Link>
                </Button>
              </div>

              <div className="mt-8 p-4 bg-white/5 rounded-xl">
                <p className="text-sm text-white/70">
                  <strong>Response time:</strong> I typically respond within 24 hours during business days.
                </p>
              </div>
            </div>
          </RevealOnView>
        </div>
      </div>
    </section>
  )
}
