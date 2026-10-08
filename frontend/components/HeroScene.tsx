"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

function Particles({ count = 80 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.03;
      mesh.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#a29bfe"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

function Document() {
  const meshRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={meshRef}>
        {/* Document body */}
        <RoundedBox args={[1.4, 1.8, 0.05]} radius={0.05} smoothness={4}>
          <meshPhysicalMaterial
            color="#1a1a3e"
            metalness={0.3}
            roughness={0.4}
            transparent
            opacity={0.85}
            envMapIntensity={0.5}
          />
        </RoundedBox>
        {/* Lines on document */}
        {[0.25, 0.05, -0.15, -0.35].map((y, i) => (
          <mesh key={i} position={[0, y, 0.04]} scale={[0.9, 0.04, 0.01]}>
            <boxGeometry />
            <meshStandardMaterial
              color="#a29bfe"
              transparent
              opacity={0.4 - i * 0.05}
            />
          </mesh>
        ))}
        {/* Glow circle */}
        <mesh position={[0, 0.55, 0.04]} scale={0.15}>
          <circleGeometry args={[1, 32]} />
          <meshStandardMaterial
            color="#00cec9"
            emissive="#00cec9"
            emissiveIntensity={2}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-[500px] md:h-[600px]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#6c5ce7" />
        <pointLight position={[-5, -3, 3]} intensity={0.5} color="#00cec9" />
        <Document />
        <Particles />
      </Canvas>
    </div>
  );
}
