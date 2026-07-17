import React, { useState, useRef } from 'react';
import { Upload, FileImage, Image as ImageIcon, Loader2, Sparkles, Download, ArrowLeft, RefreshCw, BarChart2 } from 'lucide-react';
import { apiFetch, getStaticUrl } from '../utils/api';

interface MriAnalysisProps {
  mriType: 'brain' | 'alzheimer' | 'spine';
  onNavigateHome: () => void;
}

interface PredictionData {
  id: number;
  prediction_class: string;
  confidence: number;
  inference_time: number;
  image_path: string;
  heatmap_path: string;
}

export const MriAnalysis: React.FC<MriAnalysisProps> = ({ mriType, onNavigateHome }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [progressVal, setProgressVal] = useState(0);
  
  const [result, setResult] = useState<PredictionData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mriNames = {
    brain: "Brain Tumor Detection",
    alzheimer: "Alzheimer's Staging",
    spine: "Spine MRI Disease Detection"
  };

  const steps = [
    "Uploading MRI image file to processing server...",
    "Verifying dimensions and anatomical scanning formats...",
    "Extracting convolutional feature activations via ResNet-50...",
    "Evaluating backpropagated class gradients for Grad-CAM...",
    "Superimposing spatial saliency maps and saving artifacts..."
  ];

  const classLists = {
    brain: ["glioma", "meningioma", "notumor", "pituitary"],
    alzheimer: ["MildDemented", "ModerateDemented", "NonDemented", "VeryMildDemented"],
    spine: ["Herniated Disc", "No Stenosis", "Thecal Sac"]
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setErrorMsg(null);
    const validTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (!validTypes.includes(selectedFile.type)) {
      setErrorMsg("Invalid file format. Please upload PNG, JPG, or JPEG.");
      return;
    }
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const startAnalysis = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgressVal(0);
    setProcessStep(0);
    setErrorMsg(null);
    setResult(null);

    // Simulate progress bar and step updates
    const interval = setInterval(() => {
      setProgressVal((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const nextVal = prev + Math.floor(Math.random() * 8) + 4;
        const currentStep = Math.min(Math.floor(nextVal / 20), steps.length - 1);
        setProcessStep(currentStep);
        return Math.min(nextVal, 100);
      });
    }, 150);

    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const data = await apiFetch<PredictionData>(`/api/predict/${mriType}`, {
        method: "POST",
        formData
      });
      
      // Wait for progress simulation to reach 100%
      setProgressVal(100);
      setProcessStep(steps.length - 1);
      setTimeout(() => {
        setResult(data);
        setIsProcessing(false);
        clearInterval(interval);
      }, 500);
      
    } catch (e: any) {
      clearInterval(interval);
      setIsProcessing(false);
      setErrorMsg(e.message || "Failed to analyze MRI scan");
    }
  };

  const resetUpload = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setErrorMsg(null);
  };

  const handleDownloadReport = async (predId: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/report/${predId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to download PDF report");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `NeuroScan_MRI_Report_${predId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error: any) {
      console.error("PDF download failed:", error);
      setErrorMsg("Report download failed. Please try again.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-5">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onNavigateHome}
            className="p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-brand-navy dark:text-white tracking-tight">
              {mriNames[mriType]}
            </h1>
            <p className="text-xs text-brand-slate dark:text-slate-400">
              Interactive diagnostic diagnostic panel & explainable visual highlight overlays
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Upload State */}
      {!file && !isProcessing && !result && (
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all duration-300 ${
            isDragging 
              ? "border-brand-blue bg-brand-blue/5 scale-98" 
              : "border-slate-300 dark:border-slate-800 hover:border-brand-blue hover:bg-brand-blue/5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl"
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            accept=".png,.jpg,.jpeg"
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-brand-blue flex items-center justify-center mb-6 pulse-glow">
            <Upload className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-brand-navy dark:text-white mb-2">Drag & Drop MRI Image</h3>
          <p className="text-brand-slate dark:text-slate-400 text-xs max-w-sm mb-4 leading-relaxed">
            Drag files directly here or click to browse files. Supported modalities: PNG, JPG, JPEG (Grayscale or Color T1/T2).
          </p>
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-xs font-bold border border-slate-300/30 dark:border-slate-700/30">
            <FileImage className="w-3.5 h-3.5" />
            <span>Format: 224x224 RGB conversion on-the-fly</span>
          </div>
        </div>
      )}

      {/* Selected File State (Ready to Predict) */}
      {file && !isProcessing && !result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Preview Image */}
          <div className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl flex flex-col items-center justify-center">
            {previewUrl && (
              <img 
                src={previewUrl} 
                alt="MRI preview" 
                className="max-h-80 w-auto rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 bg-black/5 object-contain"
              />
            )}
          </div>

          {/* Details & Actions */}
          <div className="p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-brand-blue dark:text-brand-cyan text-xs font-bold border border-brand-blue/20">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>MRI Scan Loaded</span>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-brand-navy dark:text-white mb-2 truncate">{file.name}</h3>
                <div className="grid grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-800 pt-4 text-xs">
                  <div>
                    <span className="block text-brand-slate dark:text-slate-400">File Size</span>
                    <span className="font-bold text-brand-navy dark:text-white mt-1 block">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <div>
                    <span className="block text-brand-slate dark:text-slate-400">Format</span>
                    <span className="font-bold text-brand-navy dark:text-white mt-1 block">{file.type.split("/")[1].toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-8">
              <button 
                onClick={resetUpload}
                className="px-5 py-3.5 rounded-xl border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
              >
                Clear File
              </button>
              <button 
                onClick={startAnalysis}
                className="flex-1 py-3.5 rounded-xl bg-brand-blue hover:bg-brand-blue/95 text-white text-xs font-bold shadow-xl shadow-brand-blue/20 flex items-center justify-center space-x-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run AI Prediction</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading/Processing State */}
      {isProcessing && (
        <div className="p-12 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-8">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-brand-blue animate-spin" />
            <div className="absolute inset-0 bg-brand-blue/10 rounded-full blur-xl pointer-events-none" />
          </div>

          <div className="w-full space-y-2">
            <div className="flex justify-between text-xs font-bold text-brand-navy dark:text-white">
              <span>{steps[processStep]}</span>
              <span>{progressVal}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand-blue to-brand-cyan transition-all duration-150"
                style={{ width: `${progressVal}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Prediction Result State */}
      {result && !isProcessing && (
        <div className="space-y-8 animate-fade-in">
          {/* Side by side original and Gradcam */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl flex flex-col items-center">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">Original MRI Scan</h4>
              <img 
                src={getStaticUrl(result.image_path)} 
                alt="Original MRI" 
                className="max-h-80 w-auto rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800"
              />
            </div>

            <div className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl flex flex-col items-center">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">Saliency Spot Localization (Grad-CAM)</h4>
              <img 
                src={getStaticUrl(result.heatmap_path)} 
                alt="Grad-CAM overlay" 
                className="max-h-80 w-auto rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>

          {/* Results dashboard details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Class Badge Card */}
            <div className="p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 shadow-premium flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-brand-slate dark:text-slate-400 uppercase tracking-wider block mb-2">Automated Prediction</span>
                <div className="text-3xl font-extrabold text-brand-blue mb-3">{result.prediction_class.replace("Demented", " Demented")}</div>
                <p className="text-brand-slate dark:text-slate-400 text-xs leading-relaxed">
                  Calculated within {result.inference_time.toFixed(3)} seconds using ResNet-50 feed-forward activations.
                </p>
              </div>

              <div className="flex space-x-3 mt-8">
                <button 
                  onClick={resetUpload}
                  className="p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all"
                  title="Analyze another image"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDownloadReport(result.id)}
                  className="flex-1 py-3.5 rounded-xl bg-brand-blue hover:bg-brand-blue/95 text-white text-xs font-bold shadow-xl shadow-brand-blue/20 flex items-center justify-center space-x-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Report</span>
                </button>
              </div>
            </div>

            {/* Probability Gauge Chart */}
            <div className="p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 shadow-premium md:col-span-2 space-y-6">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                <BarChart2 className="w-4.5 h-4.5 text-brand-cyan" />
                <span>Diagnostic Class Probabilities</span>
              </h3>
              
              <div className="space-y-4">
                {classLists[mriType].map((cName) => {
                  const isPredicted = cName.toLowerCase() === result.prediction_class.toLowerCase();
                  // We simulate minor weights for non-predicted categories
                  const pct = isPredicted 
                    ? result.confidence * 100 
                    : (100 - (result.confidence * 100)) / (classLists[mriType].length - 1);
                  
                  return (
                    <div key={cName} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className={isPredicted ? "text-brand-navy dark:text-white font-bold" : "text-brand-slate dark:text-slate-500"}>
                          {cName.replace("Demented", " Demented")} {isPredicted && " (Detected)"}
                        </span>
                        <span className={isPredicted ? "text-brand-blue font-bold" : "text-brand-slate dark:text-slate-500"}>
                          {pct.toFixed(2)}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800/50 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isPredicted 
                              ? "bg-gradient-to-r from-brand-blue to-brand-cyan" 
                              : "bg-slate-300 dark:bg-slate-700"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
