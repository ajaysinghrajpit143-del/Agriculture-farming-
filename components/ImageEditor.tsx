import React, { useState, useRef, useCallback } from 'react';
import { Upload, Image as ImageIcon, Wand2, RefreshCw, Download, X } from 'lucide-react';
import { AppStatus, GeneratedImage } from '../types';
import { editImageWithGemini } from '../services/geminiService';
import Spinner from './Spinner';

const EXAMPLE_PROMPTS = [
  "Add a red tractor in the background",
  "Show the field with ripe corn ready for harvest",
  "Add a rustic wooden fence around the crop",
  "Simulate a rainy day effect over the farm",
  "Highlight areas that look dry",
];

const ImageEditor: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset state for new image
    setGeneratedImage(null);
    setError(null);
    setStatus(AppStatus.IDLE);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Extract base64 data specifically (remove data:image/xxx;base64, prefix)
      const base64Data = result.split(',')[1];
      setOriginalImage(base64Data);
      setMimeType(file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!originalImage || !prompt.trim()) return;

    setStatus(AppStatus.LOADING);
    setError(null);

    try {
      const result: GeneratedImage = await editImageWithGemini({
        imageBase64: originalImage,
        mimeType: mimeType,
        prompt: prompt.trim()
      });

      setGeneratedImage(`data:${result.mimeType};base64,${result.data}`);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || "Failed to generate image. Please try again.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setPrompt('');
    setStatus(AppStatus.IDLE);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'agrivision-edited.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 bg-white rounded-2xl shadow-xl my-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-stone-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-800 flex items-center">
            <Wand2 className="w-6 h-6 mr-2 text-emerald-600" />
            AI Farm Visualizer
          </h2>
          <p className="text-stone-500 mt-1 text-sm">Upload a farm photo and use AI to edit or visualize changes.</p>
        </div>
        {originalImage && (
            <button 
              onClick={handleReset}
              className="mt-4 md:mt-0 px-4 py-2 text-sm text-stone-500 hover:text-red-500 hover:bg-red-50 rounded-full transition flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-1" /> Start Over
            </button>
        )}
      </div>

      {!originalImage ? (
        // Upload State
        <div 
          className="border-2 border-dashed border-emerald-200 rounded-xl bg-emerald-50/50 p-12 text-center hover:bg-emerald-50 transition cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-emerald-600">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-stone-800 mb-2">Upload a Farm Photo</h3>
          <p className="text-stone-500 mb-6 max-w-md mx-auto">Click to browse or drag and drop your field, crop, or equipment photos here.</p>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition shadow-md">
            Select Image
          </button>
        </div>
      ) : (
        // Editor State
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Image & Inputs */}
          <div className="space-y-6">
            <div className="relative group rounded-xl overflow-hidden border border-stone-200 shadow-sm bg-stone-100 aspect-video flex items-center justify-center">
               <img 
                 src={`data:${mimeType};base64,${originalImage}`} 
                 alt="Original" 
                 className="max-w-full max-h-full object-contain"
               />
               <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Original</div>
            </div>

            <div className="space-y-3">
              <label htmlFor="prompt" className="block text-sm font-medium text-stone-700">
                How should the AI modify this image?
              </label>
              <div className="relative">
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., Add a greenhouse in the background..."
                  className="w-full border border-stone-300 rounded-lg p-3 pr-12 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition resize-none h-28"
                />
                <div className="absolute bottom-3 right-3 text-stone-400">
                  <Wand2 className="w-5 h-5" />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {EXAMPLE_PROMPTS.map((ex, i) => (
                  <button 
                    key={i}
                    onClick={() => setPrompt(ex)}
                    className="text-xs bg-stone-100 hover:bg-emerald-100 text-stone-600 hover:text-emerald-700 px-3 py-1.5 rounded-full transition border border-stone-200"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={status === AppStatus.LOADING || !prompt.trim()}
              className={`w-full py-3 rounded-lg font-semibold text-white shadow-md flex items-center justify-center transition ${
                status === AppStatus.LOADING || !prompt.trim()
                  ? 'bg-stone-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg'
              }`}
            >
              {status === AppStatus.LOADING ? (
                <>
                  <span className="mr-2">Processing with Gemini...</span>
                  <Spinner />
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate Visualization
                </>
              )}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start">
                 <X className="w-5 h-5 mr-2 shrink-0" />
                 {error}
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="flex flex-col h-full">
            <div className={`flex-1 rounded-xl border border-stone-200 shadow-inner bg-stone-50 flex flex-col items-center justify-center relative overflow-hidden min-h-[300px] ${generatedImage ? 'p-0' : 'p-8'}`}>
              
              {generatedImage ? (
                <>
                  <img 
                    src={generatedImage} 
                    alt="AI Generated" 
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                     <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded shadow-sm">AI Generated</span>
                  </div>
                </>
              ) : (
                <div className="text-center text-stone-400">
                  {status === AppStatus.LOADING ? (
                    <div className="space-y-4">
                       <Spinner />
                       <p className="animate-pulse">Cultivating pixels...</p>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p>Your visualized farm will appear here.</p>
                    </>
                  )}
                </div>
              )}
            </div>

            {generatedImage && (
              <button 
                onClick={handleDownload}
                className="mt-4 w-full bg-white border border-stone-300 text-stone-700 py-2.5 rounded-lg font-medium hover:bg-stone-50 hover:text-emerald-700 transition flex items-center justify-center shadow-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Image
              </button>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default ImageEditor;