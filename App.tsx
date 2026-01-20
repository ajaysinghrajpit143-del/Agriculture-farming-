import React from 'react';
import Header from './components/Header';
import ImageEditor from './components/ImageEditor';
import { Sprout, Sun, CloudRain } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6F1]">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        
        {/* Intro Section */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-stone-800 mb-3 tracking-tight">
            Visualize the Future of Your Farm
          </h2>
          <p className="text-stone-600 leading-relaxed">
            Use our advanced "AgriVision" tool powered by Gemini 2.5 Flash Image. 
            Simply upload a photo of your field or crop, tell us what changes you want to see, 
            and let AI do the rest.
          </p>
        </div>

        {/* Features Grid (Decoration) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-4xl mx-auto">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 flex items-center space-x-4">
            <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-800">Drought Simulation</h3>
              <p className="text-xs text-stone-500">Visualize dry conditions</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 flex items-center space-x-4">
             <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <CloudRain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-800">Irrigation Planning</h3>
              <p className="text-xs text-stone-500">Plan water systems</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 flex items-center space-x-4">
             <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-800">Crop Rotation</h3>
              <p className="text-xs text-stone-500">Preview new crops</p>
            </div>
          </div>
        </div>

        <ImageEditor />

      </main>

      <footer className="bg-stone-800 text-stone-400 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">&copy; {new Date().getFullYear()} AgriVision AI. Empowering Farmers with Technology.</p>
          <p className="text-xs text-stone-500">Powered by Google Gemini 2.5 Flash Image Model</p>
        </div>
      </footer>
    </div>
  );
};

export default App;