import React, { useEffect, useState } from 'react';
import { Loader2, Sparkles, X } from 'lucide-react';
import { CreateDocumentPayload } from '../../types/document.types';
import { DocumentMiniaturePreview } from './DocumentMiniaturePreview';

interface DocumentUploadModalProps {
  file: File | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateDocumentPayload) => Promise<void>;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  file,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [instruction, setInstruction] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setTitle('');
      setInstruction('');
      setValidationError(null);
      return;
    }

    setTitle(file.name);
    setInstruction('');
    setValidationError(null);
  }, [file]);

  if (!file) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidationError(null);

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setValidationError('O arquivo excede o limite máximo de 10 MB.');
      return;
    }

    if (!title.trim()) {
      setValidationError('Informe um título para o documento.');
      return;
    }

    if (!instruction.trim()) {
      setValidationError('Informe uma instrução dizendo como a IA deve analisar este documento.');
      return;
    }

    await onSubmit({
      file,
      title: title.trim(),
      instruction: instruction.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/35 flex items-center justify-center p-4 transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[480px] p-6 relative animate-in fade-in zoom-in-95 duration-150">
        {/* Header matching .insp/115345.jpeg */}
        <div className="flex items-center justify-between">
          <h2
            id="upload-modal-title"
            className="text-[18px] font-semibold text-gray-800 tracking-tight"
          >
            Prévia do Documento
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Fechar modal"
            className="text-gray-400 hover:text-gray-600 disabled:opacity-40 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Miniature Preview Box (Real Document Preview) */}
        <DocumentMiniaturePreview
          sizeBytes={file.size}
          extensionOrName={file.name}
          mimeType={file.type}
          file={file}
        />

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="mt-4">
          <div>
            <label
              htmlFor="doc-title-input"
              className="block text-[13px] font-medium text-gray-600 mb-1.5"
            >
              Título
            </label>
            <input
              id="doc-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              maxLength={160}
              placeholder="Document.doc"
              className="w-full bg-[#F3F4F6] text-gray-800 text-[14px] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#2E9E5B]/40 disabled:opacity-60 transition-all"
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="doc-instruction-input"
              className="block text-[13px] font-medium text-gray-600 mb-1.5"
            >
              Instrução para IA
            </label>
            <textarea
              id="doc-instruction-input"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              disabled={isSubmitting}
              maxLength={4000}
              placeholder="Como a IA deve analisar este documento"
              className="w-full bg-[#F3F4F6] text-gray-800 placeholder:text-gray-400 text-[14px] rounded-lg px-3.5 py-2.5 h-[88px] resize-none outline-none focus:ring-2 focus:ring-[#2E9E5B]/40 disabled:opacity-60 transition-all"
            />
          </div>

          {validationError && (
            <p
              role="alert"
              className="mt-3 text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2"
            >
              {validationError}
            </p>
          )}

          {isSubmitting && (
            <div
              data-testid="ai-loading-indicator"
              className="mt-3.5 flex items-center gap-2.5 text-xs font-medium text-[#2E9E5B] bg-[#2E9E5B]/10 rounded-lg px-3.5 py-2.5"
            >
              <Sparkles className="w-4 h-4 shrink-0 animate-pulse" />
              <span>
                Enviando arquivo para a AWS e gerando análise com o GPT-4o-mini...
              </span>
            </div>
          )}

          {/* Footer Save Button matching .insp/115345.jpeg */}
          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              data-testid="btn-save-document"
              className="inline-flex items-center justify-center gap-2 bg-[#2E9E5B] hover:bg-[#26874D] disabled:opacity-60 text-white text-[14px] font-medium px-6 py-2 rounded-lg transition-all shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analisando...</span>
                </>
              ) : (
                <span>Salvar</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
