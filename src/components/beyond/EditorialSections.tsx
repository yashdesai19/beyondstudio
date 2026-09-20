import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import glamour from "@/assets/portfolio/glamour.webp";
import { AnimatedText } from "./AnimatedText";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

const services = [
  ["01","Brand strategy","Distinct positioning, identity systems and guidelines built to hold value across every touchpoint.","Strategy · Identity · Guidelines"],
  ["02","Digital design","Elegant digital systems shaped around attention, clarity and meaningful interaction.","UI/UX · Art direction · Systems"],
  ["03","Web development","Fast, expressive websites where design intent and technical craft move as one.","Websites · Commerce · Platforms"],
  ["04","Product experience","Useful, memorable experiences that turn complex ideas into simple interactions.","Research · UX · Prototyping"],
  ["05","Creative technology","New visual possibilities created through motion, interaction and emerging technology.","Motion · Experiments · Campaigns"],
];

export function Statement() { return <section id="statement" className="statement section-pad"><div className="shell"><SectionLabel index="01">Our point of view</SectionLabel><AnimatedText lines={[<>WE DON’T JUST</>,<>DESIGN <em>DIGITAL.</em></>,<>WE CREATE</>,<><em>EXPERIENCES.</em></>]}/><div className="statement-copy"><Reveal><p>We turn ambitious ideas into clear, confident brand worlds—designed to be felt across screens, spaces and every moment in between.</p></Reveal><ArrowDownRight /></div><div className="statement-rule" /></div></section>; }

export function About() { return <section id="about" className="about section-pad"><div className="shell"><SectionLabel index="02">Inside the studio</SectionLabel><div className="about-grid"><Reveal><div className="about-heading"><p className="kicker">Independent by design</p><h2>Small in size.<br/><em>Exacting</em> in vision.</h2></div></Reveal><Reveal delay={120}><div className="about-story"><p>Based in Rajkot, Beyond works where brand thinking, visual culture and technology meet. Every engagement stays hands-on from the first question to the final detail.</p><p>Nothing is handed down a production line. Typography, image, interaction and material are shaped as one connected experience.</p><a href="#contact">Meet your creative partner <ArrowRight /></a></div></Reveal><Reveal className="about-portrait" delay={180}><figure><img src={glamour} alt="Beyond studio identity work presented in a sculptural composition" loading="lazy"/><figcaption><span>Dhaval Patel</span> Founder & Creative Lead</figcaption></figure></Reveal></div><div className="stats"><Stat value="40+" label="Projects"/><Stat value="07" label="Industries"/><Stat value="06" label="Years of craft"/><Stat value="01" label="Connected experience"/></div></div></section>; }
function Stat({value,label}:{value:string;label:string}) { const ref=useRef<HTMLDivElement>(null);const [shown,setShown]=useState(false);useEffect(()=>{const node=ref.current;if(!node)return;const observer=new IntersectionObserver(([entry])=>{if(entry?.isIntersecting){setShown(true);observer.disconnect()}},{threshold:.5});observer.observe(node);return()=>observer.disconnect()},[]);return <div ref={ref} className={`stat ${shown?"counted":""}`}><strong>{value}</strong><span>{label}</span></div>; }

export function Services() { return <section id="services" className="services section-pad"><div className="shell"><SectionLabel index="03">What we do</SectionLabel><div className="section-intro"><h2>Ideas, made<br/><em>tangible.</em></h2><p>Strategy, design and technology kept in one conversation—so every expression carries the same intent.</p></div><div className="service-list">{services.map(([n,title,desc,tags])=><Reveal key={n}><article className="service-row" tabIndex={0}><i/><span>{n}</span><h3>{title}</h3><div><p>{desc}</p><small>{tags}</small></div><ArrowDownRight /></article></Reveal>)}</div></div></section>; }

const steps = [
 ["01","Discover","We listen closely—understanding the business, ambition and problem before drawing a line."],
 ["02","Strategy","We study audience, competitors and context to find a position worth owning."],
 ["03","Design","We shape a focused visual direction, then build it into a distinctive system."],
 ["04","Build","Design intent becomes a fast, precise and resilient experience across every format."],
 ["05","Launch","We refine, test and deliver everything required to enter the world with confidence."],
];
export function Process() { const [active,setActive]=useState(0);const refs=useRef<(HTMLElement|null)[]>([]);useEffect(()=>{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){const index=Number((entry.target as HTMLElement).dataset['index']);setActive(index)}}),{rootMargin:"-38% 0px -45%",threshold:0});refs.current.forEach(node=>node&&observer.observe(node));return()=>observer.disconnect()},[]);return <section id="process" className="process section-pad"><div className="shell"><SectionLabel index="05">How we work</SectionLabel><div className="process-grid"><div className="process-title"><p className="kicker">From idea to impact</p><h2>Clarity at<br/>every <em>step.</em></h2><div className="process-progress"><i style={{height:`${((active+1)/steps.length)*100}%`}}/></div></div><div className="process-steps">{steps.map(([n,t,d],i)=><article ref={node=>{refs.current[i]=node}} data-index={i} className={active===i?"active":""} key={n}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div></article>)}</div></div></div></section>; }

export function Industries() { return <section className="industries"><p>Ideas move across disciplines</p><div className="industry-track" aria-label="Creative disciplines"><span>Strategy <i/> Design <i/> Technology <i/> Experience <i/> Strategy <i/> Design <i/> Technology <i/> Experience <i/></span><span aria-hidden="true">Strategy <i/> Design <i/> Technology <i/> Experience <i/> Strategy <i/> Design <i/> Technology <i/> Experience <i/></span></div></section>; }
