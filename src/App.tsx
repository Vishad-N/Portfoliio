import { useState } from 'react';
import SmoothScroll from './components/SmoothScroll';
import LoadingScreen from './components/LoadingScreen';
import AnimatedCursor from './components/AnimatedCursor';
import Background from './components/Background';
import Hero from './components/Hero';
import Introduction from './components/Introduction';
import Timeline from './components/Timeline';
import Coursework from './components/Coursework';
import SkillsArchitecture from './components/SkillsArchitecture';
import Projects from './components/Projects';
import Philosophy from './components/Philosophy';
import Expertise from './components/Expertise';
import Experience from './components/Experience';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SmoothScroll>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <AnimatedCursor />
      <Background />
      <main className="relative flex flex-col min-h-screen">
        <Hero />
        <Introduction />
        <Timeline />
        <Coursework />
        <SkillsArchitecture />
        <Projects />
        <Philosophy />
        <Expertise />
        <Experience />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
