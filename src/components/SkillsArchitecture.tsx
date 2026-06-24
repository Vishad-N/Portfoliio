import { motion, useMotionValue, useTransform, useMotionTemplate } from 'motion/react';
import { useState, useEffect } from 'react';

// Official-like SVG Logos
const ReactIcon = (props: any) => (
  <svg viewBox="-11.5 -10.23 23 20.46" fill="currentColor" {...props}>
    <circle r="2.05" fill="currentColor" />
    <g stroke="currentColor" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);

const NextjsIcon = (props: any) => (
  <svg viewBox="0 0 128 128" fill="currentColor" {...props}>
    <path d="M64 128c35.346 0 64-28.654 64-64S99.346 0 64 0 0 28.654 0 64s28.654 64 64 64zm-14.735-37.112-25.2-34.18V88.89h-9.45V39.11h10.97l25.82 34.61V39.11h9.45v51.78h-11.59zM88.24 74.01h15.93v8.32H88.24v-8.32zm0-23.71h15.93v8.32H88.24v-8.32z" />
  </svg>
);

const TailwindIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
  </svg>
);

const NodejsIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M11.83 0C11.196 0 10.518.23 9.948.56L2.308 5.03c-.628.366-1.127.973-1.42 1.644-.294.67-.373 1.413-.373 2.126v8.42c0 .714.08 1.458.374 2.127.293.67.792 1.278 1.42 1.645l7.64 4.47c.57.33 1.248.56 1.882.56.633 0 1.31-.23 1.88-.56l7.64-4.47c.628-.367 1.127-.975 1.42-1.645.294-.67.373-1.413.373-2.127V8.8c0-.713-.08-1.456-.374-2.126-.293-.67-.792-1.278-1.42-1.645L13.71.56C13.14.23 12.463 0 11.83 0z" />
  </svg>
);

const ExpressIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.166 17.5H8.788l-1.812-4.144L5.164 17.5H3.12l2.842-5.385-2.614-4.887h2.046l1.62 3.82 1.62-3.82h2.046l-2.614 4.887 2.842 5.385zm6.544.116c-2.316 0-3.655-1.17-3.655-3.32v-1.17c0-2.148 1.339-3.32 3.655-3.32 2.315 0 3.654 1.17 3.654 3.32v.42h-5.46v.75c0 1.206.662 1.765 1.805 1.765 1.05 0 1.683-.455 1.78-1.284h1.75c-.15 1.65-1.378 2.839-3.529 2.839zm0-6.284c-1.143 0-1.805.558-1.805 1.765v.42h3.61v-.42c0-1.207-.662-1.765-1.805-1.765z" />
  </svg>
);

const MongoIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M11.536 23.364c.264 0 .428-.108.428-.363v-3.774c1.196-.445 2.193-1.168 2.99-2.17.818-1.025 1.226-2.246 1.226-3.664 0-1.89-1.28-4.52-3.84-7.89-.136-.182-.266-.358-.39-.526L11.54 0l-.398.508c-.125.16-.26.345-.402.55-2.58 3.486-3.87 6.138-3.87 7.96 0 1.442.41 2.673 1.228 3.696.812 1.016 1.815 1.745 3.01 2.19V23c0 .254.163.364.428.364h.004z" />
  </svg>
);

const SpringIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-.05 15.68c-.18 0-.35-.06-.5-.16l-3.35-2.45c-.24-.18-.32-.51-.15-.75.18-.24.51-.32.75-.15l3.25 2.38 4.45-5.2c.18-.22.5-.25.72-.08.22.18.25.5.08.72l-4.7 5.5c-.14.16-.33.22-.52.22z" /><path d="M12.02 5.5c-2.4 0-4.63 1.35-5.63 3.5-.12.25 0 .55.25.66.25.12.55 0 .66-.25C8.12 7.6 9.98 6.5 12.02 6.5c3.08 0 5.6 2.5 5.6 5.6 0 .5-.4 1-1 1s-1-.5-1-1c0-1.98-1.62-3.6-3.6-3.6z" />
  </svg>
);

const JavaIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M15.4 15.24c-.37-.08-.75-.14-1.12-.17-.18-.02-.36-.02-.55-.02-1.32 0-2.58.2-3.8.6-.14.04-.26.1-.4.15-.1.04-.2.07-.3.12-.76.35-1.5.76-2.2 1.25-.03.02-.06.05-.08.07-.22.16-.43.34-.63.54l-.06.05c-.1.1-.18.22-.26.33-.2.3-.3.62-.26.96.02.26.13.5.32.7.2.22.45.4.73.54.54.3 1.13.52 1.74.68.85.23 1.73.35 2.6.35 1.5 0 2.97-.24 4.37-.7.63-.2 1.23-.46 1.8-.77.17-.1.33-.2.48-.32.14-.1.27-.2.4-.33.32-.32.54-.7.66-1.12.08-.28.1-.57.06-.86-.05-.34-.17-.66-.37-.95-.14-.2-.3-.38-.48-.56-.17-.16-.36-.3-.55-.44-.64-.46-1.34-.84-2.06-1.15-.3-.13-.6-.24-.9-.35zm-6.2-7.5c-1.56 0-2.83 1.27-2.83 2.83 0 .78.32 1.5.83 2.02.5.52 1.22.84 2 .84h5.66c1.56 0 2.83-1.27 2.83-2.83 0-.78-.32-1.5-.83-2.02-.5-.52-1.22-.84-2-.84H9.2zm8.68 1.42c.86.35 1.54 1.1 1.8 2 .25.86.13 1.8-.33 2.57-.45.75-1.16 1.3-2 1.54-.42.12-.86.16-1.3.1h-.2v-1.42h.2c.24.04.48 0 .7-.1.45-.2.82-.57 1.02-1.02.2-.45.24-.96.1-1.42-.14-.46-.46-.86-.9-1.08-.34-.17-.72-.25-1.1-.22V8.75c.67-.04 1.33.1 1.94.4zM7.5 4C7.5 2.9 8.4 2 9.5 2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm4.5 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z" />
  </svg>
);

const SocketIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-.886 15.5l1.096-4.52h-2.58l3.185-7.48-1.096 4.52h2.58l-3.185 7.48z" />
  </svg>
);

const SparklesIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4M3 5h4" />
  </svg>
);

// Spread out vastly to cover the whole screen
const technologies = [
  { name: 'React', x: -450, y: -200, color: '#61DAFB', icon: ReactIcon },
  { name: 'Next.js', x: 0, y: -380, color: '#FFFFFF', icon: NextjsIcon },
  { name: 'Tailwind', x: 450, y: -200, color: '#38BDF8', icon: TailwindIcon },
  { name: 'Node.js', x: -550, y: 50, color: '#339933', icon: NodejsIcon },
  { name: 'Express', x: -350, y: 300, color: '#FFFFFF', icon: ExpressIcon },
  { name: 'MongoDB', x: 0, y: 380, color: '#47A248', icon: MongoIcon },
  { name: 'Spring Boot', x: 350, y: 300, color: '#6DB33F', icon: SpringIcon },
  { name: 'Java', x: 550, y: 50, color: '#f89820', icon: JavaIcon },
  { name: 'Socket.io', x: -200, y: -300, color: '#FFFFFF', icon: SocketIcon },
  { name: 'AI APIs', x: 200, y: -300, color: '#00D4FF', icon: SparklesIcon },
];

const Particles = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => {
        const size = Math.random() * 3 + 1;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-accent-cyan"
            style={{ width: size, height: size, filter: 'blur(1px)' }}
            initial={{
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              opacity: 0
            }}
            animate={{
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              opacity: [0, 0.4, 0]
            }}
            transition={{
              duration: 15 + Math.random() * 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        );
      })}
    </div>
  );
};

function TechNode({ tech, index, isHovered, onHover, onLeave }: any) {
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const currentX = useTransform(dragX, (v) => tech.x + v);
  const currentY = useTransform(dragY, (v) => tech.y + v);

  // Organic S-Curve flexible wire math
  const twist = (index % 2 === 0 ? 1 : -1) * (40 + (index % 3) * 20);
  const cx1 = useTransform(currentX, x => x * 0.3 + twist);
  const cy1 = useTransform(currentY, y => y * 0.7 - twist);
  const cx2 = useTransform(currentX, x => x * 0.7 - twist);
  const cy2 = useTransform(currentY, y => y * 0.3 + twist);

  // Safest way to generate template string dynamically
  const path = useTransform(() => {
    return `M 0 0 C ${cx1.get()} ${cy1.get()} ${cx2.get()} ${cy2.get()} ${currentX.get()} ${currentY.get()}`;
  });

  return (
    <>
      <svg className="absolute top-1/2 left-1/2 w-1 h-1 pointer-events-none overflow-visible" style={{ zIndex: 10 }}>
        {/* Base connection rope */}
        <motion.path
          d={path}
          fill="none"
          stroke={isHovered ? tech.color : "rgba(0, 212, 255, 0.15)"}
          strokeWidth={isHovered ? 2.5 : 1.5}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.2 + index * 0.1 }}
        />
        {/* Animated pulse / energy stream along the rope */}
        {/* Path goes from YOU (0,0) to Node (currentX, currentY). 
            Increasing strokeDashoffset moves dashes BACKWARDS along the path (Node to YOU).
            Pattern length is 40. 80 offset means it loops exactly 2 times per animation cycle. */}
        <motion.path
          d={path}
          fill="none"
          stroke={tech.color || "#00D4FF"}
          strokeWidth={isHovered ? 4 : 2}
          strokeLinecap="round"
          strokeDasharray={isHovered ? "4 36" : "2 38"} // Perfectly sums to 40
          initial={{ opacity: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0.4,
            strokeDashoffset: [0, 80], // Flow from Node to YOU
          }}
          transition={{
            strokeDashoffset: {
              duration: isHovered ? 1 : 2.5,
              repeat: Infinity,
              ease: "linear"
            },
            opacity: { duration: 0.3 }
          }}
          className="mix-blend-screen"
        />
      </svg>

      {/* Node Container */}
      <motion.div
        className="absolute w-0 h-0 flex items-center justify-center cursor-grab active:cursor-grabbing group"
        style={{
          left: `calc(50% + ${tech.x}px)`,
          top: `calc(50% + ${tech.y}px)`,
          x: dragX,
          y: dragY,
          zIndex: isHovered ? 40 : 30
        }}
        drag
        dragSnapToOrigin={true}
        dragElastic={0.4}
        dragTransition={{ bounceStiffness: 250, bounceDamping: 15 }}
        onHoverStart={onHover}
        onHoverEnd={onLeave}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
      >
        {/* Idle floating animation wrapper */}
        <motion.div
          animate={{ y: [0, -6, 0], x: [0, (index % 2 === 0 ? 3 : -3), 0] }}
          transition={{
            duration: 4 + index * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.2
          }}
          className="relative flex items-center justify-center"
        >
          {/* Logo Box - INCREASED SIZE to w-20 h-20 */}
          <div
            className="relative w-20 h-20 rounded-2xl bg-bg/80 border backdrop-blur-md flex items-center justify-center transition-all duration-300"
            style={{
              boxShadow: isHovered ? `0 0 35px ${tech.color}50` : `0 0 15px ${tech.color}15`,
              borderColor: isHovered ? `${tech.color}80` : `${tech.color}30`,
              transform: isHovered ? 'scale(1.15)' : 'scale(1)'
            }}
          >
            {/* The SVG Logo - INCREASED SIZE to w-10 h-10 and applied base light color */}
            <div
              className="w-10 h-10 flex items-center justify-center transition-all duration-300"
              style={{
                color: tech.color,
                opacity: isHovered ? 1 : 0.45,
                filter: isHovered ? `drop-shadow(0 0 8px ${tech.color})` : 'none'
              }}
            >
              <tech.icon className="w-full h-full" />
            </div>

            {/* Tooltip */}
            <div
              className="absolute -top-12 px-3 py-1.5 rounded-md bg-bg/95 border border-glass-border backdrop-blur-xl transition-all duration-300 pointer-events-none whitespace-nowrap"
              style={{
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? 'translateY(0)' : 'translateY(8px)'
              }}
            >
              <span
                className="text-sm font-semibold tracking-wide"
                style={{ color: tech.color, textShadow: `0 0 15px ${tech.color}80` }}
              >
                {tech.name}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

export default function SkillsArchitecture() {
  const [hoveredTech, setHoveredTech] = useState<typeof technologies[0] | null>(null);

  return (
    <section className="py-32 relative z-10 overflow-hidden">
      <Particles />

      <div className="container mx-auto px-6 max-w-[1600px]">
        <div className="text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-mono tracking-[0.3em] uppercase text-accent-cyan"
          >
            System Architecture
          </motion.h2>
        </div>

        {/* Increased min-height to allow logos to spread out completely */}
        <div className="relative w-full h-[900px] flex items-center justify-center">

          {/* Central Node */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="absolute z-20 w-28 h-28 rounded-full bg-glass border backdrop-blur-md flex items-center justify-center transition-all duration-500"
            style={{
              borderColor: hoveredTech ? hoveredTech.color : "rgba(0, 212, 255, 0.5)",
              boxShadow: hoveredTech
                ? `0 0 50px ${hoveredTech.color}60`
                : "0 0 30px rgba(0, 212, 255, 0.2)"
            }}
          >
            {/* Faint energy ripples */}
            {hoveredTech && (
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: hoveredTech.color }}
                animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            )}
            <span className="font-bold tracking-widest text-text-primary z-10 text-lg">Vishad</span>
          </motion.div>

          {/* Tech Nodes & Flexible Rope Lines */}
          {technologies.map((tech, index) => (
            <TechNode
              key={tech.name}
              tech={tech}
              index={index}
              isHovered={hoveredTech?.name === tech.name}
              onHover={() => setHoveredTech(tech)}
              onLeave={() => setHoveredTech(null)}
            />
          ))}

        </div>
      </div>
    </section>
  );
}
