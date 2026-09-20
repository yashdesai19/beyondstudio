import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import keyaa from "@/assets/portfolio/keyaa.webp";
import glamour from "@/assets/portfolio/glamour.webp";
import ratnamira from "@/assets/portfolio/ratnamira.webp";
import scentobelle from "@/assets/portfolio/scentobelle.webp";
import wildTrek from "@/assets/portfolio/wild-trek.webp";
import pawNuffs from "@/assets/portfolio/paw-nuffs.webp";
import coolCraze from "@/assets/portfolio/cool-craze.webp";
import divineNature from "@/assets/portfolio/divine-nature.webp";

const projects = [
 {name:"Keyaa",cat:"Branding",desc:"Skincare brand identity & signage",year:"2025",img:keyaa,shape:"wide"},
 {name:"Glamour",cat:"Branding",desc:"Beauty salon identity system",year:"2025",img:glamour,shape:"tall"},
 {name:"Ratnamira Jewels",cat:"Branding",desc:"Luxury jewellery brand identity",year:"2024",img:ratnamira,shape:"standard"},
 {name:"Scentobelle",cat:"Packaging",desc:"Perfume identity & packaging",year:"2025",img:scentobelle,shape:"standard"},
 {name:"Wild Trek",cat:"Branding",desc:"Outdoor apparel brand world",year:"2024",img:wildTrek,shape:"tall"},
 {name:"Paw Nuffs",cat:"Packaging",desc:"Pet care packaging system",year:"2025",img:pawNuffs,shape:"wide"},
 {name:"Cool Craze",cat:"Packaging",desc:"Sparkling water packaging",year:"2025",img:coolCraze,shape:"standard"},
 {name:"Divine Nature",cat:"Packaging",desc:"Organic skincare packaging",year:"2024",img:divineNature,shape:"standard"},
];
export function Portfolio(){
 const [filter,setFilter]=useState("All"),[selected,setSelected]=useState<(typeof projects)[number]|null>(null);
 const shown=filter==="All"?projects:projects.filter(p=>p.cat===filter);
 useEffect(()=>{ if(!selected)return; const close=(e:KeyboardEvent)=>{if(e.key==="Escape")setSelected(null)};addEventListener("keydown",close);document.body.style.overflow="hidden";return()=>{removeEventListener("keydown",close);document.body.style.overflow=""}},[selected]);
 return <section id="work" className="portfolio section-pad"><div className="shell"><SectionLabel index="04">Selected work</SectionLabel><div className="portfolio-head"><h2>Made to be<br/><em>noticed.</em></h2><div className="filters" role="group" aria-label="Filter projects">{["All","Branding","Packaging"].map(x=><button key={x} className={filter===x?"active":""} onClick={()=>setFilter(x)}>{x}</button>)}</div></div><div className="project-grid">{shown.map((p,i)=><Reveal key={p.name} className={`project-wrap ${p.shape}`} delay={(i%3)*80}><button className="project-card" onClick={()=>setSelected(p)} aria-label={`View ${p.name} project`}><div className="project-image"><img src={p.img} alt={`${p.name} — ${p.desc}`} loading={i>1?"lazy":"eager"}/><span className="view-project">View <ArrowUpRight/></span></div><div className="project-meta"><span>0{i+1}</span><div><h3>{p.name}</h3><p>{p.desc}</p></div><small>{p.cat} · {p.year}</small></div></button></Reveal>)}</div></div>{selected&&<div className="project-modal" role="dialog" aria-modal="true" aria-label={`${selected.name} project`} onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}><Button variant="iconDark" size="icon" onClick={()=>setSelected(null)} aria-label="Close project"><X/></Button><div className="modal-inner"><img src={selected.img} alt={`${selected.name} project presentation`}/><div><p>{selected.cat} · {selected.year}</p><h2>{selected.name}</h2><span>{selected.desc}</span></div></div></div>}</section>
}
