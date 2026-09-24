import type { ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

export function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={cn("section-label", visible && "is-visible")}>
      <span>{index}</span>
      <p>{children}</p>
      <i />
    </div>
  );
}
