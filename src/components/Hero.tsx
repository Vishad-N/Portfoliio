import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'motion/react';
import { useRef, useEffect } from 'react';
import { ArrowDown, FileText } from 'lucide-react';

const blueprintWords = [
  { word: 'API', x: '10%', y: '20%' },
  { word: 'JWT', x: '80%', y: '15%' },
  { word: 'AUTH', x: '85%', y: '60%' },
  { word: 'SOCKET', x: '15%', y: '70%' },
  { word: 'DATABASE', x: '50%', y: '85%' },
  { word: 'AI', x: '40%', y: '10%' },
  { word: 'REACT', x: '70%', y: '35%' },
  { word: 'SPRING', x: '25%', y: '45%' },
  { word: 'NODE', x: '60%', y: '75%' },
  { word: 'MONGODB', x: '35%', y: '80%' },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Interactive Cursor Spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const spotlightBackground = useMotionTemplate`radial-gradient(600px circle at ${smoothMouseX}px ${smoothMouseY}px, rgba(0, 212, 255, 0.08), rgba(139, 92, 246, 0.03) 40%, transparent 80%)`;

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Layer 3: Background Text (Moves Slowest)
  const bgTextY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  
  // Layer 2: Outline Text (Moves Slow)
  const outlineTextY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  // Layer 1: Foreground Text (Moves Normal, scales down and exits to navbar position)
  const mainTextY = useTransform(scrollYProgress, [0, 0.7], ['0%', '-35vh']);
  // Adjust X translation to map text towards top-left, while shrinking scale
  const mainTextX = useTransform(scrollYProgress, [0, 0.7], ['0%', '-35vw']);
  const mainTextScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.25]);
  const mainTextOpacity = useTransform(scrollYProgress, [0, 0.6, 0.7], [1, 0.5, 0]);

  // Navbar Logo fade in (Seamless handoff)
  const navLogoOpacity = useTransform(scrollYProgress, [0.65, 0.75], [0, 1]);
  const navLogoY = useTransform(scrollYProgress, [0.65, 0.75], [-20, 0]);

  // Global exit opacity for Hero elements
  const exitOpacity = useTransform(scrollYProgress, [0, 0.6, 0.7], [1, 0.8, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], ['0%', '50%']);

  // Scroll Indicator transform
  const indicatorScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <>
      {/* Fixed Navbar Logo */}
      <motion.div 
        style={{ opacity: navLogoOpacity, y: navLogoY }}
        className="fixed top-6 left-6 z-50 pointer-events-none"
      >
        <h2 className="text-xl md:text-2xl font-bold tracking-tighter text-text-primary flex items-center">
          VISHAD
          <span className="text-text-muted ml-2">NAMDEO</span>
        </h2>
      </motion.div>

      <section 
        ref={containerRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Interactive Cursor Spotlight */}
        <motion.div 
          className="pointer-events-none absolute inset-0 z-0"
          style={{ background: spotlightBackground }}
        />

        {/* Engineering Blueprint Background */}
        <motion.div style={{ opacity: exitOpacity }} className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Faint Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
            <path d="M 10% 20% L 40% 10% L 80% 15% L 70% 35% L 85% 60% L 60% 75% L 50% 85% L 35% 80% L 15% 70% L 25% 45% Z" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
            <path d="M 25% 45% L 70% 35%" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M 40% 10% L 50% 85%" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
          
          {blueprintWords.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 + index * 0.1, duration: 1 }}
              className="absolute text-[10px] sm:text-xs md:text-sm font-mono tracking-[0.2em] text-text-muted opacity-[0.03] select-none"
              style={{ left: item.x, top: item.y, transform: 'translate(-50%, -50%)' }}
            >
              {item.word}
            </motion.div>
          ))}
        </motion.div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
          
          {/* Layered Typography Container */}
          <div className="relative w-full flex justify-center items-center mb-6 h-[200px] md:h-[300px]">
            
            {/* Layer 3: Background Large Text */}
            <motion.div
              style={{ y: bgTextY, opacity: exitOpacity }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
            >
              <motion.h1 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 0.04, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className="text-[12vw] md:text-[10rem] leading-none font-black tracking-tighter text-text-muted whitespace-nowrap"
              >
                FULL STACK<br/>DEVELOPER
              </motion.h1>
            </motion.div>

            {/* Layer 2: Outline Text */}
            <motion.div
              style={{ y: outlineTextY, opacity: exitOpacity }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 overflow-hidden"
            >
              <motion.h1 
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                className="text-7xl md:text-[9rem] leading-[0.85] font-bold tracking-tighter text-transparent"
                style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}
              >
                VISHAD
                <br />
                NAMDEO
              </motion.h1>
            </motion.div>

            {/* Layer 1: Foreground Solid Text */}
            <motion.div
              style={{ 
                y: mainTextY, 
                x: mainTextX,
                scale: mainTextScale,
                opacity: mainTextOpacity,
              }}
              className="absolute inset-0 flex items-center justify-center z-20 origin-center"
            >
              <motion.div className="overflow-hidden">
                <motion.h1 
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="text-7xl md:text-[9rem] leading-[0.85] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-text-primary to-text-muted text-center"
                >
                  VISHAD
                  <br />
                  NAMDEO
                </motion.h1>
              </motion.div>
            </motion.div>
          </div>

          {/* Subtitle and CTA Container */}
          <motion.div
            style={{ opacity: exitOpacity, y: contentY }}
            className="max-w-2xl mx-auto mt-12 space-y-6 text-center relative z-20"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-glass-border bg-glass backdrop-blur-sm"
            >
              <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
              <span className="text-sm font-medium tracking-wide uppercase text-accent-cyan">Full Stack Developer</span>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="text-xl md:text-2xl font-light text-text-muted tracking-wide"
            >
              MERN • Spring Boot • AI Applications
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-lg md:text-xl text-text-muted/80 leading-relaxed max-w-xl mx-auto"
            >
              Building scalable digital experiences and intelligent web systems.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
            >
              <motion.a 
                href="#projects"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-text-primary text-bg font-semibold rounded-full overflow-hidden flex items-center gap-2"
              >
                <span className="relative z-10">View Projects</span>
                <ArrowDown className="w-4 h-4 relative z-10 group-hover:translate-y-1 transition-transform" />
                <div className="absolute inset-0 bg-accent-cyan transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out" />
              </motion.a>
              
              <motion.a 
                href="/resume.pdf"
                target="_blank"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 border border-glass-border hover:border-accent-purple/50 bg-glass hover:bg-accent-purple/10 text-text-primary font-semibold rounded-full flex items-center gap-2 transition-all duration-300"
              >
                <FileText className="w-4 h-4 text-accent-purple group-hover:scale-110 transition-transform" />
                <span>Download Resume</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        {/* Living Scroll Indicator */}
        <motion.div 
          style={{ scale: indicatorScale, opacity: indicatorOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        >
          <div className="w-[1px] h-24 bg-gradient-to-b from-glass-border via-text-muted/20 to-transparent relative overflow-hidden flex justify-center rounded-full">
            {/* Cyan Energy pulse */}
            <motion.div 
              animate={{
                y: ['-100%', '300%'],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute w-[3px] h-8 bg-gradient-to-b from-transparent via-accent-cyan to-transparent shadow-[0_0_10px_rgba(0,212,255,0.8)] rounded-full"
            />
            {/* Purple Glow trail */}
            <motion.div 
              animate={{
                y: ['-100%', '300%'],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.8
              }}
              className="absolute w-[2px] h-6 bg-gradient-to-b from-transparent via-accent-purple to-transparent shadow-[0_0_8px_rgba(139,92,246,0.6)] rounded-full"
            />
          </div>
        </motion.div>
      </section>
    </>
  );
}
