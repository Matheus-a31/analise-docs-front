import React from 'react';
import { Trash2, Eye } from 'lucide-react';

interface SelectionActionMenuProps {
  selectedCount: number;
  onRequestDelete: () => void;
  onViewAnalysis: () => void;
}

export const SelectionActionMenu: React.FC<SelectionActionMenuProps> = ({
  selectedCount,
  onRequestDelete,
  onViewAnalysis,
}) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div
      data-testid="selection-action-menu"
      className="bg-white border border-gray-200 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] py-2 px-2.5 min-w-[230px] flex flex-col gap-1 self-start animate-in fade-in duration-150"
    >
      <button
        type="button"
        onClick={onRequestDelete}
        data-testid="btn-delete-selected"
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
      >
        <Trash2 className="w-[18px] h-[18px] text-[#EF4444] shrink-0" />
        <span>Excluir documentos</span>
      </button>

      {selectedCount === 1 && (
        <button
          type="button"
          onClick={onViewAnalysis}
          data-testid="btn-view-analysis"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium text-gray-600 hover:bg-emerald-50 hover:text-[#2E9E5B] transition-colors text-left"
        >
          <span className="w-[18px] h-[18px] rounded-full bg-[#2E9E5B] flex items-center justify-center shrink-0">
            <Eye className="w-3 h-3 text-white stroke-[2.5]" />
          </span>
          <span>Visualizar analise</span>
        </button>
      )}
    </div>
  );
};
