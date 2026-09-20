import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function AnimatedText({ lines, className = "" }: { lines: ReactNode[]; className?: string }) {
  return <div className={`animated-text ${className}`}>{lines.map((line, index) => <div className="text-mask" key={index}><Reveal delay={index * 90}><span>{line}</span></Reveal></div>)}</div>;
}