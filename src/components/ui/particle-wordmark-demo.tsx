import ParticleWordmark from "@/components/ui/particle-wordmark";

export default function ParticleWordmarkDemo() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#050407] p-10">
      <ParticleWordmark
        wordmark="BEYOND"
        mode="dark"
        className="w-full max-w-4xl rounded-lg"
        style={{ aspectRatio: "16 / 4" }}
      />
    </div>
  );
}
