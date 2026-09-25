import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticElement } from "./MagneticElement";

export function Hero() {
  return <section id="home" className="hero-section">
    <div className="hero-grain" />
    <div className="hero-content">
      <p className="eyebrow"><span /> Design <i/> Branding <i/> Printing</p>
      <h1>
        <span className="hero-line-wrap"><span className="hero-line hero-line-1">We create</span></span>
        <span className="hero-line-wrap"><span className="hero-line hero-line-2">digital <em>experiences</em></span></span>
        <span className="hero-line-wrap"><span className="hero-line hero-line-3">that matter.</span></span>
      </h1>
      <div className="hero-bottom">
        <p>Beyond creates unmistakable identities and digital experiences for ambitious brands ready to matter.</p>
        <div className="hero-actions"><MagneticElement><Button asChild variant="gold" size="xl"><a href="#contact">Start a project <ArrowUpRight /></a></Button></MagneticElement><MagneticElement><Button asChild variant="ghostLight" size="xl"><a href="#work">Explore our work <ArrowUpRight /></a></Button></MagneticElement></div>
      </div>
    </div>
    <a
      href="#statement"
      className="scroll-cue"
      aria-label="Scroll to introduction"
      onClick={(e) => {
        e.preventDefault();
        document.getElementById("statement")?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <span>Scroll to discover</span>
      <ArrowDown />
    </a>
    <div className="hero-index">BEYOND® / 26<br/><span>Independent studio<br/>Rajkot — Worldwide</span></div>
  </section>;
}
