import React, { useState } from 'react';
import { Globe, Menu, Settings } from 'lucide-react';
import ApiModal from './ApiModal';

export default function Header() {
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  return (
    <header className="w-full px-6 py-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Globe className="w-8 h-8" />
          <span className="text-xl font-bold">TranslatePro</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-600 hover:text-black transition-colors">Features</a>
          <a href="#formats" className="text-gray-600 hover:text-black transition-colors">File Formats</a>
          <a href="#apis" className="text-gray-600 hover:text-black transition-colors">APIs</a>
          <button 
            onClick={() => setIsApiModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-black transition-colors"
          >
            <Settings className="w-5 h-5" />
            API Settings
          </button>
          <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            Start Translating
          </button>
        </nav>
        <button className="md:hidden">
          <Menu className="w-6 h-6" />
        </button>
      </div>
      <ApiModal isOpen={isApiModalOpen} onClose={() => setIsApiModalOpen(false)} />
    </header>
  );
}