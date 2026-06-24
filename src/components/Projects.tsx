import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { cn } from '../utils';
import railXpressImg from '@/assets/railexpress.png';
import taskPilotImg from '@/assets/taskpilot.png';

const projects = [

  {
    title: 'TaskPilot',
    description: 'An intelligent task management dashboard with predictive scheduling and automated workflows.',
    tech: ['Next.js', 'TypeScript', 'Tailwind', 'PostgreSQL'],
    live: 'https://taskpilot-blue.vercel.app/',
    github: 'https://github.com/Vishad-N/taskpilot',
    imageColor: 'from-emerald-900 to-bg',
    image: taskPilotImg
  },
  {
    title: 'RailXpress',
    description: 'A comprehensive railway management system designed for high concurrency and robust ticket booking operations.',
    tech: ['Java', 'Spring Boot', 'React', 'MySQL'],
    live: 'https://rail-xpress-frontend-tf3h.vercel.app/',
    github: 'https://github.com/Vishad-N/RailXpress_frontend',
    imageColor: 'from-blue-900 to-bg',
    image: railXpressImg
  },

];

function ProjectCard({ project, index }: { project: typeof projects[0], index: number, key?: string | number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start']
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const isEven = index % 2 === 0;

  return (
    <div ref={cardRef} className="min-h-screen flex items-center py-24">
      <div className={cn(
        "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center w-full",
        !isEven && "lg:grid-flow-col-dense"
      )}>

        {/* Image Container */}
        <div className={cn(
          "relative aspect-[4/3] lg:aspect-[16/10] w-full rounded-2xl overflow-hidden group",
          !isEven && "lg:col-start-2"
        )}>
          <div className="absolute inset-0 z-10 bg-glass border border-glass-border rounded-2xl" />
          {/* Mockup Placeholder */}
          <motion.div
            style={{ scale: imageScale }}
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity duration-500 group-hover:opacity-80",
              project.imageColor
            )}
          />
          <div className="absolute inset-x-8 bottom-0 top-16 bg-bg border-t border-x border-glass-border rounded-t-xl z-20 overflow-hidden shadow-2xl">
            {project.image ? (
              <motion.img
                style={{ scale: imageScale }}
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-bg/50 backdrop-blur-md flex items-center justify-center">
                <span className="font-mono text-text-muted/50 text-xl tracking-widest uppercase">Project Visual</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Container */}
        <div className={cn(
          "flex flex-col justify-center",
          !isEven && "lg:col-start-1"
        )}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">{project.title}</h3>
            <p className="text-xl text-text-muted font-light leading-relaxed mb-8">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              {project.tech.map((t) => (
                <span key={t} className="px-4 py-2 rounded-full border border-glass-border bg-glass backdrop-blur-sm text-sm text-text-primary">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <a href={project.live} className="flex items-center gap-2 text-accent-cyan hover:text-white transition-colors group">
                <span className="font-semibold">Live Site</span>
                <ExternalLink className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href={project.github} className="flex items-center gap-2 text-text-muted hover:text-white transition-colors group">
                <span className="font-semibold">Source Code</span>
                <Github className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-32 relative z-10">
      <div className="container mx-auto px-6">
        <div className="mb-32">
          <h2 className="text-sm font-mono tracking-[0.3em] uppercase text-accent-cyan mb-4">
            Featured Work
          </h2>
          <p className="text-3xl md:text-5xl font-medium text-text-muted">
            Selected projects that define my <span className="text-text-primary">engineering standard.</span>
          </p>
        </div>

        <div>
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
