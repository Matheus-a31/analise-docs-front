import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import { DocumentItem } from '../../types/document.types';
import {
  formatDatePtBr,
  formatFileSize,
  getExtensionBadgeLabel,
  normalizeExtension,
} from '../../utils/formatters';

interface DocumentCardProps {
  document: DocumentItem;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onOpenAnalysis: (document: DocumentItem) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  isSelected,
  onToggleSelect,
  onOpenAnalysis,
}) => {
  const badgeLabel = getExtensionBadgeLabel(document.extension || document.originalName);
  const displayExtension = normalizeExtension(document.extension || document.originalName);

  const handleCardClick = () => {
    onToggleSelect(document.id);
  };

  const handleCheckboxClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onToggleSelect(document.id);
  };

  const handleDoubleClick = () => {
    onOpenAnalysis(document);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onOpenAnalysis(document);
        } else if (e.key === ' ') {
          e.preventDefault();
          onToggleSelect(document.id);
        }
      }}
      data-testid={`document-card-${document.id}`}
      className={`group relative w-[124px] sm:w-[132px] rounded-xl px-3 py-3.5 flex flex-col items-center text-center transition-all duration-150 cursor-pointer select-none ${
        isSelected
          ? 'bg-[#EBF5FF]'
          : 'bg-transparent hover:bg-[#F3F4F6]'
      }`}
    >
      {/* Top-Left Selection Checkbox matching .insp/115437.jpeg & 115422.jpeg */}
      <button
        type="button"
        onClick={handleCheckboxClick}
        aria-label={`Selecionar ${document.title}`}
        aria-pressed={isSelected}
        data-testid={`document-checkbox-${document.id}`}
        className={`absolute top-2.5 left-2.5 w-[18px] h-[18px] rounded-[4px] flex items-center justify-center border transition-all ${
          isSelected
            ? 'opacity-100 bg-[#1D9BF0] border-[#1D9BF0] text-white shadow-sm'
            : 'opacity-0 group-hover:opacity-100 focus:opacity-100 bg-white border-gray-300 hover:border-[#1D9BF0]'
        }`}
      >
        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </button>

      {/* AI Failed Status Indicator if failed */}
      {document.analysisStatus === 'FAILED' && (
        <span
          title="Falha na análise da IA — clique para tentar novamente"
          className="absolute top-2.5 right-2.5 text-amber-500"
        >
          <AlertTriangle className="w-4 h-4" />
        </span>
      )}

      {/* Document Page Sheet Icon matching .insp/115356.jpeg */}
      <div className="w-[54px] h-[68px] bg-white border border-gray-300 rounded-[4px] shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center mb-2.5 shrink-0">
        <div className="flex flex-col items-center">
          {/* Small inner folded page symbol */}
          <svg
            width="18"
            height="14"
            viewBox="0 0 18 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-500 mb-0.5"
          >
            <path
              d="M2 1.5H11.5L16 6V12.5H2V1.5Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path
              d="M11 1.5V6.5H16"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[9px] font-extrabold text-gray-600 tracking-tight leading-none">
            {badgeLabel}
          </span>
        </div>
      </div>

      {/* Document Title */}
      <p
        title={document.title}
        className="text-[12.5px] font-semibold text-gray-800 truncate w-full leading-tight"
      >
        {document.title.replace(/\.[^/.]+$/, '') || document.title}
      </p>

      {/* Date DD/MM/YYYY */}
      <p className="text-[11px] text-gray-400 mt-1 leading-none">
        {formatDatePtBr(document.createdAt)}
      </p>

      {/* Size & Extension */}
      <p className="text-[10.5px] text-gray-400 mt-1 leading-none">
        {formatFileSize(document.sizeBytes)} &nbsp;·&nbsp; {displayExtension}
      </p>
    </div>
  );
};
