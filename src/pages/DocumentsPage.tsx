import React, { useCallback, useRef, useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDocuments } from '../hooks/useDocuments';
import { CreateDocumentPayload, DocumentItem } from '../types/document.types';
import { Sidebar } from '../components/layout/Sidebar';
import { EmptyDocumentsState } from '../components/documents/EmptyDocumentsState';
import { DocumentCard } from '../components/documents/DocumentCard';
import { SelectionActionMenu } from '../components/documents/SelectionActionMenu';
import { DocumentUploadModal } from '../components/documents/DocumentUploadModal';
import { DocumentAnalysisModal } from '../components/documents/DocumentAnalysisModal';
import { ConfirmDeleteModal } from '../components/documents/ConfirmDeleteModal';

export const DocumentsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const {
    documents,
    selectedIds,
    isLoadingList,
    isUploadingAndAnalyzing,
    isRetryingAnalysis,
    isDeleting,
    toggleSelectDocument,
    clearSelection,
    createDocument,
    retryAnalysis,
    deleteSelectedDocuments,
  } = useDocuments();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingUploadFile, setPendingUploadFile] = useState<File | null>(null);
  const [viewingDocument, setViewingDocument] = useState<DocumentItem | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isGridDragging, setIsGridDragging] = useState(false);

  const handleTriggerFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  }, []);

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setPendingUploadFile(selectedFile);
    }
  };

  const handleUploadSubmit = async (payload: CreateDocumentPayload) => {
    const created = await createDocument(payload);
    setPendingUploadFile(null);
    setViewingDocument(created);
  };

  const handleViewSelectedAnalysis = () => {
    if (selectedIds.length !== 1) return;
    const found = documents.find((doc) => doc.id === selectedIds[0]);
    if (found) {
      setViewingDocument(found);
    }
  };

  const handleRetryAnalysisInModal = async (id: string) => {
    const updated = await retryAnalysis(id);
    setViewingDocument(updated);
  };

  const handleConfirmDelete = async () => {
    await deleteSelectedDocuments(selectedIds);
    setIsConfirmDeleteOpen(false);
  };

  const handleGridDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsGridDragging(true);
  };

  const handleGridDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsGridDragging(false);
  };

  const handleGridDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsGridDragging(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setPendingUploadFile(droppedFile);
    }
  };

  const selectedLabel =
    selectedIds.length === 1
      ? '1 documento selecionado'
      : `${selectedIds.length} documentos selecionados`;

  const totalLabel =
    documents.length === 1 ? '1 Documento' : `${documents.length} Documentos`;

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Left Green Sidebar matching .insp/ */}
      <Sidebar user={user} onLogout={logout} />

      {/* Hidden File Input for Upload */}
      <input
        ref={fileInputRef}
        type="file"
        data-testid="hidden-file-input"
        accept=".pdf,.doc,.docx,.txt,.csv,.md,.json,.png,.jpg,.jpeg,.webp"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Main Content Area */}
      <main
        className="flex-1 flex flex-col px-6 sm:px-9 py-7 min-w-0"
        onClick={(e) => {
          if (e.target === e.currentTarget && selectedIds.length > 0) {
            clearSelection();
          }
        }}
      >
        {/* Page Heading */}
        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight mb-5">
          Documentos
        </h1>

        {/* Outer Container Card matching .insp/ */}
        <div
          onDragOver={documents.length > 0 ? handleGridDragOver : undefined}
          onDragLeave={documents.length > 0 ? handleGridDragLeave : undefined}
          onDrop={documents.length > 0 ? handleGridDrop : undefined}
          className={`flex-1 flex flex-col border rounded-2xl bg-white p-6 transition-colors ${
            isGridDragging
              ? 'border-[#2E9E5B] bg-[#2E9E5B]/[0.02]'
              : 'border-[#E5E7EB]'
          }`}
        >
          {isLoadingList ? (
            <div className="flex-1 min-h-[420px] flex flex-col items-center justify-center text-gray-400 gap-3">
              <Loader2 className="w-7 h-7 animate-spin text-[#2E9E5B]" />
              <span className="text-sm font-medium text-gray-500">
                Carregando documentos...
              </span>
            </div>
          ) : documents.length === 0 ? (
            <EmptyDocumentsState
              onSelectFile={(file) => setPendingUploadFile(file)}
              onTriggerFileInput={handleTriggerFileInput}
            />
          ) : (
            <div className="flex-1 flex flex-col">
              {/* Top Header Row inside Container matching .insp/115356, 115437, 115422 */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2
                  data-testid="documents-total-counter"
                  className="text-[18px] font-semibold text-gray-800 tracking-tight"
                >
                  {totalLabel}
                </h2>

                <div className="flex items-center gap-3">
                  {selectedIds.length > 0 && (
                    <div
                      data-testid="selected-counter-badge"
                      className="bg-[#F3F4F6] text-gray-700 text-[13.5px] font-medium px-4 py-2 rounded-lg select-none"
                    >
                      {selectedLabel}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleTriggerFileInput}
                    data-testid="btn-add-document"
                    className="inline-flex items-center gap-2 bg-[#2E9E5B] hover:bg-[#26874D] active:scale-[0.99] text-white text-[14px] font-medium px-5 py-2.5 rounded-lg transition-all shadow-sm"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Adicionar documento</span>
                  </button>
                </div>
              </div>

              {/* Documents Grid + Floating Selection Action Menu matching .insp/115437 & 115422 */}
              <div className="flex flex-wrap items-start gap-6">
                <div
                  data-testid="documents-grid"
                  className="flex flex-wrap items-start gap-3 sm:gap-4"
                >
                  {documents.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      isSelected={selectedIds.includes(doc.id)}
                      onToggleSelect={toggleSelectDocument}
                      onOpenAnalysis={(item) => setViewingDocument(item)}
                    />
                  ))}
                </div>

                {/* Floating Action Menu next to the document cards */}
                <SelectionActionMenu
                  selectedCount={selectedIds.length}
                  onRequestDelete={() => setIsConfirmDeleteOpen(true)}
                  onViewAnalysis={handleViewSelectedAnalysis}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal 1: Prévia do Documento (Upload & Instruction for GPT-4o-mini) */}
      <DocumentUploadModal
        file={pendingUploadFile}
        isSubmitting={isUploadingAndAnalyzing}
        onClose={() => {
          if (!isUploadingAndAnalyzing) {
            setPendingUploadFile(null);
          }
        }}
        onSubmit={handleUploadSubmit}
      />

      {/* Modal 2: Prévia do Documento (View AI Analysis & Retry) */}
      <DocumentAnalysisModal
        document={viewingDocument}
        isRetrying={isRetryingAnalysis}
        onClose={() => setViewingDocument(null)}
        onRetryAnalysis={handleRetryAnalysisInModal}
      />

      {/* Modal 3: Safe Deletion Confirmation */}
      <ConfirmDeleteModal
        isOpen={isConfirmDeleteOpen}
        count={selectedIds.length}
        isDeleting={isDeleting}
        onCancel={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
