import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, MessageCircle, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BeyondLogo } from "./BeyondLogo";

const links = ["Home", "About", "Services", "Work", "Process", "Contact"];
const ids = ["home", "about", "services", "work", "process", "contact"];

export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      let current = "home";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 220) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      {/* Brand Logo Link */}
      <a
        href="#home"
        onClick={(e) => {
          e.preventDefault();
          go("home");
        }}
        className="brand-mark brand-logo-link"
        aria-label="Beyond Studio Home"
      >
        <BeyondLogo variant="horizontal" height={32} />
      </a>

      {/* Desktop Navigation (Hidden on Tablet/Mobile) */}
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map((label, i) => {
          const id = ids[i];
          return (
            <a
              key={label}
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                if (id) go(id);
              }}
              className={active === id ? "active" : ""}
            >
              {label}
            </a>
          );
        })}
      </nav>

      {/* Desktop Header CTA Button */}
      <Button asChild variant="gold" size="lg" className="header-cta">
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            go("contact");
          }}
        >
          Start a project <ArrowUpRight />
        </a>
      </Button>

      {/* Mobile Hamburger / Close Button */}
      <button
        type="button"
        className="menu-toggle"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Full-Screen Mobile Drawer */}
      <div
        className={`mobile-menu ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="mobile-menu-header">
          <BeyondLogo variant="horizontal" height={28} />
          <button
            type="button"
            className="mobile-menu-close-btn"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mobile-menu-inner" aria-label="Mobile navigation">
          {links.map((label, i) => {
            const id = ids[i];
            return id ? (
              <button
                key={label}
                type="button"
                className={`mobile-nav-link ${active === id ? "active" : ""}`}
                style={{ transitionDelay: `${i * 40}ms` }}
                onClick={() => go(id)}
              >
                <span className="mobile-nav-index">0{i + 1}</span>
                <span className="mobile-nav-text">{label}</span>
                <ArrowUpRight className="mobile-nav-arrow" />
              </button>
            ) : null;
          })}
        </nav>

        {/* Mobile Menu Action & Contact Info */}
        <div className="mobile-menu-foot">
          <Button
            variant="gold"
            size="xl"
            className="w-full justify-center mb-4"
            onClick={() => go("contact")}
          >
            Start a project <ArrowUpRight className="w-4 h-4 ml-1" />
          </Button>

          <div className="mobile-menu-contact-grid">
            <a
              href="https://wa.me/919904799105"
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-contact-pill"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp Us</span>
            </a>
            <a href="tel:+919904799105" className="mobile-contact-pill">
              <Phone className="w-3.5 h-3.5 text-primary" />
              <span>+91 99047 99105</span>
            </a>
          </div>

          <p className="mobile-menu-location">
            Rajkot, Gujarat · Available worldwide
          </p>
        </div>
      </div>
    </header>
  );
}

