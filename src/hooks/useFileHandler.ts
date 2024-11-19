import { useState, useCallback } from 'react';
import { FileWithPreview, TranslationState } from '../types';
import mammoth from 'mammoth';
import OpenAI from 'openai';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export function useFileHandler() {
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null);
  const [translationState, setTranslationState] = useState<TranslationState>({
    isTranslating: false,
    progress: 0,
    translatedContent: null,
    error: null,
    originalText: null,
    originalHtml: null,
  });

  const handleFile = useCallback(async (file: File) => {
    try {
      if (!file.name.endsWith('.doc') && !file.name.endsWith('.docx')) {
        throw new Error('Only DOC and DOCX files are supported');
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      const arrayBuffer = await file.arrayBuffer();
      const textResult = await mammoth.extractRawText({ arrayBuffer });
      const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
      
      setSelectedFile({
        file,
        preview: `Word Document: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`,
      });
      
      setTranslationState(prev => ({ 
        ...prev, 
        error: null, 
        translatedContent: null,
        originalText: textResult.value,
        originalHtml: htmlResult.value,
      }));
    } catch (error) {
      setTranslationState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to read file',
      }));
    }
  }, []);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setTranslationState({
      isTranslating: false,
      progress: 0,
      translatedContent: null,
      error: null,
      originalText: null,
      originalHtml: null,
    });
  }, []);

  const translateFile = useCallback(async (
    apiKey: string,
    provider: string,
    sourceLanguage: string,
    targetLanguage: string
  ) => {
    if (!selectedFile || !translationState.originalText) return;

    setTranslationState(prev => ({
      ...prev,
      isTranslating: true,
      progress: 0,
      error: null,
    }));

    try {
      if (provider === 'OpenAI') {
        const openai = new OpenAI({ 
          apiKey,
          dangerouslyAllowBrowser: true
        });
        
        setTranslationState(prev => ({ ...prev, progress: 30 }));

        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a professional translator. Translate the following text from ${sourceLanguage} to ${targetLanguage}. Maintain the original formatting and structure.`
            },
            {
              role: "user",
              content: translationState.originalText
            }
          ],
          temperature: 0.3,
        });

        const translatedText = response.choices[0]?.message?.content;
        if (!translatedText) throw new Error('No translation received');

        setTranslationState(prev => ({
          ...prev,
          isTranslating: false,
          progress: 100,
          translatedContent: translatedText,
        }));
      } else {
        throw new Error(`${provider} integration is not implemented yet`);
      }
    } catch (error) {
      setTranslationState(prev => ({
        ...prev,
        isTranslating: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Translation failed',
      }));
    }
  }, [selectedFile, translationState.originalText]);

  const downloadTranslation = useCallback(() => {
    if (!translationState.translatedContent || !selectedFile) return;

    try {
      // Create a new document
      const doc = new Document({
        sections: [{
          properties: {},
          children: translationState.translatedContent.split('\n').map(line => 
            new Paragraph({
              children: [
                new TextRun({
                  text: line,
                  break: true
                })
              ]
            })
          )
        }]
      });

      // Generate and download the document
      Packer.toBlob(doc).then(blob => {
        const fileName = `translated_${selectedFile.file.name}`;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
    } catch (error) {
      setTranslationState(prev => ({
        ...prev,
        error: 'Failed to download translated file',
      }));
    }
  }, [selectedFile, translationState.translatedContent]);

  return {
    selectedFile,
    translationState,
    handleFile,
    clearFile,
    translateFile,
    downloadTranslation,
  };
}