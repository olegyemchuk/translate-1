import React, { useState } from 'react';
import { X, Key, Trash2, AlertCircle } from 'lucide-react';
import { useApi } from '../contexts/ApiContext';

type ApiModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ApiModal({ isOpen, onClose }: ApiModalProps) {
  const { apiKeys, addApiKey, removeApiKey } = useApi();
  const [selectedProvider, setSelectedProvider] = useState('OpenAI');
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      if (selectedProvider === 'OpenAI' && !apiKey.startsWith('sk-')) {
        alert('Invalid OpenAI API key format. It should start with "sk-"');
        return;
      }
      addApiKey(selectedProvider, apiKey.trim());
      setApiKey('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Manage API Keys</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-amber-50 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">
            Your API keys are stored locally in your browser. Never share them or expose them to untrusted sources.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">API Provider</label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option>OpenAI</option>
              <option>DeepL</option>
              <option>Google Translate</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">API Key</label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="w-full border border-gray-200 rounded-lg p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <Key className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Add API Key
          </button>
        </form>

        {apiKeys.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-3">Saved API Keys</h3>
            <div className="space-y-2">
              {apiKeys.map((key) => (
                <div
                  key={key.provider}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <span className="text-sm">{key.provider}</span>
                  <button
                    onClick={() => removeApiKey(key.provider)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}