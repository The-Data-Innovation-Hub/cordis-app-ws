'use client';

import { Component } from 'react';
import type { ErrorInfo, ReactNode, ComponentType } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

export class DevErrorBoundary extends Component<Props> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && process.env.NODE_ENV !== 'production') {
      return (
        <div className="p-4 max-w-4xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Something went wrong</h3>
                <div className="mt-2 text-sm text-red-700">
                  <pre className="mt-2 p-2 bg-white rounded overflow-auto text-xs">
                    {this.state.error?.toString()}
                  </pre>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => this.setState({ hasError: false })}
                    className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Helper component to wrap your app with the error boundary
export function withErrorBoundary<T extends Record<string, any>>(Component: ComponentType<T>) {
  return function WrappedComponent(props: T) {
    return (
      <DevErrorBoundary>
        <Component {...props} />
      </DevErrorBoundary>
    );
  };
}
