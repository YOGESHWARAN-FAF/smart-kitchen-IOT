import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught React Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '30px', fontFamily: 'monospace', background: '#FFF1F2', color: '#9F1239', border: '2px solid #F43F5E', margin: '20px', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>⚠️ AURA-GUARD Application Error Caught</h2>
          <p style={{ fontWeight: 'bold', marginBottom: '15px' }}>{this.state.error && this.state.error.toString()}</p>
          <pre style={{ background: '#FFFFFF', padding: '15px', borderRadius: '8px', overflowX: 'auto', border: '1px solid #FECDD3', fontSize: '11px' }}>
            {this.state.errorInfo ? this.state.errorInfo.componentStack : 'No stack trace available.'}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '15px', padding: '10px 20px', background: '#E11D48', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Reload Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
