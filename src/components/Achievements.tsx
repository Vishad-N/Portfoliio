import { motion, useInView } from 'motion/react';
import { useRef, useEffect, useState } from 'react';

function Counter({ from, to, suffix = "", text }: { from: number, to: number, suffix?: string, text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number;
      const duration = 2000; // 2 seconds

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Easing function (easeOutExpo)
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        setCount(Math.floor(easeProgress * (to - from) + from));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      
      window.requestAnimationFrame(step);
    }
  }, [isInView, from, to]);

  return (
    <div ref={ref} className="flex flex-col">
      <div className="text-6xl md:text-8xl font-bold tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-br from-text-primary to-text-muted">
        {count}{suffix}
      </div>
      <div className="text-sm md:text-base font-mono tracking-[0.2em] uppercase text-accent-cyan">
        {text}
      </div>
    </div>
  );
}

export default function Achievements() {
  return (
    <section className="py-32 relative z-20 bg-bg border-y border-glass-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          <Counter from={0} to={15} suffix="+" text="Projects" />
          <Counter from={0} to={5} suffix="+" text="Deployments" />
          <Counter from={0} to={1000} suffix="+" text="Dev Hours" />
          <Counter from={0} to={10} suffix="+" text="Technologies" />
        </div>
      </div>
    </section>
  );
}
