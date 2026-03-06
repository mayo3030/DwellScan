'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function HouseModel() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15 + Math.PI * -0.15;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  const goldColor = useMemo(() => new THREE.Color('#c9a24a'), []);
  const darkGold = useMemo(() => new THREE.Color('#8b6914'), []);

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} scale={1.1}>
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[2.4, 0.1, 2]} />
          <meshStandardMaterial color={darkGold} metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[2, 1.1, 1.6]} />
          <meshStandardMaterial color="#0f1318" metalness={0.1} roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.45, 0]}>
          <coneGeometry args={[1.6, 0.8, 4]} />
          <meshStandardMaterial color={goldColor} metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.35, 0.81]}>
          <boxGeometry args={[0.4, 0.7, 0.02]} />
          <meshStandardMaterial color={goldColor} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.12, 0.35, 0.83]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.1} />
        </mesh>
        <mesh position={[-0.55, 0.6, 0.81]}>
          <boxGeometry args={[0.35, 0.35, 0.02]} />
          <meshStandardMaterial color="#88ccff" transparent opacity={0.3} metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[-0.55, 0.6, 0.82]}>
          <boxGeometry args={[0.38, 0.02, 0.01]} />
          <meshStandardMaterial color={goldColor} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-0.55, 0.6, 0.82]}>
          <boxGeometry args={[0.02, 0.38, 0.01]} />
          <meshStandardMaterial color={goldColor} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.55, 0.6, 0.81]}>
          <boxGeometry args={[0.35, 0.35, 0.02]} />
          <meshStandardMaterial color="#88ccff" transparent opacity={0.3} metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.55, 0.6, 0.82]}>
          <boxGeometry args={[0.38, 0.02, 0.01]} />
          <meshStandardMaterial color={goldColor} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.55, 0.6, 0.82]}>
          <boxGeometry args={[0.02, 0.38, 0.01]} />
          <meshStandardMaterial color={goldColor} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.6, 1.5, -0.3]}>
          <boxGeometry args={[0.25, 0.6, 0.25]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.2} roughness={0.7} />
        </mesh>
        <mesh position={[0.6, 1.82, -0.3]}>
          <boxGeometry args={[0.32, 0.05, 0.32]} />
          <meshStandardMaterial color={goldColor} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.8, 0.008, 8, 64]} />
          <meshStandardMaterial color={goldColor} emissive={goldColor} emissiveIntensity={2} transparent opacity={0.6} />
        </mesh>
      </group>
    </Float>
  );
}

function ScanRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ringRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
      ringRef.current.scale.set(scale, scale, scale);
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });
  return (
    <mesh ref={ringRef} position={[0, 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[2.2, 0.003, 8, 128]} />
      <meshStandardMaterial color="#c9a24a" emissive="#c9a24a" emissiveIntensity={3} transparent opacity={0.3} />
    </mesh>
  );
}

export default function ThreeScene() {
  return (
    <div className="w-full h-[500px] md:h-[600px]">
      <Canvas
        camera={{ position: [0, 1.2, 4.5], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-3, 3, -3]} intensity={0.3} color="#c9a24a" />
          <pointLight position={[0, 2, 2]} intensity={0.5} color="#c9a24a" distance={8} />
          <HouseModel />
          <ScanRing />
          <ContactShadows position={[0, -0.1, 0]} opacity={0.4} scale={5} blur={2.5} far={3} color="#c9a24a" />
        </Suspense>
      </Canvas>
    </div>
  );
}
