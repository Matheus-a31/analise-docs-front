import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { DocumentsPage } from '../DocumentsPage';
import { ToastProvider } from '../../context/ToastContext';
import { documentsApi } from '../../services/documents.api';
import { DocumentItem } from '../../types/document.types';

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'user-1',
      name: 'Dra. Mariana Gomes',
      email: 'mariana@silvagomes.com',
      picture: 'https://example.com/mariana.jpg',
    },
    isAuthenticated: true,
    isLoading: false,
    logout: vi.fn(),
  }),
}));

vi.mock('../../services/documents.api', () => ({
  documentsApi: {
    findAll: vi.fn(),
    findOne: vi.fn(),
    createAndAnalyze: vi.fn(),
    retryAnalysis: vi.fn(),
    deleteMany: vi.fn(),
  },
}));

const mockDocuments: DocumentItem[] = [
  {
    id: 'doc-1',
    title: 'Document.doc',
    originalName: 'Document.doc',
    mimeType: 'application/msword',
    extension: '.doc',
    sizeBytes: 34816,
    s3Key: 'documents/user-1/doc-1.doc',
    s3Url: 'https://s3.amazonaws.com/bucket/doc-1.doc',
    downloadUrl: 'https://s3.amazonaws.com/bucket/doc-1.doc',
    instruction: 'Analise as cláusulas deste contrato',
    aiAnalysis: 'Lorem ipsum dolor sit amet, análise jurídica gerada pelo GPT-4o-mini.',
    analysisStatus: 'COMPLETED',
    errorMessage: null,
    userId: 'user-1',
    createdAt: '2025-05-26T12:00:00.000Z',
    updatedAt: '2025-05-26T12:00:00.000Z',
  },
  {
    id: 'doc-2',
    title: 'Peticao.pdf',
    originalName: 'Peticao.pdf',
    mimeType: 'application/pdf',
    extension: '.pdf',
    sizeBytes: 69632,
    s3Key: 'documents/user-1/doc-2.pdf',
    s3Url: 'https://s3.amazonaws.com/bucket/doc-2.pdf',
    downloadUrl: 'https://s3.amazonaws.com/bucket/doc-2.pdf',
    instruction: 'Identifique os pedidos principais',
    aiAnalysis: 'Os pedidos principais incluem tutela de urgência e indenização.',
    analysisStatus: 'COMPLETED',
    errorMessage: null,
    userId: 'user-1',
    createdAt: '2025-05-26T14:00:00.000Z',
    updatedAt: '2025-05-26T14:00:00.000Z',
  },
];

function renderDocumentsPage() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <DocumentsPage />
      </ToastProvider>
    </MemoryRouter>,
  );
}

describe('DocumentsPage — Fluxos do Protótipo (.insp)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve exibir o perfil do Google na sidebar e o estado vazio quando não houver documentos', async () => {
    vi.mocked(documentsApi.findAll).mockResolvedValue([]);

    renderDocumentsPage();

    expect(await screen.findByText('Você ainda não tem documentos')).toBeInTheDocument();
    expect(screen.getAllByTestId('sidebar-user-name')[0]).toHaveTextContent(
      'Dra. Mariana Gomes',
    );
    expect(screen.getAllByTestId('sidebar-user-email')[0]).toHaveTextContent(
      'mariana@silvagomes.com',
    );
  });

  it('deve listar documentos e exibir "Excluir documentos" e "Visualizar analise" ao selecionar 1 documento', async () => {
    vi.mocked(documentsApi.findAll).mockResolvedValue(mockDocuments);

    renderDocumentsPage();

    expect(await screen.findByTestId('documents-total-counter')).toHaveTextContent(
      '2 Documentos',
    );

    // Seleciona o primeiro documento
    const card1 = screen.getByTestId('document-card-doc-1');
    fireEvent.click(card1);

    expect(screen.getByTestId('selected-counter-badge')).toHaveTextContent(
      '1 documento selecionado',
    );
    expect(screen.getByTestId('btn-delete-selected')).toBeInTheDocument();
    expect(screen.getByTestId('btn-view-analysis')).toBeInTheDocument();
  });

  it('deve ocultar "Visualizar analise" e manter apenas "Excluir documentos" ao selecionar 2 ou mais documentos', async () => {
    vi.mocked(documentsApi.findAll).mockResolvedValue(mockDocuments);

    renderDocumentsPage();

    await screen.findByTestId('documents-total-counter');

    fireEvent.click(screen.getByTestId('document-card-doc-1'));
    fireEvent.click(screen.getByTestId('document-card-doc-2'));

    expect(screen.getByTestId('selected-counter-badge')).toHaveTextContent(
      '2 documentos selecionados',
    );
    expect(screen.getByTestId('btn-delete-selected')).toBeInTheDocument();
    expect(screen.queryByTestId('btn-view-analysis')).not.toBeInTheDocument();
  });

  it('deve abrir o modal "Prévia do Documento" com a análise da IA ao clicar em "Visualizar analise"', async () => {
    vi.mocked(documentsApi.findAll).mockResolvedValue(mockDocuments);

    renderDocumentsPage();

    await screen.findByTestId('documents-total-counter');
    fireEvent.click(screen.getByTestId('document-card-doc-1'));
    fireEvent.click(screen.getByTestId('btn-view-analysis'));

    expect(screen.getByText('Prévia do Documento')).toBeInTheDocument();
    expect(screen.getByTestId('analysis-modal-doc-title')).toHaveTextContent(
      'Document.doc',
    );
    expect(screen.getByTestId('analysis-modal-ai-response')).toHaveTextContent(
      'Lorem ipsum dolor sit amet, análise jurídica gerada pelo GPT-4o-mini.',
    );
  });

  it('deve abrir o modal de upload ao anexar um arquivo e enviar título e instrução para análise', async () => {
    vi.mocked(documentsApi.findAll).mockResolvedValue([]);
    vi.mocked(documentsApi.createAndAnalyze).mockResolvedValue(mockDocuments[0]);

    renderDocumentsPage();

    await screen.findByText('Você ainda não tem documentos');

    const fileInput = screen.getByTestId('hidden-file-input');
    const sampleFile = new File(['Conteúdo do contrato'], 'Document.doc', {
      type: 'application/msword',
    });

    fireEvent.change(fileInput, { target: { files: [sampleFile] } });

    expect(await screen.findByText('Prévia do Documento')).toBeInTheDocument();

    const instructionInput = screen.getByPlaceholderText(
      'Como a IA deve analisar este documento',
    );
    fireEvent.change(instructionInput, {
      target: { value: 'Resuma os pontos críticos deste contrato' },
    });

    fireEvent.click(screen.getByTestId('btn-save-document'));

    await waitFor(() => {
      expect(documentsApi.createAndAnalyze).toHaveBeenCalledWith({
        file: sampleFile,
        title: 'Document.doc',
        instruction: 'Resuma os pontos críticos deste contrato',
      });
    });
  });
});
