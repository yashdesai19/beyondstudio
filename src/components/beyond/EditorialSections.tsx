import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { AnimatedText } from "./AnimatedText";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";
import { useCountUp } from "@/hooks/use-counter";

function StatementRule() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return <div ref={ref} className={cn("statement-rule", visible && "is-visible")} />;
}

// Signature 4-petal floral bullet icon matching the client's graphic
function FlowerBullet() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      className="beyond-service-bullet"
      aria-hidden="true"
    >
      <circle cx="5" cy="5" r="2.6" fill="var(--primary, #C6A44A)" />
      <circle cx="11" cy="5" r="2.6" fill="var(--primary, #C6A44A)" />
      <circle cx="5" cy="11" r="2.6" fill="var(--primary, #C6A44A)" />
      <circle cx="11" cy="11" r="2.6" fill="var(--primary, #C6A44A)" />
      <circle cx="8" cy="8" r="1.3" fill="#0c0b11" />
    </svg>
  );
}

// Authentic Services Data
const servicesData = [
  {
    category: "Graphic Design",
    description: "Creative visual communication crafted with distinction, clarity, and commercial impact.",
    items: [
      "Logo Design",
      "Visiting Card Design",
      "Brochure Design",
      "Flyer / Leaflet Design",
      "Poster & Banner Design",
      "Social Media Design",
      "Catalogue Design",
    ],
  },
  {
    category: "Branding",
    description: "Comprehensive identity architecture, color standards, packaging, and brand guidelines.",
    items: [
      "Brand Identity Design",
      "Brand Colour & Typography System",
      "Brand Guidelines",
      "Packaging Design",
      "Product Label Design",
    ],
  },
  {
    category: "Printing Solutions",
    description: "High-grade commercial print manufacturing, precision finishes, and tactile materials.",
    items: [
      "Visiting Cards",
      "Bill Books",
      "Brochures & Catalogues",
      "Flyers & Leaflets",
      "Posters & Banners",
      "Stickers & Labels",
      "Packaging Printing",
    ],
  },
];

export function Statement() {
  return (
    <section id="statement" className="statement section-pad">
      <div className="shell">
        <SectionLabel index="01">Our point of view</SectionLabel>
        <AnimatedText
          lines={[
            <>WE DON’T JUST</>,
            <>DESIGN <em>DIGITAL.</em></>,
            <>WE CREATE</>,
            <><em>EXPERIENCES.</em></>,
          ]}
        />
        <div className="statement-copy">
          <Reveal>
            <p>
              We turn ambitious ideas into clear, confident brand worlds—designed
              to be felt across screens, spaces and every moment in between.
            </p>
          </Reveal>
          <ArrowDownRight />
        </div>
        <StatementRule />
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="about section-pad">
      <div className="shell">
        <SectionLabel index="02">Inside the studio</SectionLabel>
        
        <div className="about-grid">
          <Reveal>
            <div className="about-heading">
              <p className="kicker">Independent by design</p>
              <h2>Small in size.<br /><em>Exacting</em> in vision.</h2>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="about-story">
              <p>
                Based in Rajkot, Beyond works where brand thinking, visual
                culture and technology meet. Every engagement stays hands-on
                from the first question to the final detail.
              </p>
              <p>
                Nothing is handed down a production line. Typography, image,
                interaction and material are shaped as one connected experience.
              </p>
              <a href="#contact">Meet your creative partner <ArrowRight /></a>
            </div>
          </Reveal>
        </div>

        {/* Authentic Mission & Vision Presentation Card */}
        <Reveal delay={160}>
          <div className="beyond-mv-card">
            <div className="beyond-mv-header">
              <div className="beyond-mv-tag">
                <span className="beyond-mv-dot" />
                <span>Core Purpose & Vision</span>
              </div>
              <img
                src="/beyondicon.svg"
                alt="Beyond Studio"
                className="beyond-mv-icon"
                draggable={false}
              />
            </div>

            <div className="beyond-mv-grid">
              <div className="beyond-mv-col">
                <h3 className="beyond-mv-title">Our Mission:</h3>
                <p className="beyond-mv-text">
                  Our mission is to provide <strong>creative, high-quality graphic design and reliable printing solutions</strong> that help businesses present their brand professionally and grow with confidence.
                </p>
              </div>

              <div className="beyond-mv-divider" />

              <div className="beyond-mv-col">
                <h3 className="beyond-mv-title">Our Vision:</h3>
                <p className="beyond-mv-text">
                  Our vision is to become a <strong>trusted design and branding partner for businesses</strong>, recognized for creativity, quality work, and professional service.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="stats">
          <Stat value="40+" label="Projects" />
          <Stat value="07" label="Industries" />
          <Stat value="06" label="Years of craft" />
          <Stat value="01" label="Connected experience" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  const numericPart = parseInt(value.replace(/\D/g, ""), 10) || 0;
  const suffix = value.replace(/[\d]/g, "");
  const hasLeadingZero = value.startsWith("0") && numericPart < 10;
  const { count, ref } = useCountUp(numericPart, 1800);

  const formattedCount = hasLeadingZero
    ? `0${count}`
    : `${count}${suffix}`;

  return (
    <div ref={ref} className="stat counted">
      <strong>{formattedCount}</strong>
      <span>{label}</span>
    </div>
  );
}

function ServiceCard({ s, idx }: { s: typeof servicesData[0]; idx: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={cardRef}
      className="beyond-service-card"
      onPointerMove={handlePointerMove}
    >
      <div className="beyond-service-spotlight" aria-hidden="true" />
      <div className="beyond-service-head">
        <span className="beyond-service-count">0{idx + 1} / Pillar</span>
        <h3 className="beyond-service-title">{s.category}</h3>
        <p className="beyond-service-desc">{s.description}</p>
      </div>

      <div className="beyond-service-divider" />

      <ul className="beyond-service-list">
        {s.items.map((item) => (
          <li key={item} className="beyond-service-item">
            <FlowerBullet />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Services() {
  return (
    <section id="services" className="services section-pad">
      <div className="shell">
        <SectionLabel index="03">What we do</SectionLabel>
        
        <div className="section-intro">
          <h2>Our <em>Services:</em></h2>
          <p>
            Creative, high-quality graphic design and reliable printing solutions
            designed to help businesses present their brand professionally.
          </p>
        </div>

        {/* 3-Column Luxury Architecture for Our Services */}
        <div className="beyond-services-grid">
          {servicesData.map((s, idx) => (
            <Reveal key={s.category} delay={idx * 120}>
              <ServiceCard s={s} idx={idx} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// SVG Icons for Process & Best Practices
function IconMegaphone() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3 11 18-5v12L3 13v-2z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}

function IconChessKnight() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 22H5v-2h14v2z" />
      <path d="M6 20c0-4 2-7 5-8 0 0-3-1-3-4a4 4 0 0 1 7-2.6c1.2.9 2 2.3 2 3.6 0 2-1 3-1 3s3 2 3 8" />
    </svg>
  );
}

function IconSpeedClock() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
      <path d="M4.93 4.93 3 3" />
      <path d="M2 8h3" />
    </svg>
  );
}

function IconQualityCheck() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <polyline points="8 11 10 13 14 9" />
    </svg>
  );
}

function IconGrowthChart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <path d="M4 18 10 12l4 4 6-6" />
      <polyline points="16 6 20 6 20 10" />
    </svg>
  );
}

function IconBrief() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function IconLightbulb() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
    </svg>
  );
}

function IconPresentation() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 3h20" />
      <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
      <path d="m7 21 5-5 5 5" />
    </svg>
  );
}

function IconFeedbackChat() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconThumbsUp() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

function IconAssetBox() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

// Authentic Data: Our Work Process (Client Graphic 2)
const workProcessSteps = [
  {
    num: "01",
    title: "1. Understanding Requirements",
    desc: "We understand the client's business, goals, and design requirements.",
  },
  {
    num: "02",
    title: "2. Research & Concept Development",
    desc: "Creative concepts are developed based on brand needs.",
  },
  {
    num: "03",
    title: "3. Design Creation",
    desc: "Professional and visually appealing designs are created.",
  },
  {
    num: "04",
    title: "4. Feedback & Revisions",
    desc: "Client feedback is incorporated to achieve the best results.",
  },
  {
    num: "05",
    title: "5. Final Delivery / Printing",
    desc: "Final design files or printed materials are delivered with quality assurance.",
  },
];

// Authentic Data: Key Steps in Our Branding Process (Client Graphic 1)
const brandingProcessSteps = [
  {
    step: "01",
    title: "Detailed project briefing",
    desc: "Including research on the target audience, competitors, and client's visual preferences.",
    color: "#E5A93C",
    icon: IconBrief,
  },
  {
    step: "02",
    title: "Ideation",
    desc: "Generating initial ideas and developing concepts in the digital form.",
    color: "#E06D53",
    icon: IconLightbulb,
  },
  {
    step: "03",
    title: "Presentation of concepts and written rationale",
    desc: "Closely aligned with the client's brief, for their consideration.",
    color: "#C49A6C",
    icon: IconPresentation,
  },
  {
    step: "04",
    title: "Feedback / revisions",
    desc: "Allowing for up to three rounds of feedback to refine and improve the concepts.",
    color: "#4A6B82",
    icon: IconFeedbackChat,
  },
  {
    step: "05",
    title: "Finalisation / sign-off",
    desc: "Where the chosen concept is finalized and approved by the client.",
    color: "#3BA99C",
    icon: IconThumbsUp,
  },
  {
    step: "06",
    title: "Supply of digital brand assets",
    desc: "including logo files, fonts, style guide, and iconographic/illustrative elements, for the client's future reference.",
    color: "#45B6C4",
    icon: IconAssetBox,
  },
];

// Authentic Data: Best Practices (Client Graphic 3)
const bestPracticesData = [
  {
    id: "01",
    title: "Clear Communication",
    icon: IconMegaphone,
    desc: "We prioritize effective and transparent communication with our clients, ensuring a comprehensive understanding of their needs, goals, and expectations. We maintain open lines of communication throughout the project, providing regular updates and actively seeking feedback to ensure alignment.",
  },
  {
    id: "02",
    title: "Strategic Planning",
    icon: IconChessKnight,
    desc: "Before initiating any project, we conduct thorough research and analysis to develop a tailored strategic plan that aligns with our client's specific requirements. This strategic approach ensures that our creative solutions align with the client's objectives and resonate with their target audience.",
  },
  {
    id: "03",
    title: "Timely Delivery",
    icon: IconSpeedClock,
    desc: "We recognize the importance of meeting deadlines and delivering projects on time. Our project management team utilizes effective scheduling and monitoring tools to track progress, manage resources, and ensure the timely completion of our services.",
  },
  {
    id: "04",
    title: "Quality Assurance",
    icon: IconQualityCheck,
    desc: "We have stringent quality control measures in place to maintain the highest standards of quality throughout our creative process. Our dedicated quality assurance team conducts thorough checks at each stage to ensure accuracy, consistency, and adherence to the client's requirements.",
  },
  {
    id: "05",
    title: "Continuous Improvement",
    icon: IconGrowthChart,
    desc: "We believe in continuous learning and improvement. We regularly evaluate our processes, seek client feedback, and implement lessons learned to enhance our services and consistently exceed client expectations.",
  },
];

export function Process() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      // Focus target point at 45% of the viewport height
      const triggerY = window.innerHeight * 0.45;
      let closestIdx = 0;
      let minDistance = Infinity;

      refs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height * 0.5;
        const distance = Math.abs(elementCenter - triggerY);

        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = idx;
        }
      });

      setActive(closestIdx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="process" className="process section-pad">
      <div className="shell">
        <SectionLabel index="05">Our process</SectionLabel>

        {/* 1. OUR WORK PROCESS (Client Graphic 2) */}
        <div className="process-work-section">
          <div className="process-work-header">
            <div className="process-work-intro">
              <p className="kicker">Execution Framework</p>
              <h2>Our Work <em>Process.</em></h2>
            </div>
            <div className="process-beyond-mark">
              <img
                src="/beyondicon.svg"
                alt="Beyond Studio Mark"
                className="beyond-process-icon"
                draggable={false}
              />
            </div>
          </div>

          <div className="process-work-grid">
            <div className="process-steps">
              {workProcessSteps.map((step, i) => (
                <article
                  ref={(node) => { refs.current[i] = node; }}
                  data-index={i}
                  className={active === i ? "active" : ""}
                  key={step.num}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                >
                  <span>{step.num}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </article>
              ))}
            </div>

            {/* Character Showcase right side like in Graphic 2 */}
            <div className="process-character-card">
              <div className="process-character-image-wrap">
                <img
                  src="/creative-character.jpg"
                  alt="Creative Design & Print Execution"
                  className="process-character-img"
                  draggable={false}
                />
              </div>
              <div className="process-character-meta">
                <span className="process-character-badge">
                  Stage 0{active + 1} of 05
                </span>
                <h4>{workProcessSteps[active].title.replace(/^\d+\.\s*/, "")}</h4>
                <p>{workProcessSteps[active].desc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. KEY STEPS IN OUR BRANDING PROCESS (Client Graphic 1) */}
        <div className="branding-process-block">
          <div className="branding-process-head">
            <div className="beyond-mv-tag">
              <span className="beyond-mv-dot" />
              <span>Identity Architecture</span>
            </div>
            <h2>Key steps in our <em>branding process.</em></h2>
            <p>A rigorous, systematic path that transforms your ambition into an unforgettable brand identity.</p>
          </div>

          <div className="branding-steps-grid">
            {brandingProcessSteps.map((s, idx) => {
              const IconComp = s.icon;
              return (
                <Reveal key={s.step} delay={idx * 70}>
                  <div className="branding-step-card">
                    <div className="branding-step-head">
                      <div
                        className="branding-step-icon-wrap"
                        style={{
                          backgroundColor: `${s.color}1c`,
                          borderColor: `${s.color}55`,
                          color: s.color,
                        }}
                      >
                        <IconComp />
                      </div>
                      <span className="branding-step-index">{s.step}</span>
                    </div>
                    <h3 className="branding-step-title">{s.title}</h3>
                    <p className="branding-step-desc">{s.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <div className="branding-dome-badge">
            <span className="branding-dome-pill">Branding</span>
          </div>
        </div>

        {/* 3. BEST PRACTICES UTILIZED WHEN SERVICING CLIENTS (Client Graphic 3) */}
        <div className="best-practices-block">
          <div className="best-practices-head">
            <div className="beyond-mv-tag">
              <span className="beyond-mv-dot" />
              <span>Excellence & Quality</span>
            </div>
            <h2>Best practices utilized <em>when servicing clients.</em></h2>
            <div className="best-practices-intro-card">
              <p>
                At <strong>Beyond</strong>, we adhere to well-defined international best practices to efficiently manage workflows and surpass expectations. Our approach encompasses the following key elements:
              </p>
            </div>
          </div>

          <div className="best-practices-grid">
            {bestPracticesData.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <Reveal key={item.id} delay={idx * 80}>
                  <div className="best-practice-card">
                    <div className="best-practice-icon-circle">
                      <IconComp />
                    </div>
                    <span className="best-practice-count">0{idx + 1} / Standard</span>
                    <h3 className="best-practice-title">{item.title}</h3>
                    <p className="best-practice-desc">{item.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <div className="best-practices-closing-banner">
            <p>
              By adhering to these best practices, we strive to provide exceptional service to our clients, ensuring that their projects are executed efficiently, effectively, and with the utmost quality.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}


const whyBeyondData = {
  whyChoose: {
    title: "Why Choose Beyond",
    tagline: "End-to-end creative excellence built to elevate your market presence.",
    badge: "01 / Advantage",
    items: [
      "Creative & Professional Designs",
      "Complete Design to Print Solution",
      "High Quality Printing",
      "Fast Turnaround Time",
      "Affordable Pricing",
      "Client-Focused Approach",
    ],
  },
  industries: {
    title: "Industries We Serve",
    tagline: "Tailored branding and print systems built for distinct commercial sectors.",
    badge: "02 / Sectors",
    items: [
      "Restaurants & Cafes",
      "Retail Businesses",
      "Startups",
      "Corporate Companies",
      "Real Estate",
      "Education Institutes",
      "Local Businesses",
    ],
  },
  strengths: {
    title: "Our Strengths",
    tagline: "Core competencies honed over years of focused design & print execution.",
    badge: "03 / Craft & Care",
    items: [
      "Creative Thinking",
      "Professional Design Approach",
      "Reliable Printing Solutions",
      "Attention to Detail",
      "Customer Satisfaction",
    ],
  },
};

export function Industries() {
  return (
    <section id="why-beyond" className="why-beyond section-pad">
      <div id="industries" style={{ position: "relative", top: "-100px" }} />
      <div className="shell">
        <SectionLabel index="06">Why Beyond & Industries</SectionLabel>

        {/* Section Header with Beyond Icon in top right matching client graphic */}
        <div className="why-beyond-header">
          <div className="why-beyond-intro">
            <p className="kicker">The Studio Advantage</p>
            <h2>Built to grow your<br /><em>brand with confidence.</em></h2>
          </div>
          <div className="why-beyond-logo-mark">
            <img
              src="/beyondicon.svg"
              alt="Beyond Studio Mark"
              className="why-beyond-icon"
              draggable={false}
            />
          </div>
        </div>

        {/* 3 Pillars Grid: Why Choose Beyond | Industries We Serve | Our Strengths */}
        <div className="why-beyond-grid">
          {/* Pillar 1: Why Choose Beyond */}
          <Reveal delay={0}>
            <div className="beyond-service-card why-beyond-card">
              <div className="beyond-service-head">
                <span className="beyond-service-count">{whyBeyondData.whyChoose.badge}</span>
                <h3 className="beyond-service-title">{whyBeyondData.whyChoose.title}</h3>
                <p className="beyond-service-desc">{whyBeyondData.whyChoose.tagline}</p>
              </div>

              <div className="beyond-service-divider" />

              <ul className="beyond-service-list">
                {whyBeyondData.whyChoose.items.map((item) => (
                  <li key={item} className="beyond-service-item">
                    <FlowerBullet />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Pillar 2: Industries We Serve */}
          <Reveal delay={120}>
            <div className="beyond-service-card why-beyond-card featured">
              <div className="beyond-service-head">
                <span className="beyond-service-count">{whyBeyondData.industries.badge}</span>
                <h3 className="beyond-service-title">{whyBeyondData.industries.title}</h3>
                <p className="beyond-service-desc">{whyBeyondData.industries.tagline}</p>
              </div>

              <div className="beyond-service-divider" />

              <ul className="beyond-service-list">
                {whyBeyondData.industries.items.map((item) => (
                  <li key={item} className="beyond-service-item">
                    <FlowerBullet />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Pillar 3: Our Strengths with Studio Character Accent */}
          <Reveal delay={240}>
            <div className="beyond-service-card why-beyond-card has-character">
              <div className="beyond-service-head">
                <span className="beyond-service-count">{whyBeyondData.strengths.badge}</span>
                <h3 className="beyond-service-title">{whyBeyondData.strengths.title}</h3>
                <p className="beyond-service-desc">{whyBeyondData.strengths.tagline}</p>
              </div>

              <div className="beyond-service-divider" />

              <ul className="beyond-service-list">
                {whyBeyondData.strengths.items.map((item) => (
                  <li key={item} className="beyond-service-item">
                    <FlowerBullet />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Bottom Character Illustration matching reference graphic */}
              <div className="why-beyond-character-badge">
                <img
                  src="/creative-character.jpg"
                  alt="Creative Design & Print Craft"
                  className="why-beyond-character-img"
                  draggable={false}
                />
                <div className="why-beyond-character-text">
                  <strong>Dedicated Craft</strong>
                  <span>From concept to final print delivery</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Marquee Discipline Strip */}
      <div className="industry-marquee-strip">
        <p>Empowering Brands Across Industries</p>
        <div className="industry-track" aria-label="Creative disciplines and industries">
          <span>Restaurants & Cafes <i /> Retail Businesses <i /> Startups <i /> Corporate Companies <i /> Real Estate <i /> Education Institutes <i /> Local Businesses <i /></span>
          <span aria-hidden="true">Restaurants & Cafes <i /> Retail Businesses <i /> Startups <i /> Corporate Companies <i /> Real Estate <i /> Education Institutes <i /> Local Businesses <i /></span>
        </div>
      </div>
    </section>
  );
}

export const WhyBeyond = Industries;

