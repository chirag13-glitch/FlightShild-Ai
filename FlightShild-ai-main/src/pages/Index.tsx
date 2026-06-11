import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PredictionSection from "@/components/PredictionSection";
import MapSection from "@/components/MapSection";
import Footer from "@/components/Footer";

export type FlightStatus = "idle" | "safe" | "moderate" | "severe";

const Index = () => {
  const [status, setStatus] = useState<FlightStatus>("idle");
  const [isLoading, setIsLoading] = useState(false);
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

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wind_speed: parseFloat(form.windSpeed) || 0,
          altitude: parseFloat(form.altitude) || 35000,
        }),
      });

      const data = await response.json();
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
