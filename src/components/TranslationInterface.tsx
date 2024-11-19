import React, { useState, useCallback } from 'react';
import { Languages, Download, ChevronDown, AlertCircle } from 'lucide-react';
import { useApi } from '../contexts/ApiContext';
import FileDropzone from './FileDropzone';
import TranslationProgress from './TranslationProgress';
import { useFileHandler } from '../hooks/useFileHandler';

const apis = ['OpenAI', 'DeepL', 'Google Translate'];
const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];

export default function TranslationInterface() {
  const { getApiKey } = useApi();
  const [selectedApi, setSelectedApi] = useState(apis[0]);
  const [sourceLanguage, setSourceLanguage] = useState('Auto Detect');
  const [targetLanguage, setTargetLanguage] = useState(languages[0]);

  const {
    selectedFile,
    translationState,
    handleFile,
    clearFile,
    translateFile,
    downloadTranslation,
  } = useFileHandler();

  const hasApiKey = getApiKey(selectedApi) !== null;

  const handleTranslate = useCallback(async () => {
    const apiKey = getApiKey(selectedApi);
    if (!apiKey || !selectedFile) return;

    await translateFile(apiKey, selectedApi, sourceLanguage, targetLanguage);
  }, [selectedApi, sourceLanguage, targetLanguage, selectedFile, getApiKey, translateFile]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload */}
          <div className="space-y-6">
            <FileDropzone
              selectedFile={selectedFile}
              onFileSelect={handleFile}
              onClear={clearFile}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium">API Provider</label>
                <div className="relative">
                  <select
                    value={selectedApi}
                    onChange={(e) => setSelectedApi(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    {apis.map((api) => (
                      <option key={api}>{api}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              {!hasApiKey && (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm">Please add an API key for {selectedApi} in settings</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">From</label>
                  <div className="relative">
                    <select
                      value={sourceLanguage}
                      onChange={(e) => setSourceLanguage(e.target.value)}
                      className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option>Auto Detect</option>
                      {languages.map((lang) => (
                        <option key={lang}>{lang}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">To</label>
                  <div className="relative">
                    <select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      {languages.map((lang) => (
                        <option key={lang}>{lang}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                  </div>
                </div>
              </div>

              <TranslationProgress state={translationState} />

              {translationState.error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm">{translationState.error}</p>
                </div>
              )}

              <button 
                onClick={handleTranslate}
                className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  hasApiKey && selectedFile && !translationState.isTranslating
                    ? 'bg-black text-white hover:bg-gray-800' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!hasApiKey || !selectedFile || translationState.isTranslating}
              >
                <Languages className="w-5 h-5" />
                Translate Now
              </button>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="bg-gray-50 rounded-xl p-6 h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Preview</h3>
              <button
                onClick={downloadTranslation}
                disabled={!translationState.translatedContent}
                className={`flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg transition-colors ${
                  translationState.translatedContent
                    ? 'hover:bg-white cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
            <div className="flex-1 bg-white rounded-lg p-4 overflow-auto">
              {translationState.translatedContent ? (
                <div className="whitespace-pre-wrap font-mono text-sm text-gray-600">
                  {translationState.translatedContent}
                </div>
              ) : translationState.originalText ? (
                <div className="whitespace-pre-wrap font-mono text-sm text-gray-400">
                  {translationState.originalText}
                </div>
              ) : (
                <p className="text-gray-400 text-center mt-8">
                  {selectedFile
                    ? 'Click "Translate Now" to see the translation'
                    : 'Upload a file to see the preview here'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}