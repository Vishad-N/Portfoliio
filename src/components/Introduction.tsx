import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import DynamicWatermark from './DynamicWatermark';

export default function Introduction() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [200, -200]);

  return (
    <section ref={containerRef} className="py-32 md:py-48 relative z-10 overflow-hidden">
      <DynamicWatermark />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <div className="lg:col-span-5 relative">
            <div className="overflow-hidden">
              <motion.h2 
                initial={{ y: '100%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl md:text-7xl font-bold tracking-tighter"
              >
                WHO<br />
                <span className="text-accent-cyan">I AM.</span>
              </motion.h2>
            </div>
            <motion.div 
              style={{ y: y1 }}
              className="absolute -top-20 -left-20 w-64 h-64 bg-accent-purple/5 rounded-full blur-[80px]"
            />
          </div>

          <div className="lg:col-span-7 relative">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-2xl leading-relaxed text-text-muted font-light space-y-8 max-w-2xl"
            >
              <p>
                I am an engineer deeply fascinated by the intersection of intelligent systems and human-centric design. I don't just write code; I architect solutions that scale, perform, and deliver impact.
              </p>
              <p>
                My expertise spans across the entire stack—from crafting pixel-perfect interfaces in React to building robust, high-performance backends with Spring Boot and Node.js. 
              </p>
              <p className="text-text-primary font-medium">
                Recently, my focus has been on integrating AI models into practical applications, transforming complex workflows into seamless automated experiences.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Floating elements to give an editorial feel */}
        <motion.div 
          style={{ y: y2 }}
          className="absolute right-10 md:right-20 bottom-0 lg:top-1/2 w-48 h-64 border border-glass-border rounded-lg bg-glass backdrop-blur-md hidden md:flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-accent-cyan/10 to-accent-purple/10 mix-blend-overlay" />
          <span className="font-mono text-xs text-text-muted rotate-90 tracking-widest uppercase">
            System Architect
          </span>
        </motion.div>
      </div>
    </section>
  );
}
