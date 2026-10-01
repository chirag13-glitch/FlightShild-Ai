import { Map, Navigation, ShieldCheck, AlertTriangle, ArrowUpRight, Gauge } from "lucide-react";
import { FlightStatus, RoutePlan } from "@/pages/Index";

interface MapSectionProps {
  status: FlightStatus;
  sourceCity: string;
  destinationCity: string;
  routePlan?: RoutePlan | null;
}

const MapSection = ({ status, sourceCity, destinationCity, routePlan }: MapSectionProps) => {
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
  const hasReroute = routePlan?.has_reroute;

  return (
    <section id="map" className="relative py-24 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
            AI Route <span className="text-primary">Optimization & Mapping</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            Dynamic flight path analysis with intelligent turbulence avoidance corridors.
          </p>
        </div>

        <div className="glass-strong rounded-2xl overflow-hidden relative animate-slide-up" style={{ height: 420 }}>
          {/* Map canvas */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Grid background */}
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={`h-${i}`} className="absolute border-t border-primary" style={{ top: `${(i + 1) * 10}%`, left: 0, right: 0 }} />
              ))}
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={`v-${i}`} className="absolute border-l border-primary" style={{ left: `${(i + 1) * 6.25}%`, top: 0, bottom: 0 }} />
              ))}
            </div>

            {/* Flight Path SVG */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 420">
              <defs>
                <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={gradientStart} />
                  <stop offset="100%" stopColor={gradientEnd} />
                </linearGradient>
                <linearGradient id="detourGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>

              {/* Hazard Zone Marker if reroute */}
              {hasReroute && (
                <g className="animate-pulse">
                  <circle cx="400" cy="180" r="45" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
                  <text x="400" y="185" textAnchor="middle" fill="#ef4444" fontSize="10" fontFamily="monospace">
                    HAZARD ZONE
                  </text>
                </g>
              )}

              {/* Direct Path */}
              <path
                d="M 150 280 Q 400 180 650 200"
                stroke={hasReroute ? "#ef4444" : "url(#routeGrad)"}
                strokeWidth={hasReroute ? "2" : (isPredicting ? "4" : "2.5")}
                fill="none"
                strokeDasharray={hasReroute ? "6 6" : "8 4"}
                opacity={hasReroute ? "0.6" : (isPredicting ? "1" : "0.5")}
                className={isPredicting && !hasReroute ? "animate-pulse" : ""}
              />

              {/* Optimized Detour Path */}
              {hasReroute && (
                <path
                  d="M 150 280 Q 400 60 650 200"
                  stroke="url(#detourGrad)"
                  strokeWidth="3.5"
                  fill="none"
                  className="animate-pulse"
                />
              )}
            </svg>

            {/* Source dot */}
            <div className="absolute" style={{ left: "18%", top: "65%" }}>
              <div 
                className={`h-4 w-4 rounded-full animate-pulse-glow ${isPredicting ? 'bg-primary' : 'bg-primary/50'}`} 
                style={{ backgroundColor: isPredicting ? gradientStart : undefined }}
              />
              <span className="absolute top-5 -left-4 text-xs font-mono font-bold text-primary whitespace-nowrap bg-background/80 px-2 py-0.5 rounded border border-border">
                {sourceCity || routePlan?.source || "SRC"}
              </span>
            </div>

            {/* Destination dot */}
            <div className="absolute" style={{ left: "80%", top: "46%" }}>
              <div 
                className={`h-4 w-4 rounded-full animate-pulse-glow ${isPredicting ? 'bg-primary' : 'bg-primary/50'}`} 
                style={{ backgroundColor: isPredicting ? gradientEnd : undefined }}
              />
              <span className="absolute top-5 -left-4 text-xs font-mono font-bold text-primary whitespace-nowrap bg-background/80 px-2 py-0.5 rounded border border-border">
                {destinationCity || routePlan?.destination || "DST"}
              </span>
            </div>

            {/* Center label */}
            <div className={`flex flex-col items-center gap-2 transition-opacity duration-500 ${isPredicting ? 'opacity-100' : 'opacity-40'}`}>
              <Map className="h-9 w-9" style={{ color: isPredicting ? gradientEnd : undefined }} />
              <span className="text-sm font-mono text-muted-foreground">Flight Corridor Optimizer</span>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: isPredicting ? gradientStart : undefined }}>
                <Navigation className="h-3.5 w-3.5" />
                <span className="font-mono">
                  {status === "idle" ? "Submit parameters to optimize" : `Condition: ${status.toUpperCase()}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Route Optimizer Metrics Panel */}
        {routePlan && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
            <div className="glass-strong rounded-xl p-4 border border-border">
              <span className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-1.5">
                <Navigation className="h-3.5 w-3.5 text-primary" /> Distance
              </span>
              <div className="mt-2 text-lg font-mono font-semibold text-foreground">
                {hasReroute ? `${routePlan.metrics.optimized_distance_km} km` : `${routePlan.metrics.direct_distance_km} km`}
              </div>
              <span className="text-xs text-muted-foreground">
                {hasReroute ? `+${routePlan.metrics.extra_distance_km} km detour` : "Optimal direct path"}
              </span>
            </div>

            <div className="glass-strong rounded-xl p-4 border border-border">
              <span className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5 text-primary" /> Est. Flight Time
              </span>
              <div className="mt-2 text-lg font-mono font-semibold text-foreground">
                {Math.floor(routePlan.metrics.optimized_flight_time_mins / 60)}h {routePlan.metrics.optimized_flight_time_mins % 60}m
              </div>
              <span className="text-xs text-muted-foreground">
                {hasReroute ? `+${routePlan.metrics.extra_time_mins} min reroute` : "On-schedule"}
              </span>
            </div>

            <div className="glass-strong rounded-xl p-4 border border-border">
              <span className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-1.5">
                <ArrowUpRight className="h-3.5 w-3.5 text-accent" /> Recommended Altitude
              </span>
              <div className="mt-2 text-lg font-mono font-semibold text-foreground">
                FL{Math.round(routePlan.metrics.recommended_altitude / 100)} ({routePlan.metrics.recommended_altitude} ft)
              </div>
              <span className="text-xs text-muted-foreground line-clamp-1" title={routePlan.metrics.altitude_advice}>
                {routePlan.metrics.altitude_advice}
              </span>
            </div>

            <div className="glass-strong rounded-xl p-4 border border-border">
              <span className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-1.5">
                {hasReroute ? <AlertTriangle className="h-3.5 w-3.5 text-destructive" /> : <ShieldCheck className="h-3.5 w-3.5 text-primary" />} Safety Score
              </span>
              <div className="mt-2 text-lg font-mono font-semibold text-foreground">
                {routePlan.metrics.optimized_safety_score}%
              </div>
              <span className="text-xs text-muted-foreground">
                {hasReroute ? `Boosted from ${routePlan.metrics.direct_safety_score}% via detour` : "Clear conditions"}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MapSection;
