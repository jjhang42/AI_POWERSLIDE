"use client";

/**
 * SectionErrorBoundary
 * 각 섹션의 에러를 격리하여 전체 앱이 크래시되지 않도록 보호
 */

import React from "react";

interface Props {
  children: React.ReactNode;
  sectionId: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SectionErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[SectionErrorBoundary] Error in section ${this.props.sectionId}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="relative min-h-screen flex items-center justify-center bg-red-50/50">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-white border-2 border-red-300 rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-red-700 mb-4">
                섹션 렌더링 오류
              </h2>
              <p className="text-gray-700 mb-4">
                <strong>섹션 ID:</strong> {this.props.sectionId}
              </p>
              {this.state.error && (
                <div className="bg-red-100 border border-red-300 rounded p-4 overflow-auto">
                  <p className="text-sm font-mono text-red-800 whitespace-pre-wrap">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                다시 시도
              </button>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
