import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-glass-border relative z-20 bg-bg">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          <div className="flex flex-col items-center md:items-start">
            <span className="text-xl font-bold tracking-tight mb-1">VISHAD NAMDEO</span>
            <span className="text-sm text-text-muted">Full Stack Developer</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="https://github.com/Vishad-N" className="text-text-muted hover:text-accent-cyan transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/vishad-namdeo-677b98250/" className="text-text-muted hover:text-accent-cyan transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="mailto:vishadnamdeo09@gmail.com?subject=Portfolio Inquiry" className="text-text-muted hover:text-accent-cyan transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>

          <div className="text-xs font-mono tracking-widest text-text-muted uppercase">
            Built with Next.js
          </div>

        </div>
      </div>
    </footer>
  );
}
