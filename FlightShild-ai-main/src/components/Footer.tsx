import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-10 px-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold text-foreground">FlightShield AI</span>
        </div>
        <p className="text-xs text-muted-foreground font-mono">
          © 2026 FlightShield AI. Aerospace-grade flight safety prediction.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
