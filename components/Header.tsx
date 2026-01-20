import React from 'react';
import { Leaf, Sprout } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-emerald-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-white p-2 rounded-full">
            <Sprout className="w-6 h-6 text-emerald-800" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">AgriVision AI</h1>
        </div>
        <div className="hidden md:flex items-center space-x-6 text-emerald-100 text-sm font-medium">
          <span className="flex items-center hover:text-white cursor-pointer transition">
            <Leaf className="w-4 h-4 mr-1" /> Field Analysis
          </span>
          <span className="flex items-center hover:text-white cursor-pointer transition">
            <Leaf className="w-4 h-4 mr-1" /> Crop Planning
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;