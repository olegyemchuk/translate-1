import React, { useCallback } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { FileWithPreview } from '../types';

type FileDropzoneProps = {
  selectedFile: FileWithPreview | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
};

export default function FileDropzone({ selectedFile, onFileSelect, onClear }: FileDropzoneProps) {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  if (selectedFile) {
    return (
      <div className="border-2 border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <div>
              <span className="font-medium">{selectedFile.file.name}</span>
              <p className="text-sm text-gray-500">
                {(selectedFile.file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-gray-300 transition-colors cursor-pointer"
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <Upload className="w-10 h-10 mx-auto mb-4 text-gray-400" />
      <h3 className="text-lg font-semibold">Drop your Word document here</h3>
      <p className="text-gray-500 mt-2">or click to browse</p>
      <p className="text-sm text-gray-400 mt-4">
        Supports DOC and DOCX files only
      </p>
      <input
        id="file-input"
        type="file"
        className="hidden"
        onChange={handleFileInput}
        accept=".doc,.docx"
      />
    </div>
  );
}