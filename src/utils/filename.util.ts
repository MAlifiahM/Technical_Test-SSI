export function generateFilename(baseName: string, extension: string): string {
  const now = new Date();
  const formattedDate = now.toISOString().replace(/:/g, '-').split('T')[0];
  return `${baseName}_${formattedDate}${extension}`;
}
