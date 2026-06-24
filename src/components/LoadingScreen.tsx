import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { cn } from '../utils';

// Lightweight Audio Synthesis Engine
const AudioEngine = {
  ctx: null as AudioContext | null,
  init() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn('AudioContext not supported');
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  },
  playTick() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  },
  playGlitch() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const bufferSize = this.ctx.sampleRate * 0.2; // 200ms
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(4000, this.ctx.currentTime + 0.1);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch (e) {}
  },
  playWhoosh() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const bufferSize = this.ctx.sampleRate * 1.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(2000, this.ctx.currentTime + 0.5);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch(e) {}
  }
};

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);
  const [htmlText, setHtmlText] = useState('');
  const [cssText, setCssText] = useState('');
  const [jsText, setJsText] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  
  // Timing sequence
  useEffect(() => {
    // Try to init audio on interaction
    const handleInteraction = () => AudioEngine.init();
    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });
    
    // Start sequence
    setTimeout(() => {
      AudioEngine.init(); // Attempt one more time
      setStage(1);
    }, 300);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  // Stage 1: HTML
  useEffect(() => {
    if (stage === 1) {
      const str = '<HTML';
      let i = 0;
      const interval = setInterval(() => {
        setHtmlText(str.slice(0, i + 1));
        AudioEngine.playTick();
        i++;
        if (i === str.length) {
          clearInterval(interval);
          setTimeout(() => setStage(2), 200);
        }
      }, 80);
      return () => clearInterval(interval);
    }
  }, [stage]);

  // Stage 2: HTML Glitch
  useEffect(() => {
    if (stage === 2) {
      AudioEngine.playGlitch();
      setTimeout(() => setStage(3), 250);
    }
  }, [stage]);

  // Stage 3: CSS
  useEffect(() => {
    if (stage === 3) {
      const str = '.CSS';
      let i = 0;
      const interval = setInterval(() => {
        setCssText(str.slice(0, i + 1));
        AudioEngine.playTick();
        i++;
        if (i === str.length) {
          clearInterval(interval);
          setTimeout(() => setStage(4), 300);
        }
      }, 80);
      return () => clearInterval(interval);
    }
  }, [stage]);

  // Stage 4: CSS Glitch
  useEffect(() => {
    if (stage === 4) {
      AudioEngine.playGlitch();
      setTimeout(() => setStage(5), 250);
    }
  }, [stage]);

  // Stage 5: JS
  useEffect(() => {
    if (stage === 5) {
      const str = 'JAVASCRIPT';
      let i = 0;
      const msgs = ['Initializing...', 'Loading Components...', 'Rendering Experience...', 'Compiling Interactions...'];
      let msgIdx = 0;
      
      const interval = setInterval(() => {
        setJsText(str.slice(0, i + 1));
        AudioEngine.playTick();
        
        if (i % 2 === 0 && msgIdx < msgs.length) {
          setLogs(prev => [...prev, msgs[msgIdx]]);
          msgIdx++;
        }
        
        i++;
        if (i === str.length) {
          clearInterval(interval);
          setTimeout(() => setStage(6), 400);
        }
      }, 60);
      return () => clearInterval(interval);
    }
  }, [stage]);

  // Stage 6, 7, 8 triggers
  useEffect(() => {
    if (stage === 6) {
      setTimeout(() => setStage(7), 600); // Convergence takes 600ms
    }
    if (stage === 7) {
      AudioEngine.playWhoosh();
      setTimeout(() => setStage(8), 1000); // Identity formation takes 1s
    }
    if (stage === 8) {
      setTimeout(() => {
        setStage(9);
        onComplete();
      }, 800); // Final fade out
    }
  }, [stage, onComplete]);

  if (stage === 9) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: stage === 8 ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden pointer-events-auto"
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center font-mono">
        
        {/* CSS Background Grid / Guides */}
        <AnimatePresence>
          {stage >= 3 && stage < 8 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: stage === 4 ? 0 : 0.15 }}
              exit={{ opacity: 0 }}
              className={cn("absolute inset-0 pointer-events-none", stage === 4 && "glitch-text")}
              data-text=""
            >
              <div 
                className="w-full h-full"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #1572B6 1px, transparent 1px),
                    linear-gradient(to bottom, #1572B6 1px, transparent 1px)
                  `,
                  backgroundSize: '4rem 4rem',
                }}
              />
              <div className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4 border border-[#1572B6] opacity-30" />
              <div className="absolute top-1/3 left-1/3 right-1/3 bottom-1/3 border border-[#1572B6] opacity-50" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 1 & 2: HTML */}
        <AnimatePresence>
          {stage >= 1 && stage <= 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "absolute text-5xl md:text-7xl font-bold tracking-widest text-[#E34F26]",
                stage === 2 && "glitch-text"
              )}
              data-text={htmlText}
            >
              {htmlText}
              {stage === 1 && <span className="animate-pulse">_</span>}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 3 & 4: CSS */}
        <AnimatePresence>
          {stage >= 3 && stage <= 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "absolute text-5xl md:text-7xl font-bold tracking-widest text-[#1572B6]",
                stage === 4 && "glitch-text"
              )}
              data-text={cssText}
            >
              {cssText}
              {stage === 3 && <span className="animate-pulse">_</span>}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 5: JS */}
        <AnimatePresence>
          {stage === 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute flex flex-col items-center"
            >
              <div className="text-5xl md:text-7xl font-bold tracking-widest text-[#F7DF1E] mb-8">
                {jsText}
                <span className="animate-pulse">_</span>
              </div>
              <div className="flex flex-col items-start space-y-2 text-[#F7DF1E]/70 text-sm md:text-base">
                {logs.map((log, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    &gt; {log}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 6: Convergence */}
        <AnimatePresence>
          {stage === 6 && (
            <motion.div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ x: -200, y: -100, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.6, ease: "backIn" }}
                className="absolute text-3xl font-bold text-[#E34F26]"
              >
                HTML
              </motion.div>
              <motion.div
                initial={{ x: 200, y: -100, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.6, ease: "backIn" }}
                className="absolute text-3xl font-bold text-[#1572B6]"
              >
                CSS
              </motion.div>
              <motion.div
                initial={{ x: 0, y: 150, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.6, ease: "backIn" }}
                className="absolute text-3xl font-bold text-[#F7DF1E]"
              >
                JS
              </motion.div>
              
              {/* Converging particles */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: [0, 1, 0] }}
                transition={{ duration: 0.6 }}
                className="absolute w-32 h-32 rounded-full bg-white/20 blur-xl"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 7: Identity Formation */}
        <AnimatePresence>
          {stage === 7 && (
            <motion.div className="absolute inset-0 flex items-center justify-center">
              {/* Cyan Energy Burst */}
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 20, opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute w-16 h-16 rounded-full bg-[#00D4FF] blur-md"
              />
              
              <motion.div
                initial={{ scale: 0.5, opacity: 0, filter: 'blur(20px)' }}
                animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 text-5xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-white"
              >
                VISHAD NAMDEO
              </motion.div>
              
              {/* Particle ring */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: [0, 1, 0] }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute w-[400px] h-[400px] border-[2px] border-[#00D4FF]/30 rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
