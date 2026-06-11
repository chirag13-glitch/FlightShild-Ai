import HeroCanvas from "./HeroCanvas";
import { Plane } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      <HeroCanvas />

      {/* Hero content overlay */}
      <div className="absolute inset-0 z-10 flex items-center pointer-events-none">
        <div className="container mx-auto px-6">
          <div className="max-w-xl animate-fade-in">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
              <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase">AI-Powered Safety System</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none mb-4 text-foreground">
              Flight<span className="text-primary text-glow-primary">Shield</span> AI
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-md">
              Predict flight turbulence and route safety using advanced artificial intelligence.
            </p>
            <a
              href="#predict"
              className="pointer-events-auto inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground transition-all hover:opacity-90 glow-primary">
              
              <Plane className="h-5 w-5" />
              Check Flight Safety
            </a>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      
    </section>);

};

export default HeroSection;