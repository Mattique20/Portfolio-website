import Link from "next/link"
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import RevealOnView from "@/components/reveal-on-view"

type Props = {
  revealDelay?: number
}

export default function ContactCard({ revealDelay = 0 }: Props) {
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

  return (
    <article className="group relative lg:h-[calc(100svh-2rem)]">
      <RevealOnView
        delay={revealDelay}
        className="rounded-3xl border border-white/10 p-1 shadow-[0_10px_60px_-10px_rgba(0,0,0,0.6)] lg:h-full"
        style={{
          backgroundImage: `linear-gradient(135deg, #065f46, #059669)`,
        }}
      >
        <div className="relative overflow-hidden rounded-[1.35rem] bg-black lg:h-full p-6 sm:p-8">
          <div className="lg:h-full flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Let's Work Together</h2>
            <p className="text-white/70 mb-8">
              Ready to bring your next project to life? I'd love to hear about your ideas and discuss how we can
              collaborate.
            </p>

            <div className="space-y-4 mb-8">
              {contactInfo.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-white/70 text-xs">{item.value}</p>
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className="space-y-4">
              <Button asChild size="lg" className="w-full rounded-full">
                <Link href="mailto:mattique02@outlook.com">
                  <Mail className="mr-2 h-4 w-4" />
                  Send me an email
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="w-full rounded-full bg-transparent">
             < Link
        href="https://calendly.com/mattique02" // Or your specific event link
        target="_blank"
        rel="noopener noreferrer"
    >
        <ExternalLink className="mr-2 h-4 w-4" />
        Schedule a call with Calendly
    </Link>
              </Button>
            </div>

            <div className="mt-6 p-3 bg-white/5 rounded-xl">
              <p className="text-xs text-white/70">
                <strong>Response time:</strong> I typically respond within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </RevealOnView>
    </article>
  )
}
