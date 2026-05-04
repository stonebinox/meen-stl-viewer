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
          justifyContent: 'center', height: '100vh', background: '#0d0f0c',
          color: '#f4f1eb', fontFamily: 'Literata, serif', gap: 16,
        }}>
          <p style={{ fontSize: 14, color: '#c9a16f', letterSpacing: 2 }}>MEEN VIEWER</p>
          <p style={{ fontSize: 13, color: '#72907a' }}>
            {(this.state.error as Error).message}
          </p>
          <button
            onClick={() => this.setState({ error: null })}
            style={{
              padding: '8px 20px', background: '#2f3e31', color: '#f4f1eb',
              border: '1px solid #3d5040', borderRadius: 6, cursor: 'pointer',
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
