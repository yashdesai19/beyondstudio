import { useRef, type ReactNode } from "react";

export function MagneticElement({ children, strength = 10 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width - 0.5) * strength;
    const y = ((event.clientY - box.top) / box.height - 0.5) * strength;
    ref.current?.style.setProperty("transform", `translate3d(${x}px,${y}px,0)`);
  };
  const reset = () => ref.current?.style.setProperty("transform", "translate3d(0,0,0)");
  return <div className="magnetic" onPointerMove={move} onPointerLeave={reset}><div ref={ref}>{children}</div></div>;
}