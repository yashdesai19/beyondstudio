import type { ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

export function AnimatedText({ lines, className = "" }: { lines: ReactNode[]; className?: string }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={cn("animated-text", visible && "is-visible", className)}>
      {lines.map((line, index) => (
        <div className="text-mask" key={index}>
          <div className={cn("text-line", `text-line-${index + 1}`)}>
            <span>{line}</span>
          </div>
        </div>
      ))}
    </div>
  );
}