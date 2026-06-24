import { useEffect, useRef } from 'react';
import { useInView } from 'motion/react';

interface Node3D {
  y: number;
  theta: number;
  strand: number;
  glowMultiplier: number;
  connections: number[];
}

interface EnergyPacket {
  nodeIndex: number;
  targetIndex: number;
  progress: number;
  speed: number;
}

export default function EngineeringDNA() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "100px" });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isInView) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    
    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse tracking
    let mouseX = -1000;
    let mouseY = -1000;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // DNA Structure Configuration
    const numNodes = 30; // nodes per strand
    const nodes: Node3D[] = [];
    const packets: EnergyPacket[] = [];
    
    // Generate nodes
    for (let i = 0; i < numNodes; i++) {
      const yPos = (i / (numNodes - 1)) - 0.5; // -0.5 to 0.5
      const theta = i * 0.4;
      
      // Strand A
      nodes.push({ y: yPos, theta, strand: 0, glowMultiplier: 0, connections: [i * 2 + 1, i * 2 + 2] });
      // Strand B
      nodes.push({ y: yPos, theta: theta + Math.PI, strand: 1, glowMultiplier: 0, connections: [i * 2, i * 2 + 3] });
    }
    
    // Clean up connections for last nodes
    nodes[nodes.length - 2].connections = [nodes.length - 1];
    nodes[nodes.length - 1].connections = [nodes.length - 2];

    // Initialize random energy packets
    for (let i = 0; i < 15; i++) {
      const start = Math.floor(Math.random() * (nodes.length - 2));
      const target = nodes[start].connections[Math.floor(Math.random() * nodes[start].connections.length)];
      packets.push({
        nodeIndex: start,
        targetIndex: target,
        progress: Math.random(),
        speed: 0.01 + Math.random() * 0.02
      });
    }

    // Ambient floating dust
    const dust = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: Math.random() * 2 - 1,
      speedY: (Math.random() - 0.5) * 0.005,
      speedX: (Math.random() - 0.5) * 0.005,
      size: Math.random() * 1.5
    }));

    const render = () => {
      time += 0.005;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Projection settings
      const fov = 250;
      const radius = Math.min(width * 0.25, 120);
      const verticalSpan = height * 0.8;
      
      // Calculate 3D to 2D
      const projectedNodes = nodes.map(node => {
        const x3d = Math.sin(node.theta + time) * radius;
        const z3d = Math.cos(node.theta + time) * radius;
        const y3d = node.y * verticalSpan;
        
        const scale = fov / (fov + z3d);
        const x2d = width / 2 + x3d * scale;
        const y2d = height / 2 + y3d * scale;
        
        // Hover interaction
        const dist = Math.hypot(mouseX - x2d, mouseY - y2d);
        if (dist < 80) {
          node.glowMultiplier += (1 - node.glowMultiplier) * 0.1;
        } else {
          node.glowMultiplier += (0 - node.glowMultiplier) * 0.05;
        }

        return { x: x2d, y: y2d, scale, z: z3d, node };
      });

      // Sort by Z to draw back-to-front (simple painters algorithm)
      const sortedIndices = projectedNodes.map((_, i) => i).sort((a, b) => projectedNodes[b].z - projectedNodes[a].z);

      // Draw dust
      ctx.fillStyle = 'rgba(0, 210, 255, 0.4)';
      dust.forEach(d => {
        d.y += d.speedY;
        d.x += d.speedX;
        if (d.y > 1) d.y = -1;
        if (d.y < -1) d.y = 1;
        if (d.x > 1) d.x = -1;
        if (d.x < -1) d.x = 1;
        
        const scale = fov / (fov + d.z * radius);
        const x2d = width / 2 + d.x * (width / 2) * scale;
        const y2d = height / 2 + d.y * (height / 2) * scale;
        
        ctx.beginPath();
        ctx.arc(x2d, y2d, d.size * scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Blueprint UI rings
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(width/2, height/2, radius * 1.5, radius * 0.4, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(width/2, height/2 - verticalSpan/2, radius * 1.2, radius * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(width/2, height/2 + verticalSpan/2, radius * 1.2, radius * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Connections (Rungs and Backbone)
      ctx.lineWidth = 1;
      for (const i of sortedIndices) {
        const p1 = projectedNodes[i];
        
        for (const targetIdx of p1.node.connections) {
          if (targetIdx >= projectedNodes.length) continue;
          const p2 = projectedNodes[targetIdx];
          
          // Faded connections in the back
          const avgZ = (p1.z + p2.z) / 2;
          const opacity = Math.max(0.05, 1 - (avgZ + radius) / (radius * 2));
          
          ctx.strokeStyle = `rgba(0, 210, 255, ${opacity * 0.4})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Draw Energy Packets
      packets.forEach(packet => {
        packet.progress += packet.speed;
        if (packet.progress >= 1) {
          packet.progress = 0;
          packet.nodeIndex = packet.targetIndex;
          const possibleTargets = nodes[packet.nodeIndex].connections.filter(c => c < nodes.length);
          if (possibleTargets.length > 0) {
            packet.targetIndex = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
          } else {
            packet.targetIndex = Math.max(0, packet.nodeIndex - 2); // backtrack
          }
        }
        
        const p1 = projectedNodes[packet.nodeIndex];
        const p2 = projectedNodes[packet.targetIndex];
        if (!p1 || !p2) return;

        const currX = p1.x + (p2.x - p1.x) * packet.progress;
        const currY = p1.y + (p2.y - p1.y) * packet.progress;
        const currScale = p1.scale + (p2.scale - p1.scale) * packet.progress;

        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00D2FF';
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(currX, currY, 2 * currScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // Draw Nodes
      for (const i of sortedIndices) {
        const p = projectedNodes[i];
        const opacity = Math.max(0.1, 1 - (p.z + radius) / (radius * 2));
        
        const baseRadius = p.node.strand === 0 ? 2.5 : 2;
        const hoverScale = 1 + p.node.glowMultiplier * 1.5;
        
        ctx.fillStyle = p.node.strand === 0 
          ? `rgba(0, 210, 255, ${opacity})` 
          : `rgba(140, 92, 245, ${opacity})`; // Purple for secondary strand

        if (p.node.glowMultiplier > 0.01) {
          ctx.shadowBlur = p.node.glowMultiplier * 15;
          ctx.shadowColor = p.node.strand === 0 ? '#00D2FF' : '#8C5CF5';
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, baseRadius * p.scale * hoverScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Blueprint technical marker
        if (i % 4 === 0 && p.z < 0) {
          ctx.fillStyle = `rgba(0, 210, 255, ${opacity * 0.5})`;
          ctx.font = `${8 * p.scale}px monospace`;
          ctx.fillText(`N-${i}`, p.x + 10 * p.scale, p.y);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isInView]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[600px] relative">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair opacity-80 mix-blend-screen"
        style={{ transition: 'opacity 1s ease-in-out', opacity: isInView ? 0.8 : 0 }}
      />
      {/* Decorative Blueprint Corner Marks */}
      <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-accent-cyan/30" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-accent-cyan/30" />
    </div>
  );
}
