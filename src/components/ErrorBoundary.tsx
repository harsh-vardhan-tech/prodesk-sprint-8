import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected runtime issue occurred.',
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Cine-Stream caught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-8 max-w-md w-full text-center rounded-xl shadow-2xl">
            <div className="w-12 h-12 bg-red-950/60 text-[#e50914] border border-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Application Notice
            </h2>
            <p className="text-sm text-zinc-400 mt-2 mb-6 leading-relaxed">
              Cine-Stream encountered a temporary rendering issue. Please reload to restore state.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center px-5 py-2.5 rounded bg-[#e50914] text-white text-sm font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-950/40"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              <span>Reload Explorer</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
