import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import PhilosophyParticles from './PhilosophyParticles';

const statements = [
  "I don't build websites.",
  "I build systems.",
  "I build experiences.",
  "I solve problems."
];

export default function Philosophy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-bg z-20">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        <PhilosophyParticles scrollYProgress={scrollYProgress} />

        
        {statements.map((statement, index) => {
          // Calculate the scroll range for each statement
          // Each statement gets a quarter of the scroll progress
          const start = index * 0.25;
          const end = (index + 1) * 0.25;
          
          // Fade in and out within its range
          const opacity = useTransform(
            scrollYProgress,
            [start, start + 0.05, end - 0.05, end],
            [0, 1, 1, 0]
          );
          
          // Subtle scale down
          const scale = useTransform(
            scrollYProgress,
            [start, end],
            [1.1, 0.9]
          );

          // Subtle upward movement
          const y = useTransform(
            scrollYProgress,
            [start, end],
            [20, -20]
          );

          return (
            <motion.h2
              key={index}
              style={{ opacity, scale, y }}
              className="absolute text-5xl md:text-8xl lg:text-[8rem] font-bold tracking-tighter text-center w-full px-6"
            >
              {index === 0 ? (
                <span className="text-text-muted">{statement}</span>
              ) : (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-text-primary via-accent-cyan to-accent-purple">
                  {statement}
                </span>
              )}
            </motion.h2>
          );
        })}

        {/* Cinematic noise overlay just for this section */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
      </div>
    </section>
  );
}
