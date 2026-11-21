import { CreateDocumentPayload, DocumentItem } from '../types/document.types';
import { API_BASE_URL, apiRequest, getStoredToken } from './api-client';

export const documentsApi = {
  findAll(): Promise<DocumentItem[]> {
    return apiRequest<DocumentItem[]>('/documents', {
      method: 'GET',
    });
  },

  findOne(id: string): Promise<DocumentItem> {
    return apiRequest<DocumentItem>(`/documents/${id}`, {
      method: 'GET',
    });
  },

  async fetchContentArrayBuffer(id: string): Promise<ArrayBuffer> {
    const token = getStoredToken();
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await fetch(`${API_BASE_URL}/documents/${id}/content`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Não foi possível carregar o conteúdo do documento para pré-visualização.');
    }

    return response.arrayBuffer();
  },

  createAndAnalyze(payload: CreateDocumentPayload): Promise<DocumentItem> {
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('title', payload.title);
    formData.append('instruction', payload.instruction);

    return apiRequest<DocumentItem>('/documents', {
      method: 'POST',
      body: formData,
    });
  },

  retryAnalysis(id: string): Promise<DocumentItem> {
    return apiRequest<DocumentItem>(`/documents/${id}/retry-analysis`, {
      method: 'POST',
    });
  },

  deleteMany(ids: string[]): Promise<{ deletedCount: number; deletedIds: string[] }> {
    return apiRequest<{ deletedCount: number; deletedIds: string[] }>('/documents', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
  },
};
