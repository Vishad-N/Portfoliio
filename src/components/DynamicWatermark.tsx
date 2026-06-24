import { motion, useAnimate, useInView } from 'motion/react';
import { useEffect, useRef } from 'react';

export default function DynamicWatermark() {
  const [scope, animate] = useAnimate();
  const inViewRef = useRef(false);
  const isInView = useInView(scope, { margin: "100px" });

  useEffect(() => {
    inViewRef.current = isInView;
  }, [isInView]);

  useEffect(() => {
    let isPlaying = true;

    const playSequence = async () => {
      // Set initial states
      if (scope.current) {
        animate(".text-path", { pathLength: 1, opacity: 1 }, { duration: 0 });
        animate(".gear-path", { pathLength: 0, opacity: 0 }, { duration: 0 });
        animate(".guide-path", { pathLength: 0, opacity: 0 }, { duration: 0 });
        animate(".guide-dot", { opacity: 0 }, { duration: 0 });
      }

      while (isPlaying) {
        if (!inViewRef.current) {
          await new Promise(r => setTimeout(r, 1000));
          continue;
        }

        try {
          // Hold Text
          await new Promise(r => setTimeout(r, 3000));
          if (!isPlaying) break;

          // Deconstruct Text
          animate(".text-path", { pathLength: 0 }, { duration: 2, ease: "easeInOut" });
          await animate(".text-path", { opacity: 0 }, { duration: 0.5, delay: 1.5 });
          if (!isPlaying) break;

          // Emerge Construction Guides
          animate(".guide-path", { opacity: 0.3, pathLength: 1 }, { duration: 1.5, ease: "easeOut" });
          await animate(".guide-dot", { opacity: 0.5 }, { duration: 1, delay: 0.5 });
          if (!isPlaying) break;

          // Construct Gear
          await animate(".gear-path", { opacity: 1, pathLength: 1 }, { duration: 2.5, ease: "easeInOut" });
          if (!isPlaying) break;

          // Hold Gear
          await new Promise(r => setTimeout(r, 3000));
          if (!isPlaying) break;

          // Deconstruct Gear
          animate(".gear-path", { pathLength: 0 }, { duration: 2, ease: "easeInOut" });
          await animate(".gear-path", { opacity: 0 }, { duration: 0.5, delay: 1.5 });
          if (!isPlaying) break;

          // Hide Guides
          animate(".guide-path", { opacity: 0, pathLength: 0 }, { duration: 1.5, ease: "easeInOut" });
          await animate(".guide-dot", { opacity: 0 }, { duration: 1 });
          if (!isPlaying) break;

          // Construct Text
          animate(".text-path", { opacity: 1 }, { duration: 0.1 });
          await animate(".text-path", { pathLength: 1 }, { duration: 2.5, ease: "easeInOut" });
        } catch (e) {
          // Ignore animation interruptions when unmounting
          break;
        }
      }
    };

    playSequence();

    return () => {
      isPlaying = false;
    };
  }, [animate, scope]);

  return (
    <div 
      className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.08]"
    >
      <motion.div
        animate={{ opacity: isInView ? 1 : 0.2 }}
        transition={{ duration: 1.5 }}
        className="w-full h-full flex items-center justify-center"
      >
        <svg 
          ref={scope}
          viewBox="0 0 1000 600" 
          className="w-full h-full max-w-[2000px] text-text-primary"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Blueprint Construction Guides */}
          <g className="guides">
            <motion.line x1="100" y1="300" x2="900" y2="300" stroke="currentColor" strokeWidth="1" className="guide-path" fill="none" />
            <motion.line x1="500" y1="100" x2="500" y2="500" stroke="currentColor" strokeWidth="1" className="guide-path" fill="none" />
            <motion.line x1="217" y1="17" x2="783" y2="583" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" className="guide-path" fill="none" />
            <motion.line x1="217" y1="583" x2="783" y2="17" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" className="guide-path" fill="none" />
            
            {/* Guide Circles */}
            <motion.circle cx="500" cy="300" r="280" stroke="currentColor" strokeWidth="1" strokeDasharray="10 15" className="guide-path" fill="none" />
            <motion.circle cx="500" cy="300" r="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" className="guide-path" fill="none" />
          </g>

          {/* Architectural Gear Geometry */}
          <g className="gear">
            <motion.circle cx="500" cy="300" r="220" stroke="currentColor" strokeWidth="3" fill="none" className="gear-path" />
            <motion.circle cx="500" cy="300" r="180" stroke="currentColor" strokeWidth="1" strokeDasharray="12 12" fill="none" className="gear-path" />
            <motion.circle cx="500" cy="300" r="140" stroke="currentColor" strokeWidth="4" fill="none" className="gear-path" />
            <motion.circle cx="500" cy="300" r="60" stroke="currentColor" strokeWidth="2" fill="none" className="gear-path" />
            <motion.circle cx="500" cy="300" r="30" stroke="currentColor" strokeWidth="1" fill="none" className="gear-path" />

            {/* Gear Teeth */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <motion.g key={`tooth-${i}`} transform={`rotate(${angle} 500 300)`}>
                <motion.path 
                  d="M 460 80 L 470 40 L 530 40 L 540 80" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  fill="none" 
                  className="gear-path"
                />
                <motion.line x1="500" y1="140" x2="500" y2="220" stroke="currentColor" strokeWidth="4" className="gear-path" fill="none" />
              </motion.g>
            ))}

            {/* Construction Dots */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <motion.g key={`dot-${i}`} transform={`rotate(${angle} 500 300)`}>
                <motion.circle cx="500" cy="110" r="4" fill="currentColor" className="guide-dot" />
              </motion.g>
            ))}
          </g>

          {/* ENGINEER Text */}
          <motion.text 
            x="50%" 
            y="50%" 
            textAnchor="middle" 
            dominantBaseline="central" 
            fontSize="180" 
            fontWeight="bold" 
            letterSpacing="0.1em"
            stroke="currentColor" 
            strokeWidth="3" 
            fill="none"
            className="text-path"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            ENGINEER
          </motion.text>
        </svg>
      </motion.div>
    </div>
  );
}
