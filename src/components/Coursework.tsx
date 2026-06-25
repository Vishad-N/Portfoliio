import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Matter from 'matter-js';
import CourseworkParticles from './CourseworkParticles';
import { 
  Network, Link, Layers, ListOrdered, Share2, Hash, Braces, GripHorizontal,
  Box, Package, GitBranch, Split, Code2, Shield, Plug, Puzzle,
  Activity, GitPullRequest, Clock, Lock, HardDrive, Files, RefreshCw, FolderTree,
  Globe, Server, Route, Cable, FileText,
  Table, Filter, Database, ArrowRightLeft, Search, Merge, ShieldAlert, PenTool
} from 'lucide-react';
import { cn } from '../utils';

// --- Data Definitions ---

const COURSEWORK_DATA = [
  {
    id: 'dsa',
    title: 'DSA',
    topics: [
      { name: 'Arrays', icon: GripHorizontal },
      { name: 'Linked Lists', icon: Link },
      { name: 'Stacks', icon: Layers },
      { name: 'Queues', icon: ListOrdered },
      { name: 'Trees', icon: Network },
      { name: 'Graphs', icon: Share2 },
      { name: 'Hashing', icon: Hash },
      { name: 'DP', icon: Braces },
    ]
  },
  {
    id: 'oop',
    title: 'OOP',
    topics: [
      { name: 'Classes', icon: Box },
      { name: 'Objects', icon: Package },
      { name: 'Inheritance', icon: GitBranch },
      { name: 'Polymorphism', icon: Split },
      { name: 'Abstraction', icon: Code2 },
      { name: 'Encapsulation', icon: Shield },
      { name: 'Interfaces', icon: Plug },
      { name: 'Patterns', icon: Puzzle },
    ]
  },
  {
    id: 'os',
    title: 'OPERATING SYSTEMS',
    topics: [
      { name: 'Processes', icon: Activity },
      { name: 'Threads', icon: GitPullRequest },
      { name: 'Scheduling', icon: Clock },
      { name: 'Deadlocks', icon: Lock },
      { name: 'Memory', icon: HardDrive },
      { name: 'Paging', icon: Files },
      { name: 'Sync', icon: RefreshCw },
      { name: 'File Systems', icon: FolderTree },
    ]
  },
  {
    id: 'networks',
    title: 'COMPUTER NETWORKS',
    topics: [
      { name: 'OSI Model', icon: Layers },
      { name: 'TCP/IP', icon: Network },
      { name: 'HTTP', icon: Globe },
      { name: 'HTTPS', icon: Lock },
      { name: 'DNS', icon: Server },
      { name: 'Routing', icon: Route },
      { name: 'Sockets', icon: Cable },
      { name: 'Protocols', icon: FileText },
    ]
  },
  {
    id: 'dbms',
    title: 'DBMS',
    topics: [
      { name: 'ER Models', icon: Table },
      { name: 'Normalization', icon: Filter },
      { name: 'SQL', icon: Database },
      { name: 'Transactions', icon: ArrowRightLeft },
      { name: 'Indexing', icon: Search },
      { name: 'Joins', icon: Merge },
      { name: 'Concurrency', icon: ShieldAlert },
      { name: 'DB Design', icon: PenTool },
    ]
  }
];

export default function Coursework() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  
  // Refs for DOM nodes to update positions efficiently without React state
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bodyRefs = useRef<Matter.Body[]>([]);
  const sharedPositionsRef = useRef<{x: number, y: number}[]>([{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0}]);
  const rippleRef = useRef<{x: number, y: number, time: number}>({x: 0, y: 0, time: 0});

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Initialize Physics Engine
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Create engine
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0, scale: 0 } // Zero gravity for floating space
    });
    engineRef.current = engine;

    // Boundaries
    const wallOptions = { 
      isStatic: true, 
      render: { visible: false },
      restitution: 1, // Perfectly bouncy walls
      friction: 0
    };
    const thickness = 100;
    
    const topWall = Matter.Bodies.rectangle(width / 2, -thickness / 2, width + thickness * 2, thickness, wallOptions);
    const bottomWall = Matter.Bodies.rectangle(width / 2, height + thickness / 2, width + thickness * 2, thickness, wallOptions);
    const leftWall = Matter.Bodies.rectangle(-thickness / 2, height / 2, thickness, height + thickness * 2, wallOptions);
    const rightWall = Matter.Bodies.rectangle(width + thickness / 2, height / 2, thickness, height + thickness * 2, wallOptions);

    Matter.World.add(engine.world, [topWall, bottomWall, leftWall, rightWall]);

    // Create bodies for nodes
    const bodies = COURSEWORK_DATA.map((node, i) => {
      // Estimate radius based on text length (very rough)
      const isLongText = node.title.length > 10;
      const radius = isLongText ? 140 : 80;
      
      const x = Math.random() * (width - radius * 2) + radius;
      const y = Math.random() * (height - radius * 2) + radius;

      const body = Matter.Bodies.circle(x, y, radius, {
        restitution: 1, // Bouncy collisions
        friction: 0,
        frictionAir: 0, // No air resistance, keeps them moving
        inertia: Infinity, // Prevent rotation if we just want translation, but some rotation is fine. We'll zero angular velocity anyway.
        label: node.id
      });

      // Give initial random velocity
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 2;
      Matter.Body.setVelocity(body, {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
      });

      return body;
    });

    bodyRefs.current = bodies;
    Matter.World.add(engine.world, bodies);

    // Create Runner
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    // Render loop to sync Matter.js bodies to DOM nodes and Particles
    let animationFrameId: number;
    const updateDOM = () => {
      bodies.forEach((body, index) => {
        const domNode = nodeRefs.current[index];
        if (domNode) {
          // Center the DOM element at the body's position
          domNode.style.transform = `translate(${body.position.x}px, ${body.position.y}px)`;
        }
        // Update shared positions for shader
        sharedPositionsRef.current[index] = { x: body.position.x, y: body.position.y };
      });
      animationFrameId = requestAnimationFrame(updateDOM);
    };
    updateDOM();

    // Collision Event for Ripples
    Matter.Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs;
      if (pairs.length > 0) {
        // Just take the first pair's contact point
        const contact = pairs[0].contacts[0];
        if (contact) {
          rippleRef.current = {
            x: contact.vertex.x,
            y: contact.vertex.y,
            time: performance.now() / 1000 // Simple time in seconds
          };
        }
      }
    });

    // Handle Resize
    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      
      // Update walls
      Matter.Body.setPosition(topWall, { x: width / 2, y: -thickness / 2 });
      Matter.Body.setVertices(topWall, Matter.Bodies.rectangle(width / 2, -thickness / 2, width + thickness * 2, thickness).vertices);
      
      Matter.Body.setPosition(bottomWall, { x: width / 2, y: height + thickness / 2 });
      Matter.Body.setVertices(bottomWall, Matter.Bodies.rectangle(width / 2, height + thickness / 2, width + thickness * 2, thickness).vertices);
      
      Matter.Body.setPosition(leftWall, { x: -thickness / 2, y: height / 2 });
      Matter.Body.setVertices(leftWall, Matter.Bodies.rectangle(-thickness / 2, height / 2, thickness, height + thickness * 2).vertices);
      
      Matter.Body.setPosition(rightWall, { x: width + thickness / 2, y: height / 2 });
      Matter.Body.setVertices(rightWall, Matter.Bodies.rectangle(width + thickness / 2, height / 2, thickness, height + thickness * 2).vertices);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
    };
  }, []);

  // Handle Hover Interaction
  const handleMouseEnter = (index: number) => {
    const body = bodyRefs.current[index];
    if (body) {
      Matter.Body.setStatic(body, true);
      setHoveredNode(COURSEWORK_DATA[index].id);
    }
  };

  const handleMouseLeave = (index: number) => {
    const body = bodyRefs.current[index];
    if (body) {
      Matter.Body.setStatic(body, false);
      // Give it a kick to start moving again if it lost momentum
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 2;
      Matter.Body.setVelocity(body, {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
      });
      setHoveredNode(null);
    }
  };

  return (
    <section className="relative min-h-[900px] py-32 overflow-hidden bg-bg flex flex-col">
      {/* Living Microbial Ecosystem */}
      <CourseworkParticles 
        sharedPositionsRef={sharedPositionsRef} 
        hoveredIndex={hoveredNode ? COURSEWORK_DATA.findIndex(n => n.id === hoveredNode) : -1} 
        rippleRef={rippleRef}
      />

      <div className="container mx-auto px-6 relative z-10 pointer-events-none">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-text-primary uppercase">
          Coursework
          <span className="block text-accent-cyan text-2xl md:text-3xl mt-2 tracking-widest font-mono">
            Knowledge Ecosystem
          </span>
        </h2>
      </div>

      {/* Physics Container */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 z-10 w-full h-full pt-48"
      >
        {COURSEWORK_DATA.map((node, i) => {
          const isHovered = hoveredNode === node.id;
          
          return (
            <div
              key={node.id}
              ref={(el) => { nodeRefs.current[i] = el; }}
              className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2"
            >
              {/* Main Node */}
              <motion.div
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={() => handleMouseLeave(i)}
                animate={{
                  scale: isHovered ? 1.1 : 1,
                  textShadow: isHovered 
                    ? '0 0 20px rgba(0,212,255,0.8), 0 0 40px rgba(0,212,255,0.4)' 
                    : '0 0 10px rgba(0,212,255,0.3)',
                  color: isHovered ? '#00D4FF' : '#F8FAFC'
                }}
                className={cn(
                  "cursor-pointer select-none font-bold tracking-tighter transition-colors duration-300 relative z-20 flex items-center justify-center text-center leading-none",
                  node.title.length > 10 ? "text-4xl md:text-5xl w-[280px]" : "text-5xl md:text-7xl w-[160px]"
                )}
              >
                {node.title}
              </motion.div>

              {/* Expanding Topics */}
              <AnimatePresence>
                {isHovered && node.topics.map((topic, index) => {
                  const angle = (index / node.topics.length) * Math.PI * 2;
                  const radius = node.title.length > 10 ? 220 : 180;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;

                  const Icon = topic.icon;

                  return (
                    <motion.div
                      key={topic.name}
                      initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                      animate={{ opacity: 1, x, y, scale: 1 }}
                      exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                      transition={{ 
                        type: 'spring', 
                        stiffness: 200, 
                        damping: 20,
                        delay: index * 0.05 
                      }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10"
                    >
                      {/* Connecting Line (SVG drawing could be complex here, so we use a CSS line pointing to center) */}
                      <div 
                        className="absolute bg-accent-cyan/30 h-[1px] origin-left"
                        style={{
                          width: `${radius}px`,
                          transform: `rotate(${angle + Math.PI}rad)`,
                          left: '50%',
                          top: '50%',
                          zIndex: -1
                        }}
                      />
                      
                      <div className="bg-bg/80 backdrop-blur-md border border-glass-border px-3 py-1.5 rounded-lg flex items-center gap-2 whitespace-nowrap shadow-[0_0_15px_rgba(0,212,255,0.15)] text-text-primary">
                        <Icon className="w-4 h-4 text-accent-cyan" />
                        <span className="text-sm font-mono tracking-wider">{topic.name}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
