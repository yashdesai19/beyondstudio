import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroCanvas } from "./HeroCanvas";

export function Hero() {
  return <section id="home" className="hero-section">
    <HeroCanvas /><div className="hero-grain" />
    <div className="hero-content">
      <p className="eyebrow"><span /> Independent creative studio · Rajkot</p>
      <h1>Ideas shaped<br />to go <em>beyond.</em></h1>
      <div className="hero-bottom">
        <p>We build identities, packaging and printed worlds for ambitious businesses ready to be remembered.</p>
        <div className="hero-actions"><Button asChild variant="gold" size="xl"><a href="#work">Explore our work <ArrowUpRight /></a></Button><Button asChild variant="ghostLight" size="xl"><a href="#contact">Start a conversation</a></Button></div>
      </div>
    </div>
    <a href="#statement" className="scroll-cue" aria-label="Scroll to introduction"><span>Scroll to discover</span><ArrowDown /></a>
    <div className="hero-index">B—01<br/><span>Creative direction<br/>Brand systems<br/>Print craft</span></div>
  </section>;
}
