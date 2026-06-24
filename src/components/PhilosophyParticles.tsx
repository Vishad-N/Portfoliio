import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { MotionValue } from 'motion/react';
import { philosophyVertexShader, philosophyFragmentShader } from './PhilosophyShader';

const PARTICLE_COUNT = 30000;

const statements = [
  "I don't build websites.",
  "I build systems.",
  "I build experiences.",
  "I solve problems."
];

function getTextPositions(text: string, count: number) {
  const width = 1200;
  const height = 400;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return new Float32Array(count * 3);

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#ffffff';
  // Use a bold sans-serif to ensure fat letterforms for dense particles
  ctx.font = `bold ${width * 0.08}px "Space Grotesk", system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  const imgData = ctx.getImageData(0, 0, width, height).data;
  const validPixels = [];
  // Sample every few pixels for better performance and distribution
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      const index = (y * width + x) * 4;
      if (imgData[index] > 128) {
        validPixels.push({ x, y });
      }
    }
  }

  const positions = new Float32Array(count * 3);
  if (validPixels.length === 0) return positions;

  for (let i = 0; i < count; i++) {
    // 40% of particles will float ambiently around the whole screen
    const isAmbient = Math.random() < 0.4;
    let p;
    
    if (isAmbient) {
      p = { x: Math.random() * width, y: Math.random() * height };
    } else {
      p = validPixels[Math.floor(Math.random() * validPixels.length)];
    }

    const aspect = width / height;
    // Scale the spread to match the camera frustum
    // X spread is ~60 units, Y spread is ~30 units to cover whole screen
    positions[i * 3] = ((p.x / width) * 2 - 1) * 30 * aspect;
    positions[i * 3 + 1] = -((p.y / height) * 2 - 1) * 25;
    
    // Ambient particles get much more Z depth to create parallax
    positions[i * 3 + 2] = isAmbient ? (Math.random() - 0.5) * 20.0 : (Math.random() - 0.5) * 1.5; 
  }

  return positions;
}

function Particles({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const [pos0, pos1, pos2, pos3, randoms] = useMemo(() => {
    const p0 = getTextPositions(statements[0], PARTICLE_COUNT);
    const p1 = getTextPositions(statements[1], PARTICLE_COUNT);
    const p2 = getTextPositions(statements[2], PARTICLE_COUNT);
    const p3 = getTextPositions(statements[3], PARTICLE_COUNT);
    
    const r = new Float32Array(PARTICLE_COUNT * 3);
    for(let i=0; i<PARTICLE_COUNT*3; i++) {
      r[i] = Math.random();
    }
    
    return [p0, p1, p2, p3, r];
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 }
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uProgress.value = scrollYProgress.get();
    }
  });

  return (
    <points>
      <bufferGeometry>
        {/* We use pos0 as the default position attribute, shader will overwrite with finalPos */}
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={pos0} itemSize={3} />
        <bufferAttribute attach="attributes-pos0" count={PARTICLE_COUNT} array={pos0} itemSize={3} />
        <bufferAttribute attach="attributes-pos1" count={PARTICLE_COUNT} array={pos1} itemSize={3} />
        <bufferAttribute attach="attributes-pos2" count={PARTICLE_COUNT} array={pos2} itemSize={3} />
        <bufferAttribute attach="attributes-pos3" count={PARTICLE_COUNT} array={pos3} itemSize={3} />
        <bufferAttribute attach="attributes-aRandom" count={PARTICLE_COUNT} array={randoms} itemSize={3} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={philosophyVertexShader}
        fragmentShader={philosophyFragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function PhilosophyParticles({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-80 mix-blend-screen">
      <Canvas camera={{ position: [0, 0, 45], fov: 45 }} dpr={[1, 2]}>
        <Particles scrollYProgress={scrollYProgress} />
      </Canvas>
    </div>
  );
}
