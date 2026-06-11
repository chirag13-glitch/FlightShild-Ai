import { Plane, MapPin, Wind, Thermometer, Gauge, Mountain } from "lucide-react";
import { FlightStatus } from "@/pages/Index";

interface PredictionSectionProps {
  status: FlightStatus;
  isLoading: boolean;
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
    safe: { text: "✅ Flight Status: Safe", className: "border-primary glow-primary text-primary" },
    moderate: { text: "⚠️ Flight Status: Moderate Turbulence", className: "border-accent glow-accent text-accent" },
    severe: { text: "🚨 Flight Status: Severe Turbulence", className: "border-destructive glow-destructive text-destructive" },
    idle: { text: "", className: "" },
  };

  return (
    <section id="predict" className="relative py-24 px-6">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
            Flight Safety <span className="text-primary">Prediction</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            Enter flight parameters to get an AI-powered turbulence assessment.
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
            {isLoading ? "Analyzing..." : "Predict Flight Safety"}
          </button>
        </div>

        {/* Result */}
        {status !== "idle" && (
          <div className={`mt-8 rounded-xl border-2 px-6 py-5 text-center font-mono text-lg font-semibold animate-fade-in ${statusConfig[status].className}`}>
            {statusConfig[status].text}
          </div>
        )}
      </div>
    </section>
  );
};

export default PredictionSection;
