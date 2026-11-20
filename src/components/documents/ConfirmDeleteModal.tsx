import React from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  count: number;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  count,
  isDeleting,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen || count === 0) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/35 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[420px] p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2
                id="confirm-delete-title"
                className="text-[16px] font-semibold text-gray-900"
              >
                {count === 1 ? 'Excluir documento?' : `Excluir ${count} documentos?`}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Esta ação não poderá ser desfeita.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            aria-label="Fechar confirmação"
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-4 text-[13.5px] text-gray-600 leading-relaxed">
          {count === 1
            ? 'O arquivo original armazenado na AWS e a análise gerada pela IA serão permanentemente removidos.'
            : `Os ${count} arquivos selecionados e suas respectivas análises da IA serão permanentemente removidos.`}
        </p>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg text-[13.5px] font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            data-testid="btn-confirm-delete"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13.5px] font-medium text-white bg-[#EF4444] hover:bg-red-600 disabled:opacity-60 transition-colors shadow-sm"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Excluindo...</span>
              </>
            ) : (
              <span>Sim, excluir</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
