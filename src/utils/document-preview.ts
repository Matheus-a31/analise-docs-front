import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

export interface RenderedPreviewResult {
  kind: 'image' | 'text' | 'fallback';
  imageUrl?: string;
  textSnippet?: string;
}

export async function renderPdfFirstPageToDataUrl(
  arrayBuffer: ArrayBuffer,
): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdfDocument = await loadingTask.promise;

  try {
    const page = await pdfDocument.getPage(1);
    const desiredHeight = 320;
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = Math.min(2, Math.max(0.5, desiredHeight / baseViewport.height));
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas 2D indisponível neste navegador.');
    }

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    await page.render({
      canvasContext: context,
      viewport,
      canvas,
    }).promise;

    return canvas.toDataURL('image/png');
  } finally {
    await loadingTask.destroy();
  }
}

export async function extractDocxSnippet(arrayBuffer: ArrayBuffer): Promise<string> {
  const mammoth = await import('mammoth');
  const result = await mammoth.extractRawText({ arrayBuffer });
  return normalizeSnippet(result.value || '');
}

export function extractPlainTextSnippet(arrayBuffer: ArrayBuffer): string {
  const decoded = new TextDecoder('utf-8', { fatal: false }).decode(arrayBuffer);
  return normalizeSnippet(decoded);
}

function normalizeSnippet(raw: string): string {
  return raw
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, 700);
}
