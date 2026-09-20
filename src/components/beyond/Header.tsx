import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = ["Home", "About", "Services", "Work", "Process", "Contact"];
const ids = ["home", "about", "services", "work", "process", "contact"];

export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      let current = "home";
      for (const id of ids) { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < 180) current = id; }
      setActive(current);
    };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  const go = (id: string) => { setOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  return <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
    <a href="#home" className="brand-mark" aria-label="Beyond home">B<span>Y</span>D</a>
    <nav className="desktop-nav" aria-label="Main navigation">{links.map((label, i) => <a key={label} href={`#${ids[i]}`} className={active === ids[i] ? "active" : ""}>{label}</a>)}</nav>
    <Button asChild variant="gold" size="lg" className="header-cta"><a href="#contact">Start a project <ArrowUpRight /></a></Button>
    <Button variant="iconDark" size="icon" className="menu-toggle" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
    <div className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <div className="mobile-menu-inner">{links.map((label, i) => { const id = ids[i]; return id ? <button key={label} onClick={() => go(id)}><span>0{i + 1}</span>{label}</button> : null; })}</div>
      <p>Rajkot, Gujarat · Available worldwide</p>
    </div>
  </header>;
}
