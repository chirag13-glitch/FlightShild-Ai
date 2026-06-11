import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Stars, ContactShadows } from "@react-three/drei";
import AirplaneModel from "./AirplaneModel";
import CloudParticles from "./CloudParticles";

const HeroCanvas = () => {
  return (
    <Canvas
      camera={{ position: [0, 1, 8], fov: 45 }}
      style={{ position: "absolute", inset: 0 }}
      gl={{ antialias: true, alpha: true }}
      className="border-0 shadow-none text-primary-foreground"
    >
      <color attach="background" args={["#020617"]} />
      <fog attach="fog" args={["#020617", 10, 30]} />

      {/* Ambient fill */}
      <ambientLight intensity={0.5} />

      {/* Key light - strong cyan from top-right */}
      <directionalLight position={[5, 5, 5]} intensity={1.8} color="#00f2ff" castShadow />

      {/* Fill light - blue from left */}
      <directionalLight position={[-5, 3, -2]} intensity={0.6} color="#3b82f6" />

      {/* Rim light from behind */}
      <directionalLight position={[0, 2, -5]} intensity={1.2} color="#00d4ff" />

      {/* Accent spot from below for dramatic effect */}
      <pointLight position={[0, -2, 3]} intensity={0.4} color="#06b6d4" />
      <pointLight position={[3, 4, 0]} intensity={0.8} color="#00f2ff" />

      {/* Spotlight for hero focus */}
      <spotLight
        position={[4, 6, 4]}
        angle={0.4}
        penumbra={0.8}
        intensity={2}
        color="#00e5ff"
        castShadow
      />

      <Stars radius={100} depth={50} count={2000} factor={3} saturation={0} fade speed={0.5} />

      <Suspense fallback={null}>
        <AirplaneModel />
        <Environment preset="city" />
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.3}
          scale={20}
          blur={2}
          far={5}
          color="#00f2ff"
        />
      </Suspense>

      <CloudParticles />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
    </Canvas>
  );
};

export default HeroCanvas;
