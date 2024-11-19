import React from 'react';
import { FileText, Globe2, Layout, Shield } from 'lucide-react';

const features = [
  {
    name: '20+ File Formats',
    description: 'Support for DOC, PDF, PPT, JSON, and many more formats with preserved styling.',
    icon: FileText,
  },
  {
    name: 'Multiple APIs',
    description: 'Connect your preferred translation APIs including OpenAI, DeepL, and Google Translate.',
    icon: Globe2,
  },
  {
    name: 'Format Preservation',
    description: 'Maintain original document formatting, styles, and layout after translation.',
    icon: Layout,
  },
  {
    name: 'Secure Processing',
    description: 'Your files are processed securely and never stored on our servers.',
    icon: Shield,
  },
];

export default function Features() {
  return (
    <div className="py-24 bg-gray-50" id="features">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Powerful Translation Features</h2>
          <p className="mt-4 text-gray-600">Everything you need for professional document translation</p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.name} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <feature.icon className="w-8 h-8 mb-4" />
              <h3 className="text-lg font-semibold">{feature.name}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}