import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px 32px', fontFamily: 'monospace' }}>
          <h2 style={{ color: '#c0392b', marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ color: '#555', marginBottom: 16 }}>{this.state.error?.message}</p>
          <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: 6, fontSize: 12, overflowX: 'auto', color: '#333' }}>
            {this.state.error?.stack}
          </pre>
          <button
            style={{ marginTop: 16, padding: '8px 16px', cursor: 'pointer' }}
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
