import React, { useEffect, useState } from 'react';
import { ExternalLink, FileText, Loader2 } from 'lucide-react';
import {
  formatFileSize,
  getExtensionBadgeLabel,
  normalizeExtension,
} from '../../utils/formatters';
import {
  extractDocxSnippet,
  extractPlainTextSnippet,
  renderPdfFirstPageToDataUrl,
} from '../../utils/document-preview';
import { documentsApi } from '../../services/documents.api';

interface DocumentMiniaturePreviewProps {
  sizeBytes: number;
  extensionOrName: string;
  mimeType?: string;
  file?: File | null;
  documentId?: string;
  downloadUrl?: string | null;
}

type PreviewState =
  | { status: 'loading' }
  | { status: 'image'; src: string }
  | { status: 'text'; content: string }
  | { status: 'fallback' };

export const DocumentMiniaturePreview: React.FC<DocumentMiniaturePreviewProps> = ({
  sizeBytes,
  extensionOrName,
  mimeType = '',
  file,
  documentId,
  downloadUrl,
}) => {
  const ext = normalizeExtension(extensionOrName);
  const badge = getExtensionBadgeLabel(ext);
  const [preview, setPreview] = useState<PreviewState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    let createdObjectUrl: string | null = null;

    const loadPreview = async () => {
      const normalizedMime = mimeType.toLowerCase();
      const isImage =
        normalizedMime.startsWith('image/') ||
        ['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext);
      const isPdf = normalizedMime === 'application/pdf' || ext === '.pdf';
      const isDocx =
        normalizedMime.includes('wordprocessingml') || ext === '.docx';
      const isTextLike =
        normalizedMime.startsWith('text/') ||
        ['.txt', '.csv', '.md', '.json', '.doc'].includes(ext);

      if (!file && !documentId) {
        if (!cancelled) setPreview({ status: 'fallback' });
        return;
      }

      if (!cancelled) {
        setPreview({ status: 'loading' });
      }

      try {
        // 1. Images: use direct File object URL or authenticated binary blob
        if (isImage) {
          if (file) {
            createdObjectUrl = URL.createObjectURL(file);
            if (!cancelled) setPreview({ status: 'image', src: createdObjectUrl });
            return;
          }
          if (documentId) {
            const buffer = await documentsApi.fetchContentArrayBuffer(documentId);
            const blob = new Blob([buffer], { type: normalizedMime || 'image/png' });
            createdObjectUrl = URL.createObjectURL(blob);
            if (!cancelled) setPreview({ status: 'image', src: createdObjectUrl });
            return;
          }
        }

        // Obtain ArrayBuffer from local File or authenticated backend proxy
        const arrayBuffer = file
          ? await file.arrayBuffer()
          : documentId
            ? await documentsApi.fetchContentArrayBuffer(documentId)
            : null;

        if (!arrayBuffer || arrayBuffer.byteLength === 0) {
          if (!cancelled) setPreview({ status: 'fallback' });
          return;
        }

        // 2. PDF: render actual first page using pdfjs-dist
        if (isPdf) {
          const dataUrl = await renderPdfFirstPageToDataUrl(arrayBuffer);
          if (!cancelled) {
            setPreview({ status: 'image', src: dataUrl });
          }
          return;
        }

        // 3. DOCX: extract real document text using mammoth
        if (isDocx) {
          const text = await extractDocxSnippet(arrayBuffer);
          if (!cancelled) {
            setPreview(text ? { status: 'text', content: text } : { status: 'fallback' });
          }
          return;
        }

        // 4. Plain text / CSV / MD / JSON / legacy .doc text
        if (isTextLike) {
          const text = extractPlainTextSnippet(arrayBuffer);
          if (!cancelled) {
            setPreview(text ? { status: 'text', content: text } : { status: 'fallback' });
          }
          return;
        }

        if (!cancelled) {
          setPreview({ status: 'fallback' });
        }
      } catch {
        // If image fails via authenticated proxy, try direct signed URL as fallback
        if (isImage && downloadUrl && !cancelled) {
          setPreview({ status: 'image', src: downloadUrl });
          return;
        }
        if (!cancelled) {
          setPreview({ status: 'fallback' });
        }
      }
    };

    void loadPreview();

    return () => {
      cancelled = true;
      if (createdObjectUrl) {
        URL.revokeObjectURL(createdObjectUrl);
      }
    };
  }, [file, documentId, mimeType, ext, downloadUrl]);

  return (
    <div className="mt-4 bg-[#F9FAFB] rounded-xl px-4 pt-3.5 pb-8 min-h-[184px] flex flex-col items-center justify-center relative border border-gray-100/80 overflow-hidden">
      {preview.status === 'loading' && (
        <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin text-[#2E9E5B]" />
          <span className="text-[11px] font-medium">Carregando prévia...</span>
        </div>
      )}

      {preview.status === 'image' && (
        <img
          src={preview.src}
          alt="Prévia real do documento"
          data-testid="real-document-preview-image"
          className="max-h-[146px] max-w-[260px] object-contain rounded-[4px] shadow-[0_2px_10px_rgba(0,0,0,0.08)] border border-gray-200 bg-white"
        />
      )}

      {preview.status === 'text' && (
        <div
          data-testid="real-document-preview-text"
          className="w-[116px] h-[142px] bg-white border border-gray-200 rounded-[4px] shadow-[0_2px_10px_rgba(0,0,0,0.07)] p-2.5 overflow-hidden relative select-none"
        >
          <p className="text-[5.5px] leading-[1.45] text-gray-700 font-normal whitespace-pre-wrap break-words">
            {preview.content}
          </p>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white to-transparent" />
        </div>
      )}

      {preview.status === 'fallback' && (
        <div
          data-testid="fallback-document-preview"
          className="w-[90px] h-[116px] bg-white border border-gray-200 rounded-[4px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center gap-1.5 select-none"
        >
          <FileText className="w-6 h-6 text-gray-400" />
          <span className="text-[10px] font-bold text-gray-500 tracking-wide">
            {badge}
          </span>
        </div>
      )}

      {/* Bottom-left size & extension label matching .insp/115345.jpeg ("34 KB  .pdf") */}
      <span
        data-testid="preview-file-meta"
        className="absolute bottom-2.5 left-3.5 text-[11px] text-gray-400 font-normal"
      >
        {formatFileSize(sizeBytes)} &nbsp; {ext}
      </span>

      {/* Optional link to view/download original file from S3 */}
      {downloadUrl && (
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2.5 right-3.5 inline-flex items-center gap-1 text-[11px] font-medium text-[#2E9E5B] hover:underline"
        >
          <span>Abrir original</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
};
