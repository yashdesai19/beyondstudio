import { useEffect, useRef } from "react";

export function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let frame = 0, width = 0, height = 0, mx = .68, my = .42, scroll = 0;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const resize = () => { const dpr = Math.min(devicePixelRatio, 2); width = canvas.clientWidth; height = canvas.clientHeight; canvas.width = width*dpr; canvas.height=height*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); };
    const move = (e: PointerEvent) => { mx=e.clientX/innerWidth; my=e.clientY/innerHeight; };
    const onScroll = () => { scroll = Math.min(scrollY, innerHeight); };
    const draw = (t=0) => { ctx.clearRect(0,0,width,height); const x=width*(.57+mx*.1), y=height*(.35+my*.11)+scroll*.06; const g=ctx.createRadialGradient(x,y,0,x,y,width*.4); g.addColorStop(0,"rgba(210,177,104,.19)"); g.addColorStop(.28,"rgba(117,88,38,.08)"); g.addColorStop(1,"rgba(0,0,0,0)"); ctx.fillStyle=g;ctx.fillRect(0,0,width,height);
      ctx.save();ctx.translate(x,y);ctx.rotate(reduce?-.18:t/32000);ctx.strokeStyle="rgba(221,193,130,.22)";ctx.lineWidth=.65;
      for(let i=0;i<6;i++){ctx.beginPath(); const r=105+i*66; ctx.ellipse(0,0,r,r*(.2+i*.018),-.3+i*.105,0,Math.PI*2);ctx.stroke();}
      const core=ctx.createLinearGradient(-90,-150,100,160);core.addColorStop(0,"rgba(244,221,165,.04)");core.addColorStop(.48,"rgba(190,146,63,.3)");core.addColorStop(1,"rgba(77,58,27,.02)");ctx.fillStyle=core;ctx.beginPath();ctx.moveTo(-48,-170);ctx.lineTo(92,-52);ctx.lineTo(46,176);ctx.lineTo(-105,58);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(229,200,136,.34)";ctx.stroke();ctx.restore();
      ctx.fillStyle="rgba(229,200,136,.32)";for(let i=0;i<34;i++){const a=i*2.399+t/18000;const r=95+(i%9)*27;ctx.beginPath();ctx.arc(x+Math.cos(a)*r,y+Math.sin(a)*r*.34,(i%3)*.35+.35,0,Math.PI*2);ctx.fill();}
      if(!reduce) frame=requestAnimationFrame(draw);
    };
    resize(); draw(); addEventListener("resize",resize); addEventListener("pointermove",move,{passive:true});addEventListener("scroll",onScroll,{passive:true});
    return()=>{cancelAnimationFrame(frame);removeEventListener("resize",resize);removeEventListener("pointermove",move);removeEventListener("scroll",onScroll);};
  },[]);
  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
}
