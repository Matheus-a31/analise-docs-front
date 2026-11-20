export type AnalysisStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface DocumentItem {
  id: string;
  title: string;
  originalName: string;
  mimeType: string;
  extension: string;
  sizeBytes: number;
  s3Key: string;
  s3Url: string;
  downloadUrl: string;
  instruction: string;
  aiAnalysis: string | null;
  analysisStatus: AnalysisStatus;
  errorMessage: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentPayload {
  file: File;
  title: string;
  instruction: string;
}
