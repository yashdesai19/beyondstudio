import { useRef, useState, type ReactNode, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
}

export function TiltCard({
  children,
  className,
  maxTilt = 7,
  glare = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({ opacity: 0 });

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`);

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlareStyle({
        opacity: 0.18,
        background: `radial-gradient(circle 260px at ${glareX}% ${glareY}%, rgba(225, 195, 120, 0.45), transparent 75%)`,
      });
    }
  };

  const handlePointerLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlareStyle({ opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={cn("tilt-card-wrapper", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        transform,
        transition: transform ? "transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)" : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        transformStyle: "preserve-3d",
        position: "relative",
      }}
    >
      {children}
      {glare && (
        <div
          className="tilt-card-glare"
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            borderRadius: "inherit",
            transition: "opacity 0.35s ease",
            zIndex: 10,
            ...glareStyle,
          }}
        />
      )}
    </div>
  );
}
