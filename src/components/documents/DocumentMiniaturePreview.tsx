import React from 'react';
import { ExternalLink } from 'lucide-react';
import { formatFileSize, normalizeExtension } from '../../utils/formatters';

interface DocumentMiniaturePreviewProps {
  sizeBytes: number;
  extensionOrName: string;
  imagePreviewUrl?: string | null;
  downloadUrl?: string | null;
}

export const DocumentMiniaturePreview: React.FC<DocumentMiniaturePreviewProps> = ({
  sizeBytes,
  extensionOrName,
  imagePreviewUrl,
  downloadUrl,
}) => {
  const ext = normalizeExtension(extensionOrName);

  return (
    <div className="mt-4 bg-[#F9FAFB] rounded-xl p-4 h-[148px] flex flex-col items-center justify-center relative border border-gray-100/80">
      {imagePreviewUrl ? (
        <img
          src={imagePreviewUrl}
          alt="Prévia do arquivo"
          className="h-[104px] max-w-[160px] object-contain rounded shadow-sm border border-gray-200 bg-white"
        />
      ) : (
        /* Realistic miniature document page matching .insp/115345.jpeg & 11549.jpeg */
        <div
          className="w-[74px] h-[98px] bg-white border border-gray-200 rounded-[3px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-2 flex flex-col justify-between select-none"
          aria-hidden="true"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-3.5 h-1.5 bg-[#1D9BF0]/70 rounded-sm" />
              <div className="w-7 h-1 bg-red-400/70 rounded-sm" />
            </div>
            <div className="w-full h-[2px] bg-gray-200 mb-1.5" />
            <div className="w-8 h-2 bg-gray-700 rounded-[1px] mb-2" />
            <div className="space-y-1">
              <div className="w-full h-1 bg-gray-300 rounded-sm" />
              <div className="w-5/6 h-1 bg-gray-200 rounded-sm" />
              <div className="w-full h-1 bg-gray-200 rounded-sm" />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-1 flex items-center justify-between">
            <div className="w-4 h-1.5 bg-gray-400 rounded-sm" />
            <div className="w-6 h-1.5 bg-gray-300 rounded-sm" />
          </div>
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
