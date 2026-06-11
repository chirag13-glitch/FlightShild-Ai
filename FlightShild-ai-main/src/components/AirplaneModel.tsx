import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const AirplaneModel = () => {
  const { scene } = useGLTF("/models/Airplane.glb");
  const ref = useRef<THREE.Group>(null);

  // Enhance materials for a more detailed, premium look
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.metalness = 0.85;
          mat.roughness = 0.15;
          mat.envMapIntensity = 2.5;
          mat.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      ref.current.position.y = 1.2 + Math.sin(t * 0.5) * 0.3;
      ref.current.rotation.z = Math.sin(t * 0.3) * 0.02;
      ref.current.rotation.x = Math.sin(t * 0.4) * 0.01;
    }
  });

  return (
    <group ref={ref} position={[2.5, 1.2, 0]} rotation={[0, -Math.PI / 6, 0]} scale={1.1}>
      <primitive object={scene} />
    </group>
  );
};

useGLTF.preload("/models/Airplane.glb");

export default AirplaneModel;
