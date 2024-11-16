import { useState, useEffect } from 'react'
import ChatInterface from './components/ChatInterface'
import { useAgentStore } from './stores/agentStore'
import AuthLayout from './components/AuthLayout'
import { useAuthStore } from './stores/authStore'

// Touch to update features

function App() {
  const [input, setInput] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)
  const sendMessage = useAgentStore(state => state.sendMessage)
  const initializeAgents = useAgentStore(state => state.initializeAgents)
  const error = useAgentStore(state => state.error)
  const isProcessing = useAgentStore(state => state.isProcessing)
  const signOut = useAuthStore(state => state.signOut)

  useEffect(() => {
    if (!isInitialized) {
      initializeAgents()
      setIsInitialized(true)
    }
  }, [isInitialized, initializeAgents])

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

  const handleSignOut = async () => {
    await signOut()
  }

  if (!isInitialized) {
    return (
      <div className="loading-container">
        <div className="loading">Initializing agents...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Configuration Error</h2>
        <p>{error}</p>
        <p>Please check your environment configuration and reload the page.</p>
      </div>
    )
  }

  const content = (
    <div className="flex flex-col h-screen">
      <div className="flex justify-end p-4">
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700"
        >
          Sign Out
        </button>
      </div>
      <ChatInterface
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        isProcessing={isProcessing}
      />
    </div>
  )

  return <AuthLayout>{content}</AuthLayout>
}

export default App
