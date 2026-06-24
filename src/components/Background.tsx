import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export default function Background() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Dark Base */}
      <div className="absolute inset-0 bg-bg" />
      
      {/* Animated Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #F8FAFC 1px, transparent 1px),
            linear-gradient(to bottom, #F8FAFC 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
        }}
      />

      {/* Mouse Follow Glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] bg-accent-cyan/10"
        animate={{
          x: mousePos.x - 300,
          y: mousePos.y - 300,
        }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 1 }}
      />
      
      {/* Purple Ambient Glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[150px] bg-accent-purple/5 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[150px] bg-accent-cyan/5 translate-y-1/3 -translate-x-1/4" />
    </div>
  );
}
