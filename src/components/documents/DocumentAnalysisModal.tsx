import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { DocumentItem } from '../../types/document.types';
import { DocumentMiniaturePreview } from './DocumentMiniaturePreview';

interface DocumentAnalysisModalProps {
  document: DocumentItem | null;
  isRetrying: boolean;
  onClose: () => void;
  onRetryAnalysis: (id: string) => Promise<void>;
}

export const DocumentAnalysisModal: React.FC<DocumentAnalysisModalProps> = ({
  document,
  isRetrying,
  onClose,
  onRetryAnalysis,
}) => {
  if (!document) {
    return null;
  }

  const fileUrl = document.downloadUrl || document.s3Url;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/35 flex items-center justify-center p-4 transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="analysis-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[480px] p-6 relative animate-in fade-in zoom-in-95 duration-150">
        {/* Header matching .insp/11549.jpeg */}
        <div className="flex items-center justify-between">
          <h2
            id="analysis-modal-title"
            className="text-[18px] font-semibold text-gray-800 tracking-tight"
          >
            Prévia do Documento
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar prévia do documento"
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Miniature Preview Box (Real Document Preview from AWS S3) */}
        <DocumentMiniaturePreview
          sizeBytes={document.sizeBytes}
          extensionOrName={document.extension || document.originalName}
          mimeType={document.mimeType}
          documentId={document.id}
          downloadUrl={fileUrl}
        />

        {/* Título Section matching .insp/11549.jpeg */}
        <div className="mt-4">
          <p
            id="analysis-doc-title-label"
            className="block text-[13px] font-medium text-gray-600 mb-1.5"
          >
            Título
          </p>
          <div
            aria-labelledby="analysis-doc-title-label"
            data-testid="analysis-modal-doc-title"
            className="w-full bg-[#F3F4F6] text-gray-800 text-[14px] rounded-lg px-3.5 py-2.5 truncate"
          >
            {document.title}
          </div>
        </div>

        {/* Analise da IA Section matching .insp/11549.jpeg */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <p
              id="analysis-ai-label"
              className="block text-[13px] font-medium text-gray-600"
            >
              Analise da IA
            </p>
            {document.analysisStatus === 'FAILED' && (
              <button
                type="button"
                onClick={() => onRetryAnalysis(document.id)}
                disabled={isRetrying}
                data-testid="btn-retry-analysis"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2E9E5B] hover:text-[#26874D] disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                <span>{isRetrying ? 'Reprocessando...' : 'Tentar de novo'}</span>
              </button>
            )}
          </div>

          {document.analysisStatus === 'FAILED' ? (
            <div className="w-full bg-red-50 border border-red-100 text-red-700 text-[13.5px] rounded-lg p-3.5 flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {document.errorMessage ||
                    'Não foi possível gerar a análise da IA para este documento (timeout ou limite de uso).'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRetryAnalysis(document.id)}
                disabled={isRetrying}
                className="self-start mt-1 inline-flex items-center gap-1.5 bg-[#2E9E5B] hover:bg-[#26874D] disabled:opacity-60 text-white text-xs font-medium px-3.5 py-1.5 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                <span>{isRetrying ? 'Consultando GPT-4o-mini...' : 'Tentar novamente'}</span>
              </button>
            </div>
          ) : (
            <div
              data-testid="analysis-modal-ai-response"
              className="w-full bg-[#F3F4F6] text-gray-500 text-[14px] leading-relaxed rounded-lg p-3.5 min-h-[108px] max-h-[210px] overflow-y-auto whitespace-pre-wrap"
            >
              {document.aiAnalysis || 'Nenhuma análise disponível.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
