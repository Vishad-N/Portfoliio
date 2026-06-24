import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { cn } from '../utils';

const timelineData = [
  {
    year: '2023',
    title: 'Started learning web development',
    description: 'Began the journey into the fundamentals of the web. Mastered core web technologies and responsive design principles.'
  },
  {
    year: '2024',
    title: 'Built full-stack applications',
    description: 'Transitioned to the MERN stack. Developed and deployed comprehensive applications with custom authentication and state management.'
  },
  {
    year: '2025',
    title: 'Developed real-world production projects',
    description: 'Expanded expertise into Java and Spring Boot. Architected robust RESTful APIs and real-time systems using WebSockets.'
  },
  {
    year: '2026',
    title: 'Building scalable systems & AI products',
    description: 'Focusing on integrating LLMs, orchestrating cloud deployments, and building intelligent web experiences that solve complex problems.'
  }
];

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center']
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section ref={containerRef} className="py-32 relative z-10">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="relative">
          {/* Background Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[1px] bg-glass-border -translate-x-1/2" />
          
          {/* Animated Glowing Line */}
          <motion.div 
            style={{ height: lineHeight }}
            className="absolute left-0 md:left-1/2 top-0 w-[2px] bg-gradient-to-b from-accent-cyan via-accent-purple to-accent-cyan shadow-[0_0_15px_rgba(0,212,255,0.5)] -translate-x-1/2 origin-top z-10"
          />

          <div className="space-y-32">
            {timelineData.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={item.year} className="relative flex flex-col md:flex-row items-center">
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-bg border-2 border-accent-cyan rounded-full -translate-x-1/2 z-20 shadow-[0_0_10px_rgba(0,212,255,0.8)]" />

                  {/* Content Container */}
                  <div className={cn(
                    "w-full md:w-1/2 pl-12 md:pl-0",
                    isEven ? "md:pr-16 md:text-right" : "md:pl-16 md:ml-auto"
                  )}>
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <h3 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-text-primary to-bg/10 select-none -mb-4">
                        {item.year}
                      </h3>
                      <div className="relative z-10">
                        <h4 className="text-xl md:text-2xl font-semibold text-text-primary mb-2">
                          {item.title}
                        </h4>
                        <p className="text-text-muted font-light leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
