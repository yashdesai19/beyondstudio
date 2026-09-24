import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Mail,
  MessageCircle,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import { BeyondLogo } from "./BeyondLogo";
import { ParticleWordmark } from "@/components/ui/particle-wordmark";
import { ParticleTextEffect } from "@/components/ui/particle-text-effect";

const faqs = [
 ["What type of design services do you provide?","Beyond covers brand strategy, digital design, websites, product experience, packaging and creative technology—built as one connected system."],
 ["How can I start a project?","Send an email, call, message on WhatsApp or complete the project brief below. A short initial conversation helps us recommend the right scope."],
 ["How long does a design project take?","Timing depends on scope. A focused identity moves faster than a complete digital experience. You’ll receive a clear timeline before work begins."],
 ["Do you provide source files?","Yes. Final source files are organised and handed over in the formats needed for both digital and print use."],
 ["Do you work outside Rajkot?","Yes. Projects are handled remotely for clients beyond Rajkot, with collaboration designed around your location."],
];

export function TestimonialFaq(){const[open,setOpen]=useState(0);return <><section className="testimonial section-pad"><div className="shell"><SectionLabel index="07">The standard</SectionLabel><div className="quote-mark" aria-hidden="true">“</div><Reveal><blockquote>The finished design should feel inevitable—clear in its idea, exact in its craft, and entirely your own.</blockquote></Reveal><div className="quote-credit"><i/><p>Dhaval Patel <span>Founder & Creative Lead</span></p></div></div></section><section className="faq section-pad"><div className="shell faq-grid"><div><p className="kicker">Common questions</p><h2>Before we<br/><em>begin.</em></h2></div><div>{faqs.map(([q,a],i)=><article key={q} className={open===i?"open":""}><button onClick={()=>setOpen(open===i?-1:i)} aria-expanded={open===i}><span>0{i+1}</span><b>{q}</b>{open===i?<Minus/>:<Plus/>}</button><div className="faq-answer"><p>{a}</p></div></article>)}</div></div></section></>}

const budgetPresets = ["< ₹50K", "₹50K - ₹1.5L", "₹1.5L - ₹3L", "₹3L+"];

export function Contact(){
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState("");
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    email: string;
    phone: string;
    company: string;
    service: string;
    budget: string;
    details: string;
    whatsappUrl: string;
  } | null>(null);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const company = String(fd.get("company") || "").trim();
    const service = String(fd.get("service") || "").trim();
    const chosenBudget = budget || String(fd.get("budget") || "").trim();
    const details = String(fd.get("project details") || "").trim();

    // 1. Format Professional WhatsApp Message for Dhaval Patel (+91 99047 99105)
    // Using clean '>' format to prevent character/emoji encoding issues across all mobile browsers
    const waText = 
      `*NEW PROJECT BRIEF — BEYOND STUDIO*\n` +
      `-----------------------------------------\n` +
      `> *Client Name:* ${name}\n` +
      `> *Email:* ${email}\n` +
      `> *Phone / WA:* ${phone || "Not provided"}\n` +
      `> *Company / Brand:* ${company || "Individual"}\n` +
      `> *Service Required:* ${service}\n` +
      `> *Budget Range:* ${chosenBudget || "Not specified"}\n\n` +
      `> *Project Details:*\n` +
      `${details || "Not provided"}\n` +
      `-----------------------------------------\n` +
      `_Sent via Beyond Studio Website_`;

    const whatsappUrl = `https://wa.me/919904799105?text=${encodeURIComponent(waText)}`;

    // 2. Deliver Email to beyondgraphicsrjk@gmail.com concurrently with keepalive
    const web3Key = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    try {
      if (web3Key) {
        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: web3Key,
            subject: `🚀 New Project Brief: ${name} (${service})`,
            from_name: name,
            name,
            email,
            phone: phone || "Not provided",
            company: company || "Individual",
            service,
            budget: chosenBudget || "Not specified",
            message: details,
          }),
          keepalive: true,
        }).catch((err) => console.warn("Web3Forms send error:", err));
      } else {
        // Direct FormSubmit endpoint to beyondgraphicsrjk@gmail.com
        fetch("https://formsubmit.co/ajax/beyondgraphicsrjk@gmail.com", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            _subject: `🚀 New Project Brief: ${name} (${service})`,
            _template: "table",
            _captcha: "false",
            "Client Name": name,
            "Email Address": email,
            "Phone / WhatsApp": phone || "Not provided",
            "Company / Brand": company || "Individual",
            "Service Requested": service,
            "Budget Range": chosenBudget || "Not specified",
            "Project Details": details,
          }),
          keepalive: true,
        }).catch((err) => console.warn("FormSubmit send error:", err));
      }
    } catch (err) {
      console.warn("Background email send error:", err);
    }

    setSubmittedData({
      name,
      email,
      phone,
      company,
      service,
      budget: chosenBudget,
      details,
      whatsappUrl,
    });

    setSent(true);
    setLoading(false);

    // 3. SYNCHRONOUSLY open WhatsApp immediately without popup blocker issues!
    const isMobile = typeof navigator !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = whatsappUrl;
    } else {
      const win = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      if (!win || win.closed || typeof win.closed === "undefined") {
        window.location.href = whatsappUrl;
      }
    }
  };

  return (
    <section id="contact" className="contact section-pad">
      <div className="contact-light" aria-hidden="true" />
      <div className="shell">
        <SectionLabel index="08">The next chapter</SectionLabel>
        <Reveal>
          <h2>LET’S BUILD<br />SOMETHING<br /><em>REMARKABLE.</em></h2>
        </Reveal>
        <a className="contact-lead" href="#project-brief">
          Start a project <ArrowRight />
        </a>
        <div className="contact-grid">
          <div className="contact-direct">
            <div className="contact-status-badge">
              <span className="pulse-dot" />
              <span>Available for new projects · 2026</span>
            </div>
            <p>Have an idea ready to move beyond the ordinary? Tell us where you want to go.</p>
            <div className="contact-channels">
              <a href="mailto:beyondgraphicsrjk@gmail.com">
                <span>Email enquiry</span>
                <strong>beyondgraphicsrjk@gmail.com <ArrowUpRight /></strong>
              </a>
              <a href="https://wa.me/919904799105" target="_blank" rel="noopener noreferrer">
                <span>WhatsApp / Call</span>
                <strong>+91 99047 99105 <ArrowUpRight /></strong>
              </a>
            </div>
            <div className="contact-studio-loc">
              <small>Studio Location</small>
              <address>SF-51, Suvarna Bhoomi, Speedwell Party Plot Chowk, Ambika Township Main Rd, Rajkot · 360005</address>
            </div>
          </div>

          {sent && submittedData ? (
            <div className="contact-form-card flex flex-col items-center text-center py-10 px-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                style={{
                  background: "rgba(198, 164, 74, 0.12)",
                  border: "1px solid #C6A44A",
                  boxShadow: "0 0 24px rgba(198, 164, 74, 0.25)",
                }}
              >
                <CheckCircle2 className="w-8 h-8 text-[#C6A44A]" />
              </div>

              <h3
                className="text-2xl md:text-3xl font-semibold uppercase tracking-tight text-white mb-3"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Project Brief Received!
              </h3>

              <p className="text-muted-foreground text-sm max-w-lg mb-8 leading-relaxed">
                Thank you, <strong className="text-white">{submittedData.name}</strong>. Your project brief has been sent to{" "}
                <span className="text-[#C6A44A] font-medium">beyondgraphicsrjk@gmail.com</span>. We review every brief carefully and respond within 24 hours.
              </p>

              {/* Dual Channel Actions: WhatsApp + Direct Email */}
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mb-6">
                <a
                  href={submittedData.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg font-bold text-sm tracking-wide transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: "#25D366",
                    color: "#050407",
                    boxShadow: "0 4px 20px rgba(37, 211, 102, 0.35)",
                  }}
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  Chat on WhatsApp
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setSubmittedData(null);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg font-medium text-xs uppercase tracking-wider text-muted-foreground hover:text-white border border-white/10 hover:border-white/25 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  New Enquiry
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                <ShieldCheck className="w-4 h-4 text-[#C6A44A]" />
                <span>Direct delivery to Dhaval Patel · Response in 24 hours</span>
              </div>
            </div>
          ) : (
            <form id="project-brief" className="contact-form-card" onSubmit={submit}>
              <div className="form-card-head">
                <h3>Project Brief</h3>
                <p>Share details about your brand, requirements & timeline.</p>
              </div>
              <div className="form-grid">
                <Field label="Your Name" name="name" placeholder="e.g. Dhaval Patel" required autoComplete="name" />
                <Field label="Email Address" name="email" type="email" placeholder="name@company.com" required autoComplete="email" />
                <Field label="Phone / WhatsApp" name="phone" type="tel" placeholder="+91 98765 43210" autoComplete="tel" />
                <Field label="Company / Brand" name="company" placeholder="e.g. Acme Studios" autoComplete="organization" />
                <label>
                  <span>Service <em>*</em></span>
                  <div className="select-wrap">
                    <select name="service" defaultValue="" required>
                      <option value="" disabled>Select a service</option>
                      <option>Brand strategy & Identity</option>
                      <option>Digital Design & UI/UX</option>
                      <option>Web Development</option>
                      <option>Print & Packaging</option>
                      <option>Complete Brand Experience</option>
                      <option>Not sure yet</option>
                    </select>
                    <ChevronDown aria-hidden="true" />
                  </div>
                </label>
                <div className="budget-group">
                  <label>
                    <span>Budget range</span>
                    <div className="input-wrap">
                      <input
                        name="budget"
                        placeholder="Select a tier or enter amount"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                      />
                    </div>
                  </label>
                  <div className="budget-chips" role="group" aria-label="Budget options">
                    {budgetPresets.map((b) => (
                      <button
                        key={b}
                        type="button"
                        className={`budget-chip ${budget === b ? "active" : ""}`}
                        onClick={() => setBudget(budget === b ? "" : b)}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <label className="details">
                <span>Project details <em>*</em></span>
                <div className="textarea-wrap">
                  <textarea
                    name="project details"
                    rows={4}
                    required
                    placeholder="Tell us about your brand, what you need built, key milestones, and timeline…"
                  />
                </div>
              </label>
              <div className="form-submit">
                <Button
                  variant="gold"
                  size="xl"
                  type="submit"
                  className="form-submit-cta"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending brief...</span>
                    </>
                  ) : (
                    <>
                      <span>Send project brief</span>
                      <ArrowRight />
                    </>
                  )}
                </Button>
                <div className="form-trust">
                  <ShieldCheck />
                  <span>Confidential · Direct to Creative Director · Response in 24h</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label>
      <span>
        {label}
        {required && <em>*</em>}
      </span>
      <div className="input-wrap">
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
        />
      </div>
    </label>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="shell footer-top">
        <div>
          <a href="#home" className="footer-logo brand-logo-link" aria-label="Beyond Studio Home">
            <BeyondLogo variant="full" height={42} />
          </a>
          <p>
            Independent creative direction, digital design and brand experiences for businesses ready to be remembered.
          </p>
          <span className="footer-location">
            SF-51, Suvarna Bhoomi, Speedwell Party Plot Chowk<br />
            Ambika Township Main Rd, Rajkot, Gujarat · 360005
          </span>
        </div>
        <div>
          <small>Navigate</small>
          {["Home", "About", "Services", "Work", "Process", "Contact"].map((x) => (
            <a key={x} href={`#${x.toLowerCase()}`}>
              {x}
            </a>
          ))}
        </div>
        <div>
          <small>Connect</small>
          <a href="mailto:beyondgraphicsrjk@gmail.com">Email</a>
          <a href="https://www.instagram.com/beyond_graphics._/" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="tel:+919904799105">Phone</a>
        </div>
      </div>

      <div className="shell footer-bottom">
        <span>© 2026 Beyond Graphics</span>
        <span>Design · Branding · Printing</span>
        <a href="#home">Back to top ↑</a>
      </div>

      {/* Interactive Morphing Particle Text Effect (Always "BEYOND STUDIO", color shifts dynamically) */}
      <div className="footer-particle-wrap" aria-label="Beyond Studio Wordmark">
        <ParticleTextEffect
          words={["BEYOND STUDIO"]}
          className="footer-particle-canvas"
        />
        {/* Note: To switch back to the swirling storm wordmark, swap with:
            <ParticleWordmark wordmark="BEYOND" mode="dark" className="footer-particle-iframe" /> */}
      </div>
    </footer>
  );
}