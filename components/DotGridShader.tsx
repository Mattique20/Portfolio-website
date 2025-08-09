"use client"
import { DotGrid } from "@paper-design/shaders-react"
import React, { useRef, useEffect, useState } from "react"

type DotGridShaderProps = React.ComponentProps<typeof DotGrid>

export default function DotGridShader(props: DotGridShaderProps) {
  // Interactive state for parallax
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Only respond if mouse is inside the container
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // Parallax: map mouse position to a small offset
        const px = ((x / rect.width) - 0.5) * 30; // max 30px shift
        const py = ((y / rect.height) - 0.5) * 30;
        setParallax({ x: px, y: py });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [])

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", position: "relative" }}>
      <DotGrid
        colorFill="#3a3a3a"
        colorStroke="#00ffe7"
        colorBack="#0a0a23"
        size={1.3 + Math.abs(parallax.x) * 0.03 + Math.abs(parallax.y) * 0.03}
        gapY={10}
        gapX={10}
        strokeWidth={1}
        sizeRange={0.2}
        opacityRange={0.7}
        shape="circle"
        {...props}
        style={{
          backgroundColor: "#0a0a23",
          width: "100%",
          height: "100%",
          boxShadow: `0 0 40px 10px #00ffe7 inset`,
          transform: `translate(${parallax.x}px, ${parallax.y}px) scale(${1 + Math.abs(parallax.x) * 0.002 + Math.abs(parallax.y) * 0.002})`,
          transition: "transform 0.2s cubic-bezier(0.1,0.1,0.1,0.1), box-shadow 0.3s",
          ...(props?.style || {}),
        }}
      />
    </div>
  )
}
