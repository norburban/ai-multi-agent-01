import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--nestle-offwhite)]">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full border border-[var(--nestle-light-brown)]">
            <h2 className="text-2xl font-bold text-[var(--nestle-red)] mb-4">Something went wrong</h2>
            <p className="text-[var(--nestle-dark-brown)] mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            {this.state.error?.message?.includes('Missing Supabase') && (
              <p className="text-sm text-[var(--nestle-medium-brown)]">
                This error typically occurs when environment variables are missing.
                Please ensure all required environment variables are set in your Vercel project settings.
              </p>
            )}
            <button
              onClick={() => window.location.reload()}
              className="bg-[var(--nestle-brown)] text-[var(--nestle-offwhite)] px-4 py-2 rounded hover:bg-[var(--nestle-dark-brown)] transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
