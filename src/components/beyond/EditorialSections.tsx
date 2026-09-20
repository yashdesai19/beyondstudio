import { ArrowDownRight, ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

const services = [
  ["01","Identity & branding","Distinct identities, visual systems and guidelines built to hold their value across every touchpoint.","Logo systems · Strategy · Guidelines"],
  ["02","Packaging design","Shelf-ready packaging that balances visual impact, clarity and the realities of production.","Boxes · Labels · Product presentation"],
  ["03","Print & editorial","Tactile brand experiences, from business stationery to catalogues, signage and campaigns.","Catalogues · Signage · Collateral"],
  ["04","Social & campaigns","Cohesive creative direction for launches, advertising and everyday social communication.","Campaigns · Digital ads · Social"],
  ["05","Business design","Polished profiles, presentations and sales material that make every conversation feel considered.","Profiles · Presentations · Stationery"],
  ["06","Creative direction","One clear visual language carried from the first idea through artwork, production and delivery.","Concept · Art direction · Production"],
];

export function Statement() { return <section id="statement" className="statement section-pad"><div className="shell"><SectionLabel index="01">What we believe</SectionLabel><Reveal><h2>WE BUILD BRANDS<br/>PEOPLE <em>REMEMBER.</em></h2></Reveal><div className="statement-copy"><Reveal><p>Beyond turns business ideas into clear, confident visual identities—designed to work beautifully on screen, on a shelf and in a customer’s hands.</p></Reveal><ArrowDownRight /></div></div></section>; }

export function About() { return <section id="about" className="about section-pad"><div className="shell"><SectionLabel index="02">Inside the studio</SectionLabel><div className="about-grid"><Reveal><div><p className="kicker">Independent by design</p><h2>A focused studio with a wider point of view.</h2></div></Reveal><Reveal delay={120}><div className="about-story"><p>Based in Rajkot, Gujarat, Beyond works across branding, packaging, print and advertising. Every engagement stays hands-on from the first conversation through final production.</p><p>That means the details don’t get diluted. Typography, colour, material and layout are considered as one connected system—not isolated deliverables.</p><a href="#contact">Meet your creative partner <ArrowRight /></a></div></Reveal><Reveal delay={220}><aside className="founder"><span>DP</span><div><small>Founder & Creative Lead</small><h3>Dhaval Patel</h3><p>Directing every project with a detail-led approach and a practical understanding of both digital and print.</p></div></aside></Reveal></div><div className="stats"><Stat value="40+" label="Brand identities"/><Stat value="07" label="Industries served"/><Stat value="06" label="Creative disciplines"/><Stat value="01" label="Focused studio"/></div></div></section>; }
function Stat({value,label}:{value:string;label:string}) { return <Reveal><div className="stat"><strong>{value}</strong><span>{label}</span></div></Reveal>; }

export function Services() { return <section id="services" className="services section-pad"><div className="shell"><SectionLabel index="03">What we do</SectionLabel><div className="section-intro"><h2>One studio.<br/><em>Every expression.</em></h2><p>Brand thinking and production craft, kept under one roof so every piece speaks the same visual language.</p></div><div className="service-list">{services.map(([n,title,desc,tags])=><Reveal key={n}><article className="service-row" tabIndex={0}><span>{n}</span><h3>{title}</h3><div><p>{desc}</p><small>{tags}</small></div><ArrowDownRight /></article></Reveal>)}</div></div></section>; }

const steps = [
 ["01","Discover","We listen closely—understanding the business, ambition and problem before drawing a line."],
 ["02","Research","We study audience, competitors and context to find a position worth owning."],
 ["03","Concept","We develop a small set of meaningful visual directions, never a pile of decoration."],
 ["04","Design","The chosen direction becomes a precise, flexible system across every required format."],
 ["05","Refine","Feedback is applied with intention until every detail earns its place."],
 ["06","Deliver","Production-ready files arrive organised, practical and ready for screen or print."],
];
export function Process() { return <section id="process" className="process section-pad"><div className="shell"><SectionLabel index="05">How we work</SectionLabel><div className="process-grid"><div className="process-title"><p className="kicker">From idea to impact</p><h2>Clarity at<br/>every <em>step.</em></h2></div><div className="process-steps">{steps.map(([n,t,d],i)=><Reveal key={n} delay={i*40}><article><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div></article></Reveal>)}</div></div></div></section>; }

export function Industries() { return <section className="industries"><p>Built for businesses across</p><div className="industry-track" aria-label="Industries served">Technology <i/> Healthcare <i/> Real estate <i/> Retail <i/> Manufacturing <i/> Hospitality <i/> Education <i/> Food & beverage</div></section>; }
