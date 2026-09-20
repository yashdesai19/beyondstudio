import { useEffect, useRef } from "react";

export function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let frame = 0, width = 0, height = 0, mx = .66, my = .4;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const resize = () => { const dpr = Math.min(devicePixelRatio, 2); width = canvas.clientWidth; height = canvas.clientHeight; canvas.width = width*dpr; canvas.height=height*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); };
    const move = (e: PointerEvent) => { mx=e.clientX/innerWidth; my=e.clientY/innerHeight; };
    const draw = (t=0) => { ctx.clearRect(0,0,width,height); const x=width*(.58+mx*.12), y=height*(.38+my*.1); const g=ctx.createRadialGradient(x,y,0,x,y,width*.42); g.addColorStop(0,"rgba(199,167,101,.16)"); g.addColorStop(.35,"rgba(106,83,40,.07)"); g.addColorStop(1,"rgba(0,0,0,0)"); ctx.fillStyle=g;ctx.fillRect(0,0,width,height);
      ctx.strokeStyle="rgba(218,190,127,.18)";ctx.lineWidth=.7;
      for(let i=0;i<7;i++){ctx.beginPath(); const r=120+i*72; ctx.ellipse(x,y,r,r*.32,(-.35+i*.13)+(reduce?0:Math.sin(t/5000+i)*.06),0,Math.PI*2);ctx.stroke();}
      if(!reduce) frame=requestAnimationFrame(draw);
    };
    resize(); draw(); addEventListener("resize",resize); addEventListener("pointermove",move,{passive:true});
    return()=>{cancelAnimationFrame(frame);removeEventListener("resize",resize);removeEventListener("pointermove",move);};
  },[]);
  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
}
