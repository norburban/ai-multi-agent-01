import { RotateCcw } from 'lucide-react'

function Header({ onClear }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1>AI Multi-Agent System</h1>
        <button className="clear-button" onClick={onClear}>
          <RotateCcw size={18} />
          Clear Chat
        </button>
      </div>
    </header>
  )
}

export default Header
