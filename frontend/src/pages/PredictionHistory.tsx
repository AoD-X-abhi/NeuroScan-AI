import React, { useState, useEffect } from 'react';
import { apiFetch, getStaticUrl } from '../utils/api';
import { Search, Filter, Download, Calendar, Eye, X, RefreshCw } from 'lucide-react';

interface Prediction {
  id: number;
  user_id: number;
  mri_type: string;
  prediction_class: string;
  confidence: number;
  inference_time: number;
  timestamp: string;
  image_path: string;
  heatmap_path: string;
}

export const PredictionHistory: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'brain' | 'alzheimer' | 'spine'>('all');
  
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await apiFetch<Prediction[]>('/api/history');
      setPredictions(data);
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to load prediction history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDownloadReport = async (predId: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/report/${predId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to download PDF");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `NeuroScan_MRI_Report_${predId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredPredictions = predictions.filter((p) => {
    const matchesSearch = p.prediction_class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || p.mri_type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-navy dark:text-white tracking-tight">
            Prediction History
          </h1>
          <p className="text-xs text-brand-slate dark:text-slate-400">
            Secure records of all computational MRI analyses performed
          </p>
        </div>
        <button 
          onClick={fetchHistory}
          disabled={isLoading}
          className="p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all"
          title="Refresh history"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by diagnosis (e.g. glioma)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-brand-navy dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-sm transition-all"
          />
        </div>

        {/* Filter Type */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Filter className="w-4 h-4" />
          </span>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-brand-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-sm transition-all appearance-none cursor-pointer"
          >
            <option value="all">All Modalities</option>
            <option value="brain">Brain Tumor</option>
            <option value="alzheimer">Alzheimer's Disease</option>
            <option value="spine">Spine MRI</option>
          </select>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="w-full h-16 rounded-2xl bg-slate-200 dark:bg-slate-800/50 animate-pulse" />
          ))}
        </div>
      ) : filteredPredictions.length === 0 ? (
        <div className="p-16 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white/30 dark:bg-slate-900/30 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-brand-navy dark:text-white mb-1">No Records Found</h3>
          <p className="text-xs text-brand-slate dark:text-slate-400">No previous MRI scans matched the selected search filters.</p>
        </div>
      ) : (
        /* History Table */
        <div className="overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-100/50 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4 pl-6">Analysis Date</th>
                  <th className="p-4">MRI Modality</th>
                  <th className="p-4">AI Diagnosis</th>
                  <th className="p-4">Confidence</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                {filteredPredictions.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-100/30 dark:hover:bg-slate-800/10 transition-colors">
                    <td className="p-4 pl-6 text-brand-slate dark:text-slate-400">
                      {new Date(p.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 font-semibold text-brand-navy dark:text-white">
                      {p.mri_type.toUpperCase()}
                    </td>
                    <td className="p-4 font-bold text-brand-blue">
                      {p.prediction_class.replace("Demented", " Demented")}
                    </td>
                    <td className="p-4 font-semibold text-brand-navy dark:text-white">
                      {(p.confidence * 100).toFixed(2)}%
                    </td>
                    <td className="p-4 text-right pr-6 space-x-2">
                      <button 
                        onClick={() => setSelectedPrediction(p)}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-brand-blue/10 hover:text-brand-blue text-slate-500 dark:text-slate-400 transition-all inline-flex items-center"
                        title="Review scan"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDownloadReport(p.id)}
                        className="p-2 rounded-lg bg-brand-blue hover:bg-brand-blue/90 text-white transition-all inline-flex items-center"
                        title="Download report"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedPrediction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
          <div className="relative w-full max-w-4xl p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-brand-navy dark:text-white">
                  MRI Record Analysis Review
                </h2>
                <p className="text-xs text-brand-slate dark:text-slate-400 mt-1">
                  ID: PAT-{String(selectedPrediction.user_id).padStart(4, '0')}-{String(selectedPrediction.id).padStart(4, '0')} | Modality: {selectedPrediction.mri_type.toUpperCase()}
                </p>
              </div>
              <button 
                onClick={() => setSelectedPrediction(null)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-brand-navy dark:hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Images layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col items-center">
                <span className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Original MRI Scan</span>
                <img 
                  src={getStaticUrl(selectedPrediction.image_path)} 
                  alt="Original" 
                  className="max-h-72 w-auto rounded-xl shadow border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col items-center">
                <span className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Grad-CAM Hotspot Saliency</span>
                <img 
                  src={getStaticUrl(selectedPrediction.heatmap_path)} 
                  alt="Heatmap" 
                  className="max-h-72 w-auto rounded-xl shadow border border-slate-200 dark:border-slate-800"
                />
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-800/35 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl text-xs">
              <div>
                <span className="block text-brand-slate dark:text-slate-400">Diagnosis Output</span>
                <span className="font-bold text-brand-blue text-sm block mt-1">{selectedPrediction.prediction_class.replace("Demented", " Demented")}</span>
              </div>
              <div>
                <span className="block text-brand-slate dark:text-slate-400">Prediction Confidence</span>
                <span className="font-bold text-brand-navy dark:text-white text-sm block mt-1">{(selectedPrediction.confidence * 100).toFixed(2)}%</span>
              </div>
              <div>
                <span className="block text-brand-slate dark:text-slate-400">Inference Time</span>
                <span className="font-bold text-brand-navy dark:text-white text-sm block mt-1">{selectedPrediction.inference_time.toFixed(3)} sec</span>
              </div>
              <div>
                <span className="block text-brand-slate dark:text-slate-400">Analysis Date</span>
                <span className="font-bold text-brand-navy dark:text-white text-sm block mt-1">{new Date(selectedPrediction.timestamp).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 border-t border-slate-200 dark:border-slate-800 pt-4">
              <button 
                onClick={() => setSelectedPrediction(null)}
                className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
              >
                Close Review
              </button>
              <button 
                onClick={() => handleDownloadReport(selectedPrediction.id)}
                className="px-6 py-3 rounded-xl bg-brand-blue hover:bg-brand-blue/95 text-white text-xs font-bold shadow-xl shadow-brand-blue/20 flex items-center space-x-2 transition-all"
              >
                <Download className="w-4.5 h-4.5" />
                <span>Get PDF Sheet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
