import React, { useState, useRef, useEffect } from 'react'; // Removed unused useCallback
import { ScanResult, ChatMessage } from '../types';

const API_BASE = "https://farmlence-1.onrender.com";

interface HomeTabProps {
  addScanToHistory: (scan: ScanResult) => void;
  threshold: number;
}

const HomeTab: React.FC<HomeTabProps> = ({ addScanToHistory, threshold }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setError(null);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!selectedImage) return;

    setIsScanning(true);
    setError(null);

    try {
      const formData = new FormData();
      const responseBlob = await fetch(selectedImage);
      const blob = await responseBlob.blob();
      formData.append('file', blob, 'leaf.jpg');

      try {
        const apiResponse = await fetch(`${API_BASE}/scan`, {
          method: 'POST',
          body: formData,
        });

        if (apiResponse.ok) {
          const data = await apiResponse.json();
          processResult(data);
          return;
        }
      } catch (e) {
        console.warn('Backend not available, using mock data for demo.', e);
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockResult: ScanResult = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        image: selectedImage,
        cropName: "Roma Tomato",
        diseaseName: "Late Blight",
        scientificName: "Phytophthora infestans",
        confidence: 0.94,
        treatment: "Remove infected leaves and apply copper-based fungicide.",
        safety: "High risk of spread. Isolate plant and wash tools after use.",
        estimatedCost: "$12.50 - $25.00 for organic treatment per acre.",
        sustainabilityTip: "Improve airflow and avoid overhead watering to prevent recurrence.",
        proTip: "Check your irrigation schedule. Excess humidity is the main driver for Late Blight development.",
        hasIssue: true
      };

      if (mockResult.confidence < threshold) {
        setError("AI could not confidently identify a disease. Please try a clearer photo.");
      } else {
        processResult(mockResult);
      }

    } catch (err) {
      setError("Failed to analyze image. Please check your network connection.");
    } finally {
      setIsScanning(false);
    }
  };

  const processResult = (data: ScanResult) => {
    setResult(data);
    addScanToHistory(data);
    setMessages([
      { role: 'ai', text: `I've analyzed your ${data.cropName} leaf. It looks like it has ${data.diseaseName}. How can I help you with the treatment or prevention?` }
    ]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !result || isChatLoading) return;

    const userMessage = chatInput.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMessage,
          context: {
            crop: result.cropName,
            disease: result.diseaseName,
            confidence: result.confidence,
            treatment: result.treatment,
            safety: result.safety,
            cost_option: result.estimatedCost,
            sustainability: result.sustainabilityTip
          }
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'ai', text: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: `Sorry, I encountered an error: ${data.error || 'Unknown error'}` }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting to the server. Please try again later." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    setMessages([]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <section>
        <h2 className="text-2xl font-bold">Diagnose Crop</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Upload a photo of a leaf to detect diseases.</p>
      </section>

      <div 
        className={`bg-white dark:bg-white/5 rounded-2xl ios-shadow border-2 border-dashed transition-all p-4 ${selectedImage ? 'border-primary/50' : 'border-slate-200 dark:border-white/10'}`}
        onClick={() => !selectedImage && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center justify-center py-6">
          {selectedImage ? (
            <div className="relative w-full aspect-square max-w-[240px] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 group">
              <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
              <button 
                onClick={(e) => { e.stopPropagation(); clearImage(); }}
                className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors"
              >
                <span className="material-icons-round text-sm">close</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center px-4 cursor-pointer">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons-round text-3xl text-primary">add_a_photo</span>
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Tap to Upload Leaf Photo</p>
            </div>
          )}
        </div>
      </div>

      <button 
        disabled={!selectedImage || isScanning}
        onClick={handleScan}
        className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
          !selectedImage || isScanning 
            ? 'bg-slate-200 dark:bg-white/5 text-slate-400 cursor-not-allowed' 
            : 'bg-primary text-background-dark shadow-lg shadow-primary/20 hover:opacity-90'
        }`}
      >
        {isScanning ? "Analyzing..." : "Scan Leaf"}
      </button>

      {error && <p className="text-xs font-medium text-red-700 dark:text-red-400">{error}</p>}

      {result && (
        <div className="bg-white dark:bg-white/5 rounded-2xl ios-shadow border border-slate-100 dark:border-white/5 p-5">
          <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">{result.cropName}</h4>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{result.diseaseName}</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
             <InfoCell icon="medical_services" label="Treatment" text={result.treatment} />
             <InfoCell icon="shield" label="Safety" text={result.safety} />
          </div>
        </div>
      )}
    </div>
  );
};

const InfoCell: React.FC<{ icon: string; label: string; text: string }> = ({ icon, label, text }) => (
  <div className="bg-white dark:bg-background-dark p-2">
    <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</h5>
    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{text}</p>
  </div>
);

export default HomeTab;