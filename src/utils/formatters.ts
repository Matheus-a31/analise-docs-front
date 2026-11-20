export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) {
    return '0 KB';
  }

  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${Math.max(1, Math.round(kb))} KB`;
  }

  const mb = kb / 1024;
  return `${mb.toFixed(1).replace('.0', '')} MB`;
}

export function formatDatePtBr(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) {
      return isoDate;
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return isoDate;
  }
}

export function normalizeExtension(filenameOrExt: string): string {
  if (!filenameOrExt) {
    return '.doc';
  }
  if (filenameOrExt.startsWith('.')) {
    return filenameOrExt.toLowerCase();
  }
  const parts = filenameOrExt.split('.');
  if (parts.length > 1) {
    return `.${parts[parts.length - 1].toLowerCase()}`;
  }
  return `.${filenameOrExt.toLowerCase()}`;
}

export function getExtensionBadgeLabel(extensionOrFilename: string): string {
  const ext = normalizeExtension(extensionOrFilename).replace('.', '').toUpperCase();
  if (ext === 'DOCX' || ext === 'DOC') return 'DOC';
  if (ext === 'JPEG' || ext === 'JPG') return 'JPG';
  return ext.slice(0, 4) || 'DOC';
}
