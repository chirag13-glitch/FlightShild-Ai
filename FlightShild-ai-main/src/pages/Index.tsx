import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PredictionSection from "@/components/PredictionSection";
import MapSection from "@/components/MapSection";
import Footer from "@/components/Footer";

export type FlightStatus = "idle" | "safe" | "moderate" | "severe";

export interface PredictionResult {
  prediction: string;
  risk_score: number;
  cat_risk: string;
  wind_shear_factor: string;
  safety_advisory: string;
  recommended_altitude: string;
}

const Index = () => {
  const [status, setStatus] = useState<FlightStatus>("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState<PredictionResult | null>(null);
  const [form, setForm] = useState({
    source: "",
    destination: "",
    altitude: "",
    windSpeed: "",
    temperature: "",
    pressure: "",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePredict = async () => {
    setIsLoading(true);
    setStatus("idle");
    setResultData(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: form.source,
          destination: form.destination,
          altitude: parseFloat(form.altitude) || 35000,
          wind_speed: parseFloat(form.windSpeed) || 0,
          temperature: form.temperature !== "" ? parseFloat(form.temperature) : -40,
          pressure: form.pressure !== "" ? parseFloat(form.pressure) : 1013,
        }),
      });

      const data = await response.json();
      setResultData(data);
      const prediction: string = data.prediction;

      if (prediction === "Severe Turbulence") {
        setStatus("severe");
      } else if (prediction === "Moderate Turbulence") {
        setStatus("moderate");
      } else {
        setStatus("safe");
      }
    } catch (error) {
      console.error("Prediction failed:", error);
      setStatus("severe");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <PredictionSection
        status={status}
        isLoading={isLoading}
        resultData={resultData}
        form={form}
        handleChange={handleChange}
        handlePredict={handlePredict}
      />
      <MapSection 
        status={status}
        sourceCity={form.source}
        destinationCity={form.destination}
      />
      <Footer />
    </div>
  );
};

export default Index;

