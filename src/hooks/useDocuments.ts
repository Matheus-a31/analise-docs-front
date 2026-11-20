import { useCallback, useEffect, useState } from 'react';
import { CreateDocumentPayload, DocumentItem } from '../types/document.types';
import { documentsApi } from '../services/documents.api';
import { useToast } from '../context/ToastContext';

export function useDocuments() {
  const { showToast } = useToast();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(true);
  const [isUploadingAndAnalyzing, setIsUploadingAndAnalyzing] = useState<boolean>(false);
  const [isRetryingAnalysis, setIsRetryingAnalysis] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const loadDocuments = useCallback(async () => {
    setIsLoadingList(true);
    try {
      const data = await documentsApi.findAll();
      setDocuments(data);
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Erro ao carregar documentos',
        description: error instanceof Error ? error.message : 'Tente atualizar a página.',
      });
    } finally {
      setIsLoadingList(false);
    }
  }, [showToast]);

  useEffect(() => {
    void loadDocuments();
  }, [loadDocuments]);

  const toggleSelectDocument = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const createDocument = useCallback(
    async (payload: CreateDocumentPayload): Promise<DocumentItem> => {
      setIsUploadingAndAnalyzing(true);
      try {
        const created = await documentsApi.createAndAnalyze(payload);
        setDocuments((prev) => [created, ...prev]);

        if (created.analysisStatus === 'FAILED') {
          showToast({
            type: 'info',
            title: 'Documento salvo, mas a análise da IA falhou',
            description:
              created.errorMessage ||
              'Você pode abrir o documento e clicar em "Tentar novamente".',
          });
        } else {
          showToast({
            type: 'success',
            title: 'Documento analisado com sucesso!',
            description: `A análise de "${created.title}" pelo GPT-4o-mini está pronta.`,
          });
        }

        return created;
      } catch (error) {
        showToast({
          type: 'error',
          title: 'Falha ao enviar documento',
          description:
            error instanceof Error
              ? error.message
              : 'Verifique o arquivo e tente novamente.',
        });
        throw error;
      } finally {
        setIsUploadingAndAnalyzing(false);
      }
    },
    [showToast],
  );

  const retryAnalysis = useCallback(
    async (id: string): Promise<DocumentItem> => {
      setIsRetryingAnalysis(true);
      try {
        const updated = await documentsApi.retryAnalysis(id);
        setDocuments((prev) => prev.map((doc) => (doc.id === updated.id ? updated : doc)));
        showToast({
          type: 'success',
          title: 'Análise concluída!',
          description: 'O GPT-4o-mini concluiu a análise do documento.',
        });
        return updated;
      } catch (error) {
        showToast({
          type: 'error',
          title: 'Não foi possível concluir a análise',
          description:
            error instanceof Error
              ? error.message
              : 'Verifique a conexão com a OpenAI e tente novamente.',
        });
        throw error;
      } finally {
        setIsRetryingAnalysis(false);
      }
    },
    [showToast],
  );

  const deleteSelectedDocuments = useCallback(
    async (idsToDelete: string[]) => {
      if (idsToDelete.length === 0) return;
      setIsDeleting(true);
      try {
        await documentsApi.deleteMany(idsToDelete);
        setDocuments((prev) => prev.filter((doc) => !idsToDelete.includes(doc.id)));
        setSelectedIds((prev) => prev.filter((id) => !idsToDelete.includes(id)));
        showToast({
          type: 'success',
          title:
            idsToDelete.length === 1
              ? 'Documento excluído'
              : `${idsToDelete.length} documentos excluídos`,
          description: 'Os arquivos e suas análises foram removidos com segurança.',
        });
      } catch (error) {
        showToast({
          type: 'error',
          title: 'Erro ao excluir documentos',
          description:
            error instanceof Error ? error.message : 'Tente novamente em instantes.',
        });
        throw error;
      } finally {
        setIsDeleting(false);
      }
    },
    [showToast],
  );

  return {
    documents,
    selectedIds,
    isLoadingList,
    isUploadingAndAnalyzing,
    isRetryingAnalysis,
    isDeleting,
    loadDocuments,
    toggleSelectDocument,
    clearSelection,
    createDocument,
    retryAnalysis,
    deleteSelectedDocuments,
  };
}
