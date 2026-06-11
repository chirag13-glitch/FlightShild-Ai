import { Shield } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center gap-3">
          <Shield className="h-7 w-7 text-primary" />
          <span className="text-lg font-bold tracking-tight text-foreground">
            FlightShield <span className="text-primary">AI</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#hero" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</a>
          <a href="#predict" className="text-sm text-muted-foreground hover:text-primary transition-colors">Predict</a>
          <a href="#map" className="text-sm text-muted-foreground hover:text-primary transition-colors">Map</a>
        </div>
        <a
          href="#predict"
          className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 glow-primary"
        >
          Get Started
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
