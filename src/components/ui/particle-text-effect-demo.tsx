import { ParticleTextEffect } from "@/components/ui/particle-text-effect";

export default function DemoOne() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#050407] p-4">
      <ParticleTextEffect
        words={["BEYOND STUDIO"]}
        showDescription={true}
      />
    </div>
  );
}
