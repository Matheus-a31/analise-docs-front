import React, { useCallback, useState } from 'react';
import { Plus } from 'lucide-react';

interface EmptyDocumentsStateProps {
  onSelectFile: (file: File) => void;
  onTriggerFileInput: () => void;
}

export const EmptyDocumentsState: React.FC<EmptyDocumentsStateProps> = ({
  onSelectFile,
  onTriggerFileInput,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);

      const droppedFile = event.dataTransfer.files?.[0];
      if (droppedFile) {
        onSelectFile(droppedFile);
      }
    },
    [onSelectFile],
  );

  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Top Action Row */}
      <div className="flex items-center justify-end mb-5">
        <button
          type="button"
          onClick={onTriggerFileInput}
          className="inline-flex items-center gap-2 bg-[#2E9E5B] hover:bg-[#26874D] active:scale-[0.99] text-white text-[14px] font-medium px-5 py-2.5 rounded-lg transition-all shadow-sm"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Adicionar documento</span>
        </button>
      </div>

      {/* Dashed Dropzone Area matching .insp/115315.jpeg */}
      <div
        role="button"
        tabIndex={0}
        onClick={onTriggerFileInput}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onTriggerFileInput();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-testid="empty-dropzone"
        className={`flex-1 min-h-[440px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-8 text-center transition-all cursor-pointer select-none ${
          isDragging
            ? 'border-[#2E9E5B] bg-[#2E9E5B]/5 scale-[0.998]'
            : 'border-[#E5E7EB] bg-white hover:border-gray-300 hover:bg-gray-50/40'
        }`}
      >
        {/* List + Magnifying Glass SVG Icon matching Figma prototype */}
        <svg
          width="44"
          height="38"
          viewBox="0 0 44 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-gray-400 mb-4"
          aria-hidden="true"
        >
          <path
            d="M4 6H32M4 16H18M4 26H18"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <circle
            cx="29"
            cy="22"
            r="6.5"
            stroke="currentColor"
            strokeWidth="2.6"
          />
          <path
            d="M34 27L39.5 32.5"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </svg>

        <h3 className="text-[18px] font-semibold text-gray-700 tracking-tight">
          Você ainda não tem documentos
        </h3>
        <p className="mt-1.5 text-[14px] text-gray-500 max-w-[380px] leading-relaxed">
          Clique em &quot;Adicionar documentos&quot; para enviar um documento, imagem ou
          outro arquivo.
        </p>
        {isDragging && (
          <span className="mt-3 text-xs font-semibold text-[#2E9E5B] bg-[#2E9E5B]/10 px-3 py-1 rounded-full">
            Solte o arquivo aqui para analisar
          </span>
        )}
      </div>
    </div>
  );
};
