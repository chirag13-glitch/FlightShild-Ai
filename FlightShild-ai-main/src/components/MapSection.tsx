import { Map, Navigation } from "lucide-react";
import { FlightStatus } from "@/pages/Index";

interface MapSectionProps {
  status: FlightStatus;
  sourceCity: string;
  destinationCity: string;
}

const MapSection = ({ status, sourceCity, destinationCity }: MapSectionProps) => {
  // Determine colors based on status
  let gradientStart = "#00f2ff";
  let gradientEnd = "#3b82f6";
  
  if (status === "safe") {
    gradientStart = "#10b981"; // Green
    gradientEnd = "#059669";
  } else if (status === "moderate") {
    gradientStart = "#fbbf24"; // Yellow/Orange
    gradientEnd = "#d97706";
  } else if (status === "severe") {
    gradientStart = "#ef4444"; // Red
    gradientEnd = "#b91c1c";
  }

  const isPredicting = status !== "idle" && status !== undefined;

  return (
    <section id="map" className="relative py-24 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
            Route <span className="text-primary">Visualization</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            Interactive flight path mapping with real-time safety overlays.
          </p>
        </div>

        <div className="glass-strong rounded-2xl overflow-hidden relative animate-slide-up" style={{ height: 400 }}>
          {/* Stylized map placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Grid lines */}
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={`h-${i}`} className="absolute border-t border-primary" style={{ top: `${(i + 1) * 10}%`, left: 0, right: 0 }} />
              ))}
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={`v-${i}`} className="absolute border-l border-primary" style={{ left: `${(i + 1) * 6.25}%`, top: 0, bottom: 0 }} />
              ))}
            </div>

            {/* Route line */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400">
              <defs>
                <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={gradientStart} />
                  <stop offset="100%" stopColor={gradientEnd} />
                </linearGradient>
              </defs>
              <path
                d="M 150 280 Q 400 80 650 200"
                stroke="url(#routeGrad)"
                strokeWidth={isPredicting ? "4" : "2.5"}
                fill="none"
                strokeDasharray="8 4"
                opacity={isPredicting ? "1" : "0.5"}
                className={isPredicting ? "animate-pulse" : ""}
              />
            </svg>

            {/* Source dot */}
            <div className="absolute" style={{ left: "18%", top: "68%" }}>
              <div 
                className={`h-4 w-4 rounded-full animate-pulse-glow ${isPredicting ? 'bg-primary' : 'bg-primary/50'}`} 
                style={{ backgroundColor: isPredicting ? gradientStart : undefined }}
              />
              <span className="absolute top-5 -left-3 text-xs font-mono text-primary whitespace-nowrap">
                {sourceCity || "SRC"}
              </span>
            </div>

            {/* Destination dot */}
            <div className="absolute" style={{ left: "80%", top: "48%" }}>
              <div 
                className={`h-4 w-4 rounded-full animate-pulse-glow ${isPredicting ? 'bg-primary' : 'bg-primary/50'}`}
                style={{ backgroundColor: isPredicting ? gradientEnd : undefined }}
              />
              <span className="absolute top-5 -left-3 text-xs font-mono text-primary whitespace-nowrap">
                {destinationCity || "DST"}
              </span>
            </div>

            {/* Center label */}
            <div className={`flex flex-col items-center gap-3 transition-opacity duration-500 ${isPredicting ? 'opacity-100' : 'opacity-40'}`}>
              <Map className="h-10 w-10" style={{ color: isPredicting ? gradientEnd : undefined }} />
              <span className="text-sm font-mono text-muted-foreground">Flight Route Map</span>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: isPredicting ? gradientStart : undefined }}>
                <Navigation className="h-3.5 w-3.5" />
                <span className="font-mono">
                  {status === "idle" ? "Fill form to visualize" : `Status: ${status.toUpperCase()}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
