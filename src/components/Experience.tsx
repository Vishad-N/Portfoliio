import { motion } from 'motion/react';
import EngineeringDNA from './EngineeringDNA';
export default function Experience() {
  return (
    <section className="py-32 relative z-20 bg-bg overflow-hidden">
      <div className="container mx-auto px-6">
        
        <div className="mb-24">
          <h2 className="text-sm font-mono tracking-[0.3em] uppercase text-accent-cyan mb-4">
            Professional Experience
          </h2>
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Massive Background Text */}
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 text-[20rem] md:text-[30rem] font-bold text-bg/10 select-none pointer-events-none leading-none z-0">
            2026
          </div>

          <div className="relative z-10 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
                WEB DEVELOPER
              </h3>
              <div className="flex items-center gap-4 mb-12">
                <span className="text-xl font-mono text-accent-cyan tracking-widest uppercase">Present</span>
                <div className="w-12 h-[1px] bg-glass-border" />
                <span className="text-xl text-text-muted">Ongoing professional work</span>
              </div>

              <div className="space-y-8 text-xl text-text-muted font-light leading-relaxed">
                <p>
                  Leading the development of scalable web applications and intelligent systems. Architecting solutions that bridge the gap between complex backend infrastructure and seamless user experiences.
                </p>
                <p>
                  Spearheading the integration of AI capabilities into existing workflows, resulting in significant improvements in automation and operational efficiency. Collaborating with cross-functional teams to deliver high-quality software on time.
                </p>
                <p>
                  Continually pushing the boundaries of web technologies, adopting modern frameworks, and enforcing best practices in code quality, security, and performance optimization.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Engineering DNA Visualization */}
          <div className="hidden lg:block relative z-10 w-full h-full min-h-[600px]">
            <EngineeringDNA />
          </div>
        </div>

      </div>
    </section>
  );
}
