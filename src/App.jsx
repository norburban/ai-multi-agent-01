import { useState, useEffect } from 'react'
import Header from './components/Header'
import AgentGrid from './components/AgentGrid'
import ChatInterface from './components/ChatInterface'
import { useAgentStore } from './stores/agentStore'

function App() {
  const [input, setInput] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)
  const sendMessage = useAgentStore(state => state.sendMessage)
  const clearChat = useAgentStore(state => state.clearConversation)
  const initializeAgents = useAgentStore(state => state.initializeAgents)
  const loadSavedConversation = useAgentStore(state => state.loadSavedConversation)
  const error = useAgentStore(state => state.error)
  const isProcessing = useAgentStore(state => state.isProcessing)

  useEffect(() => {
    if (!isInitialized) {
      initializeAgents()
      loadSavedConversation()
      setIsInitialized(true)
    }
  }, [isInitialized, initializeAgents, loadSavedConversation])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return
    
    try {
      await sendMessage(input)
      setInput('')
    } catch (err) {
      console.error('Error sending message:', err)
    }
  }

  if (!isInitialized) {
    return (
      <div className="app-container">
        <div className="loading">Initializing agents...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error-container">
          <h2>Configuration Error</h2>
          <p>{error}</p>
          <p>Please check your environment configuration and reload the page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <Header onClear={clearChat} />
      <div className="main-content">
        <div className="left-column">
          <AgentGrid />
          <ChatInterface
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  )
}

export default App
