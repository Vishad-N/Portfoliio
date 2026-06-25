import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 15000;

const vertexShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uNodes[5];
  uniform int uHoveredNode;
  uniform vec3 uRipple; // x, y, age

  attribute float aSize;
  attribute float aPhase;

  varying float vAlpha;
  varying float vColorMix;

  // Simple noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                       -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Calculate the Signed Distance Field (SDF) for the boolean union of all nodes
  float getSDF(vec2 p) {
    float d = 99999.0;
    for (int i = 0; i < 5; i++) {
      if (uNodes[i].x == -9999.0) continue;
      float r = (uHoveredNode == i) ? 280.0 : 180.0;
      float sd = length(p - uNodes[i]) - r;
      d = min(d, sd);
    }
    return d;
  }

  void main() {
    // Base position in clip space
    vec3 pos = position;
    
    // Organic drift
    float noise1 = snoise(vec2(pos.x * 2.0 + uTime * 0.2, pos.y * 2.0));
    float noise2 = snoise(vec2(pos.y * 2.0 - uTime * 0.15, pos.x * 2.0));
    
    pos.x += noise1 * 0.05;
    pos.y += noise2 * 0.05;

    // Convert clip space back to pixel space for distance calculations
    vec2 pixelPos = vec2(
      (pos.x * 0.5 + 0.5) * uResolution.x,
      (-pos.y * 0.5 + 0.5) * uResolution.y // Y is inverted in clip space
    );

    float globalDensity = 1.0;

    // 1. Boolean Union Repulsion (Cellular Membrane)
    float d = getSDF(pixelPos);
    
    if (d < 0.0) {
      // Particle is inside the merged exclusion zone.
      // Calculate gradient to find the shortest path to the outer boundary.
      float eps = 1.0;
      float dx = getSDF(pixelPos + vec2(eps, 0.0)) - getSDF(pixelPos - vec2(eps, 0.0));
      float dy = getSDF(pixelPos + vec2(0.0, eps)) - getSDF(pixelPos - vec2(0.0, eps));
      vec2 grad = vec2(dx, dy);
      
      if (length(grad) > 0.0001) {
        grad = normalize(grad);
        // Project it strictly outside the union boundary.
        // Add a slight noise-based padding to create an organic, thick membrane instead of a razor-sharp line.
        float padding = 5.0 + abs(noise2) * 15.0;
        pixelPos += grad * (-d + padding);
      }
    }

    // 2. Hover Orbit (Applies to the membrane perimeter)
    if (uHoveredNode != -1) {
      vec2 diff = pixelPos - uNodes[uHoveredNode];
      float dist = length(diff);
      float hoverRadius = 280.0;
      
      if (dist > hoverRadius - 10.0 && dist < hoverRadius + 60.0) {
        vec2 dir = normalize(diff);
        pixelPos += vec2(-dir.y, dir.x) * 6.0; // Tangential flow
        globalDensity += 0.25; // Brighten the active orbit
      }
    }

    // Ripple Collision Wave
    if (uRipple.z > 0.0 && uRipple.z < 2.0) {
      float rippleAge = uRipple.z;
      vec2 diff = pixelPos - uRipple.xy;
      float dist = length(diff);
      float rippleRadius = rippleAge * 800.0; // Speed of wave
      float wave = smoothstep(rippleRadius - 100.0, rippleRadius, dist) * smoothstep(rippleRadius + 100.0, rippleRadius, dist);
      pixelPos += normalize(diff) * wave * 50.0;
    }

    // Convert modified pixel space back to clip space
    pos.x = (pixelPos.x / uResolution.x) * 2.0 - 1.0;
    pos.y = -(pixelPos.y / uResolution.y) * 2.0 + 1.0;

    gl_Position = vec4(pos.x, pos.y, 0.0, 1.0);
    
    // Varyings
    vAlpha = (0.5 + 0.5 * abs(noise1)) * globalDensity;
    vColorMix = (noise1 + 1.0) * 0.5; // 0 to 1

    gl_PointSize = max(aSize * (1.0 + vAlpha) * (uResolution.y / 800.0), 4.0);
  }
`;

const fragmentShader = `
  varying float vAlpha;
  varying float vColorMix;

  void main() {
    // Circular particle with soft edge
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;
    
    float glow = smoothstep(0.5, 0.1, dist);

    // Cyan to White to Subtle Purple
    vec3 colCyan = vec3(0.0, 0.83, 1.0); // #00D4FF
    vec3 colPurple = vec3(0.54, 0.36, 0.96); // #8B5CF6
    
    vec3 finalColor = mix(colCyan, colPurple, vColorMix);
    finalColor = mix(finalColor, vec3(1.0), glow * 0.5);

    gl_FragColor = vec4(finalColor, glow * vAlpha);
  }
`;

interface ParticlesProps {
  sharedPositionsRef: React.MutableRefObject<{x: number, y: number}[]>;
  hoveredIndex: number;
  rippleRef: React.MutableRefObject<{x: number, y: number, time: number}>;
}

function ParticlesSystem({ sharedPositionsRef, hoveredIndex, rippleRef }: ParticlesProps) {
  const { size } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const particlesData = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const phases = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Random position in clip space (-1 to 1)
      positions[i * 3] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = 0;

      sizes[i] = Math.random() * 3 + 1;
      phases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, sizes, phases };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(particlesData.positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(particlesData.sizes, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(particlesData.phases, 1));
    return geo;
  }, [particlesData]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
      materialRef.current.uniforms.uHoveredNode.value = hoveredIndex;
      
      const nodes = sharedPositionsRef.current;
      for (let i = 0; i < 5; i++) {
        if (nodes[i]) {
          const nx = isNaN(nodes[i].x) ? -9999 : nodes[i].x;
          const ny = isNaN(nodes[i].y) ? -9999 : nodes[i].y;
          materialRef.current.uniforms.uNodes.value[i].set(nx, ny);
        }
      }

      if (rippleRef.current.time > 0) {
        const now = performance.now() / 1000;
        const age = now - rippleRef.current.time;
        if (age < 2.0) {
          materialRef.current.uniforms.uRipple.value.set(
            rippleRef.current.x,
            rippleRef.current.y,
            age
          );
        } else {
          materialRef.current.uniforms.uRipple.value.set(0, 0, 0);
        }
      }
    }
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1920, 1080) },
    uNodes: { value: [new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()] },
    uHoveredNode: { value: -1 },
    uRipple: { value: new THREE.Vector3() }
  }), []);

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function CourseworkParticles({ sharedPositionsRef, hoveredIndex, rippleRef }: ParticlesProps) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none w-full h-full">
      <Canvas camera={{ position: [0, 0, 1], zoom: 1 }}>
        <ParticlesSystem 
          sharedPositionsRef={sharedPositionsRef} 
          hoveredIndex={hoveredIndex} 
          rippleRef={rippleRef}
        />
      </Canvas>
    </div>
  );
}
