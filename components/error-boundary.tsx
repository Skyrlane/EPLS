'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 ErrorBoundary caught an error:');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Component stack:', errorInfo.componentStack);

    // Log toutes les propriétés de l'erreur
    console.error('Error keys:', Object.keys(error));
    console.error('Error toString:', error.toString());

    this.setState({
      error,
      errorInfo,
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-red-50">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              🚨 Erreur capturée par ErrorBoundary
            </h1>

            <div className="space-y-4">
              <div>
                <h2 className="font-semibold text-lg mb-2">Message d'erreur:</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                  {this.state.error?.toString()}
                </pre>
              </div>

              <div>
                <h2 className="font-semibold text-lg mb-2">Stack trace:</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
                  {this.state.error?.stack}
                </pre>
              </div>

              {this.state.errorInfo && (
                <div>
                  <h2 className="font-semibold text-lg mb-2">Component stack:</h2>
                  <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              )}

              <div className="pt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                  Recharger la page
                </button>
              </div>

              <div className="text-sm text-gray-600 mt-4">
                <p>✅ Cette erreur a été loggée dans la console (F12)</p>
                <p>📋 Copie les logs de la console et envoie-les moi</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
