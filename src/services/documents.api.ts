import { CreateDocumentPayload, DocumentItem } from '../types/document.types';
import { apiRequest } from './api-client';

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
