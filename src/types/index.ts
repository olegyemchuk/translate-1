export type FileWithPreview = {
  file: File;
  preview: string | null;
};

export type TranslationState = {
  isTranslating: boolean;
  progress: number;
  translatedContent: string | null;
  error: string | null;
  originalText: string | null;
  originalHtml: string | null;
};