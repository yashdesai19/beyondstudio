import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroCanvas } from "./HeroCanvas";
import { MagneticElement } from "./MagneticElement";

export function Hero() {
  return <section id="home" className="hero-section">
    <HeroCanvas /><div className="hero-grain" />
    <div className="hero-content">
      <p className="eyebrow"><span /> Design <i/> Technology <i/> Experience</p>
      <h1><span>We create</span><span>digital <em>experiences</em></span><span>that matter.</span></h1>
      <div className="hero-bottom">
        <p>Beyond creates unmistakable identities and digital experiences for ambitious brands ready to matter.</p>
        <div className="hero-actions"><MagneticElement><Button asChild variant="gold" size="xl"><a href="#contact">Start a project <ArrowUpRight /></a></Button></MagneticElement><MagneticElement><Button asChild variant="ghostLight" size="xl"><a href="#work">Explore our work <ArrowUpRight /></a></Button></MagneticElement></div>
      </div>
    </div>
    <a href="#statement" className="scroll-cue" aria-label="Scroll to introduction"><span>Scroll to discover</span><ArrowDown /></a>
    <div className="hero-index">BEYOND® / 26<br/><span>Independent studio<br/>Rajkot — Worldwide</span></div>
  </section>;
}
