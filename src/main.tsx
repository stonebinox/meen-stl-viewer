import { StrictMode, Component, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '100vh', background: '#0A0A0A',
          color: '#F5F5F7', fontFamily: 'Inter, sans-serif', gap: 16,
        }}>
          <p style={{ fontSize: 14, color: '#C9A227', letterSpacing: 2 }}>MEEN VIEWER</p>
          <p style={{ fontSize: 13, color: '#8E8E93' }}>
            {(this.state.error as Error).message}
          </p>
          <button
            onClick={() => this.setState({ error: null })}
            style={{
              padding: '8px 20px', background: '#141414', color: '#F5F5F7',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, cursor: 'pointer',
              fontSize: 12, letterSpacing: 1,
            }}
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find root element')

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
