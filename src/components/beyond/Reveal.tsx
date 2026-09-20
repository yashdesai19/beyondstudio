import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useReveal } from "@/hooks/use-reveal";

export function Reveal({ children, className, delay = 0, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode; delay?: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={cn("reveal", visible && "is-visible", className)} {...props}>{children}</div>;
}
