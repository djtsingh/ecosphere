"use client";

import { Component, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class TerminalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] items-center justify-center rounded-[28px] border border-border bg-surface p-8">
          <div className="space-y-4 text-center">
            <p className="font-mono text-lg text-red-400">Terminal crashed</p>
            <p className="text-sm text-muted">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              className="rounded-2xl border border-border bg-accent px-5 py-2 text-sm font-semibold text-background transition hover:opacity-90"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              type="button"
            >
              Reload Terminal
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
