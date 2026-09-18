import React, { StrictMode, Component, ReactNode, ErrorInfo } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ProcureX React Boundary Caught Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: '#0F1216',
          color: '#F4F2EC'
        }}>
          <div style={{
            maxWidth: '540px',
            width: '100%',
            background: '#1A2027',
            border: '1px solid #2E3844',
            borderRadius: '12px',
            padding: '28px'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#EF4444', marginBottom: '8px' }}>
              ProcureX Initialization Notice
            </h2>
            <p style={{ fontSize: '14px', color: '#949DA3', marginBottom: '16px', lineHeight: '1.5' }}>
              The application encountered a render exception in this preview environment:
            </p>
            <pre style={{
              background: '#0F1216',
              padding: '12px',
              borderRadius: '6px',
              fontSize: '12px',
              overflowX: 'auto',
              color: '#F87171',
              border: '1px solid #2E3844',
              marginBottom: '20px'
            }}>
              {this.state.error?.message || 'Unknown render error'}
            </pre>
            <button
              onClick={() => {
                try {
                  localStorage.clear();
                  sessionStorage.clear();
                } catch {
                  // ignore
                }
                window.location.reload();
              }}
              style={{
                background: '#087C78',
                color: '#ffffff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Reset Session & Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
