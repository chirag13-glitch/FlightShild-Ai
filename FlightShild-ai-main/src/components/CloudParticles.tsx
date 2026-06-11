import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const CloudParticles = () => {
  const groupRef = useRef<THREE.Group>(null);

  const clouds = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 15 - 5,
      ] as [number, number, number],
      scale: Math.random() * 2 + 1,
      speed: Math.random() * 0.3 + 0.1,
      id: i,
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const cloud = clouds[i];
        if (cloud) {
          child.position.x += cloud.speed * 0.02;
          if (child.position.x > 18) {
            child.position.x = -18;
          }
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {clouds.map((cloud) => (
        <mesh key={cloud.id} position={cloud.position}>
          <sphereGeometry args={[cloud.scale, 8, 8]} />
          <meshStandardMaterial
            color="#1e3a5f"
            transparent
            opacity={0.15}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};

export default CloudParticles;
