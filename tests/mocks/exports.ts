import { vi } from 'vitest';

// html2canvas mock
export const mockHtml2Canvas = vi.fn().mockImplementation(() => {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  return Promise.resolve(canvas);
});
vi.mock('html2canvas', () => ({ default: mockHtml2Canvas }));

// jsPDF mock
export class MockJsPDF {
  internal = { pageSize: { getWidth: () => 297, getHeight: () => 210 } };
  addPage = vi.fn();
  addImage = vi.fn();
  output = vi.fn((type: string) =>
    type === 'blob' ? new Blob(['pdf'], { type: 'application/pdf' }) : 'pdf'
  );
}
vi.mock('jspdf', () => ({ default: MockJsPDF }));

// jszip mock
export const mockJSZip = {
  file: vi.fn(),
  generateAsync: vi.fn().mockResolvedValue(new Blob(['zip'])),
};
vi.mock('jszip', () => ({ default: vi.fn(() => mockJSZip) }));

// file-saver mock
export const mockSaveAs = vi.fn();
vi.mock('file-saver', () => ({ saveAs: mockSaveAs }));
