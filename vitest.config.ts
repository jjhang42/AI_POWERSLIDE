import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()] as any,
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'out'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.next/**',
        'out/**',
        'tests/',
        'components/ui/**',
        '**/*.config.{js,ts}',
        // Old architecture (현재 미사용)
        'lib/export/core/ExportContext.tsx',
        'lib/export/core/Exporter.ts',
        'lib/export/core/Renderer.ts',
        'lib/export/exporters/JpgExporter.ts',
        'lib/export/exporters/PdfExporter.ts',
        'lib/export/exporters/PptxExporter.ts',
        'lib/export/index.ts',
        // 단순 상수/유틸 (브라우저 전용, 테스트 불필요)
        'lib/design/**',
        'lib/ai-helpers.ts',
        // Next.js 앱 엔트리 (통합 테스트로 대체)
        'app/**',
        // 복잡한 UI 컴포넌트 (E2E/Playwright로 테스트 예정)
        'components/AutoSaveIndicator.tsx',
        'components/CommandPalette.tsx',
        'components/CompactNavigator.tsx',
        'components/EditModeToggle.tsx',
        'components/GridGuides.tsx',
        'components/HistoryPanel.tsx',
        'components/KeyboardIndicator.tsx',
        'components/KeyboardShortcutsHelp.tsx',
        'components/PresentMode.tsx',
        'components/SlideCanvas.tsx',
        'components/SlideCard.tsx',
        'components/SlideTransitions.tsx',
        'components/SlidesSidebar.tsx',
        'components/TemplatesSidebar.tsx',
        'components/ThemeProvider.tsx',
        'components/UndoRedoButtons.tsx',
        'components/UndoRedoToast.tsx',
        'components/UnifiedToolbar.tsx',
        'components/ZoomControls.tsx',
        // Editor 컴포넌트 (E2E로 테스트 예정)
        'components/editor/EditableText.tsx',
        'components/editor/EditableList.tsx',
        'components/editor/EditorPanel.tsx',
        'components/editor/StyleInspector.tsx',
        // Positioning 시스템 (CLAUDE.md: AI 수정 불가 영역, E2E로 테스트)
        'components/positioning/**',
        // Export types (인터페이스만, 실행 코드 없음)
        'lib/export/types.ts',
      ],
      thresholds: {
        statements: 40,
        branches: 35,
        functions: 40,
        lines: 40,
      },
    },
    mockReset: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
