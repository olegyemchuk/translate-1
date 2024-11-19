import React from 'react';
import { Loader2 } from 'lucide-react';
import { TranslationState } from '../types';

type TranslationProgressProps = {
  state: TranslationState;
};

export default function TranslationProgress({ state }: TranslationProgressProps) {
  if (!state.isTranslating) return null;

  return (
    <div className="flex items-center gap-3 text-gray-600">
      <Loader2 className="w-4 h-4 animate-spin" />
      <div className="flex-1">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-black transition-all duration-300"
            style={{ width: `${state.progress}%` }}
          />
        </div>
        <p className="text-sm mt-1">Translating... {state.progress}%</p>
      </div>
    </div>
  );
}