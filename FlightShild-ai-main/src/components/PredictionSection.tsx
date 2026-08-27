import { Plane, MapPin, Wind, Thermometer, Gauge, Mountain, ShieldAlert, ShieldCheck, Activity, Compass, AlertTriangle } from "lucide-react";
import { FlightStatus, PredictionResult } from "@/pages/Index";

interface PredictionSectionProps {
  status: FlightStatus;
  isLoading: boolean;
  resultData: PredictionResult | null;
  form: {
    source: string;
    destination: string;
    altitude: string;
    windSpeed: string;
    temperature: string;
    pressure: string;
  };
  handleChange: (field: keyof PredictionSectionProps["form"], value: string) => void;
  handlePredict: () => Promise<void>;
}

const PredictionSection = ({
  status,
  isLoading,
  resultData,
  form,
  handleChange,
  handlePredict,
}: PredictionSectionProps) => {
  const fields = [
    { key: "source", label: "Source City", icon: MapPin, placeholder: "e.g. New York" },
    { key: "destination", label: "Destination City", icon: MapPin, placeholder: "e.g. London" },
    { key: "altitude", label: "Altitude (ft)", icon: Mountain, placeholder: "e.g. 35000" },
    { key: "windSpeed", label: "Wind Speed (kt)", icon: Wind, placeholder: "e.g. 15" },
    { key: "temperature", label: "Temperature (°C)", icon: Thermometer, placeholder: "e.g. -40" },
    { key: "pressure", label: "Pressure (hPa)", icon: Gauge, placeholder: "e.g. 1013" },
  ];

  const statusConfig = {
    safe: {
      text: "✅ Flight Status: Safe & Smooth Flight",
      badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
      containerClass: "border-emerald-500/40 bg-emerald-950/20 glow-primary",
      icon: ShieldCheck
    },
    moderate: {
      text: "⚠️ Flight Status: Moderate Turbulence Detected",
      badgeClass: "bg-amber-500/20 text-amber-400 border-amber-500/50",
      containerClass: "border-amber-500/40 bg-amber-950/20 glow-accent",
      icon: AlertTriangle
    },
    severe: {
      text: "🚨 Flight Status: Severe Turbulence / Reroute Advised",
      badgeClass: "bg-red-500/20 text-red-400 border-red-500/50",
      containerClass: "border-red-500/40 bg-red-950/20 glow-destructive",
      icon: ShieldAlert
    },
    idle: { text: "", badgeClass: "", containerClass: "", icon: Plane },
  };

  return (
    <section id="predict" className="relative py-24 px-6">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
            Flight Safety <span className="text-primary">Prediction</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            Enter flight parameters to get real-time AI atmospheric turbulence & safety assessment.
          </p>
        </div>

        <div className="glass-strong rounded-2xl p-8 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fields.map((field) => (
              <div key={field.key} className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <field.icon className="h-3.5 w-3.5 text-primary" />
                  {field.label}
                </label>
                <input
                  type={field.key === "source" || field.key === "destination" ? "text" : "number"}
                  placeholder={field.placeholder}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => handleChange(field.key as keyof typeof form, e.target.value)}
                  className="rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground font-mono placeholder:text-muted-foreground/50 outline-none transition-all focus:border-primary input-glow"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handlePredict}
            disabled={isLoading}
            className="mt-8 w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 glow-primary disabled:opacity-50"
          >
            {isLoading ? (
              <span className="h-5 w-5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
            ) : (
              <Plane className="h-5 w-5" />
            )}
            {isLoading ? "Analyzing Atmospheric Data..." : "Run AI Flight Assessment"}
          </button>
        </div>

        {/* Detailed Results Dashboard */}
        {status !== "idle" && (
          <div className={`mt-8 rounded-2xl border-2 p-6 animate-fade-in transition-all ${statusConfig[status].containerClass}`}>
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <span className={`p-2.5 rounded-xl border ${statusConfig[status].badgeClass}`}>
                  {(() => {
                    const StatusIcon = statusConfig[status].icon;
                    return <StatusIcon className="h-6 w-6" />;
                  })()}
                </span>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    {resultData?.prediction || statusConfig[status].text}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    AI Assessment ID: #FS-{Math.floor(1000 + Math.random() * 9000)}
                  </p>
                </div>
              </div>

              {resultData && (
                <div className="text-right">
                  <div className="text-xs font-mono uppercase text-muted-foreground">Turbulence Risk Index</div>
                  <div className="text-2xl font-bold font-mono text-foreground">
                    {resultData.risk_score}%
                  </div>
                </div>
              )}
            </div>

            {/* Risk Bar */}
            {resultData && (
              <div className="my-5">
                <div className="flex justify-between text-xs font-mono text-muted-foreground mb-1.5">
                  <span>Safety Level</span>
                  <span>{resultData.risk_score}% Risk Score</span>
                </div>
                <div className="h-2.5 w-full bg-secondary/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      resultData.risk_score >= 70
                        ? "bg-red-500"
                        : resultData.risk_score >= 40
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${resultData.risk_score}%` }}
                  />
                </div>
              </div>
            )}

            {/* Detailed Risk Breakdown Grid */}
            {resultData && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5">
                <div className="rounded-xl bg-background/50 border border-border/60 p-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase mb-1">
                    <Activity className="h-4 w-4 text-primary" />
                    Clear Air Turbulence (CAT)
                  </div>
                  <div className="text-sm font-semibold text-foreground font-mono">
                    {resultData.cat_risk} Risk
                  </div>
                </div>

                <div className="rounded-xl bg-background/50 border border-border/60 p-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase mb-1">
                    <Wind className="h-4 w-4 text-primary" />
                    Wind Shear Factor
                  </div>
                  <div className="text-sm font-semibold text-foreground font-mono">
                    {resultData.wind_shear_factor}
                  </div>
                </div>
              </div>
            )}

            {/* Flight Safety Advisory Banner */}
            {resultData && (
              <div className="rounded-xl bg-secondary/40 border border-border/70 p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-primary font-semibold">
                  <Compass className="h-4 w-4" />
                  Flight Advisory & Action Plan
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {resultData.safety_advisory}
                </p>
                {resultData.recommended_altitude && (
                  <div className="mt-1 pt-2 border-t border-border/50 text-xs font-mono text-foreground flex items-center gap-1.5">
                    <span className="text-primary font-semibold">Recommended Altitude:</span>
                    {resultData.recommended_altitude}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PredictionSection;

