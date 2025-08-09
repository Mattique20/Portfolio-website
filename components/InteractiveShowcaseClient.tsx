"use client"
import dynamic from "next/dynamic"

// Dynamically import InteractiveShowcaseCard with SSR disabled
const InteractiveShowcaseCard = dynamic(() => import("@/components/interactive-showcase-card"), { ssr: false })

export default function InteractiveShowcaseClient(props: { revealDelay?: number }) {
  return <InteractiveShowcaseCard {...props} />
}
