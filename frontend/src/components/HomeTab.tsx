import React, { useState, useRef } from "react";
import { ScanResult } from "../types";

interface HomeTabProps {
  addScanToHistory: (scan: ScanResult) => void;
  threshold: number;
}

const HomeTab: React.FC<HomeTabProps> = ({ addScanToHistory, threshold }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 📸 handle image select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    setSelectedFile(file);
    setSelectedImage(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  // 🚀 REAL API SCAN
  const handleScan = async () => {
    if (!selectedFile) return;

    setIsScanning(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("http://https://farmlence-1.onrender.com/scan", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();

      // 🔁 map backend → UI format
      const mapped: ScanResult = {
        id: Math.random().toString(36).slice(2),
        timestamp: Date.now(),
        image: selectedImage!,
        cropName: data.crop ?? "Unknown Crop",
        diseaseName: data.disease ?? "Unknown Disease",
        scientificName: "",
        confidence: data.confidence ?? 0,
        treatment: data.treatment ?? "No treatment info",
        safety: data.safety ?? "No safety info",
        estimatedCost: data.cost_option ?? "N/A",
        sustainabilityTip: data.sustainability ?? "N/A",
        proTip: "Ensure proper sunlight and watering schedule.",
        hasIssue: data.disease !== "healthy",
      };

      if (mapped.confidence < threshold) {
        setError("Low confidence. Try clearer image.");
      } else {
        setResult(mapped);
        addScanToHistory(mapped);
      }
    } catch (err) {
      setError("Failed to connect to backend.");
    } finally {
      setIsScanning(false);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setSelectedImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Diagnose Crop</h2>

      {/* Upload */}
      <div
        className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer"
        onClick={() => !selectedImage && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        {selectedImage ? (
          <div className="space-y-3">
            <img
              src={selectedImage}
              alt="preview"
              className="mx-auto w-48 rounded-lg"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearImage();
              }}
              className="text-sm text-red-500"
            >
              Remove image
            </button>
          </div>
        ) : (
          <p>Click to upload leaf image</p>
        )}
      </div>

      {/* Scan button */}
      <button
        disabled={!selectedFile || isScanning}
        onClick={handleScan}
        className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold disabled:opacity-40"
      >
        {isScanning ? "Scanning..." : "Scan Leaf"}
      </button>

      {/* Error */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Result */}
      {result && (
        <div className="p-4 border rounded-xl space-y-2 bg-white">
          <h3 className="text-lg font-bold">{result.cropName}</h3>
          <p>Disease: {result.diseaseName}</p>
          <p>Confidence: {(result.confidence * 100).toFixed(1)}%</p>
          <p>Treatment: {result.treatment}</p>
          <p>Safety: {result.safety}</p>
          <p>Cost: {result.estimatedCost}</p>
          <p>Sustainability: {result.sustainabilityTip}</p>
        </div>
      )}
    </div>
  );
};

export default HomeTab;
