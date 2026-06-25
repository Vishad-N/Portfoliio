import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Contact() {
  return (
    <section className="py-32 md:py-48 relative z-20 overflow-hidden">

      {/* Intense Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[800px] h-[800px] bg-accent-cyan/10 rounded-full blur-[150px] opacity-50 mix-blend-screen" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-12 items-start">

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-6xl md:text-8xl lg:text-[7rem] leading-[0.9] font-bold tracking-tighter"
            >
              LET'S BUILD<br />
              SOMETHING<br />
              <span className="text-accent-cyan">AMBITIOUS.</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-bg/50 backdrop-blur-xl border border-glass-border p-8 md:p-12 rounded-3xl"
          >
            <form className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-mono tracking-widest uppercase text-text-muted">Name</label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-glass-border py-4 text-xl focus:outline-none focus:border-accent-cyan transition-colors"
                  placeholder="Your Name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono tracking-widest uppercase text-text-muted">Email</label>
                <input
                  type="email"
                  className="w-full bg-transparent border-b border-glass-border py-4 text-xl focus:outline-none focus:border-accent-cyan transition-colors"
                  placeholder="yourname@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono tracking-widest uppercase text-text-muted">Message</label>
                <textarea
                  className="w-full bg-transparent border-b border-glass-border py-4 text-xl focus:outline-none focus:border-accent-cyan transition-colors min-h-[120px] resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="button"
                className="group relative w-full overflow-hidden bg-text-primary text-bg py-5 rounded-full font-semibold text-lg flex items-center justify-center gap-2 mt-4 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10">Send Message</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-accent-cyan transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out" />
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
