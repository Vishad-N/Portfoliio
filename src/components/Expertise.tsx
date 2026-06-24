import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { cn } from '../utils';

const areas = [
  {
    title: 'BACKEND',
    description: 'Architecting robust, scalable, and secure server-side applications capable of handling high concurrency and complex business logic.',
    skills: ['RESTful APIs', 'Authentication & JWT', 'Spring Boot', 'Node.js', 'Real-Time WebSockets', 'Microservices'],
    color: 'text-accent-cyan'
  },
  {
    title: 'FRONTEND',
    description: 'Crafting pixel-perfect, highly responsive, and accessible user interfaces. Focusing on seamless state management and performant rendering.',
    skills: ['React & Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Responsive Design', 'Web Vitals Optimization'],
    color: 'text-text-primary'
  },
  {
    title: 'AI INTEGRATION',
    description: 'Bridging the gap between traditional applications and modern AI capabilities. Automating workflows and enhancing user experiences with intelligent systems.',
    skills: ['Gemini API', 'OpenAI', 'RAG Pipelines', 'OCR & Data Extraction', 'Automated Workflows', 'Prompt Engineering'],
    color: 'text-accent-purple'
  }
];

function ExpertiseSection({ area, index }: { area: typeof areas[0], index: number, key?: string | number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center']
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className="sticky top-0 flex items-center justify-center bg-bg pt-24 pb-12 lg:pb-16 z-10 shadow-2xl">
      <motion.div style={{ opacity }} className="container mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <div className={cn(
            "flex flex-col justify-center",
            !isEven && "lg:order-last"
          )}>
            <h2 className={cn("text-6xl md:text-8xl lg:text-[8rem] font-bold tracking-tighter leading-none mb-8", area.color)}>
              {area.title}
            </h2>
          </div>

          <div className={cn(
            "flex flex-col justify-center",
            !isEven && "lg:order-first"
          )}>
            <div className="bg-glass border border-glass-border rounded-3xl p-8 md:p-12 backdrop-blur-md">
              <p className="text-xl md:text-2xl text-text-muted font-light leading-relaxed mb-10">
                {area.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {area.skills.map((skill, i) => (
                  <motion.div 
                    key={skill}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className={cn("w-1.5 h-1.5 rounded-full", area.color.replace('text-', 'bg-'))} />
                    <span className="text-lg font-medium tracking-wide">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}

export default function Expertise() {
  return (
    <section className="relative z-20">
      {areas.map((area, index) => (
        <ExpertiseSection key={area.title} area={area} index={index} />
      ))}
    </section>
  );
}
