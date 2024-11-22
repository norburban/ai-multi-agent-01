import { useState, useEffect, useCallback, useRef } from 'react'
import ChatInterface from './components/ChatInterface'
import { useAgentStore } from './stores/agentStore'
import AuthLayout from './components/AuthLayout'
import AuthModal from './components/AuthModal'
import { useAuthStore } from './stores/authStore'
import ErrorBoundary from './components/ErrorBoundary'
import Logger from './utils/logger'
import HomePage from './components/HomePage'

function App() {
  const [input, setInput] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)
  const sendMessage = useAgentStore(state => state.sendMessage)
  const initializeAgents = useAgentStore(state => state.initializeAgents)
  const error = useAgentStore(state => state.error)
  const isProcessing = useAgentStore(state => state.isProcessing)
  const signOut = useAuthStore(state => state.signOut)
  const user = useAuthStore(state => state.user)
  const loading = useAuthStore(state => state.loading)
  const initialize = useAuthStore(state => state.initialize)
  const authModalRef = useRef()

  // Initialize auth on app load
  useEffect(() => {
    initialize()
  }, [initialize])

  // Handle initialization
  useEffect(() => {
    const initAgents = async () => {
      if (!isInitialized && user) {
        try {
          Logger.info('Initializing agents...');
          await initializeAgents();
          setIsInitialized(true);
          Logger.info('Agents initialized successfully');
        } catch (error) {
          Logger.error('Failed to initialize agents:', error);
        }
      }
    };

    initAgents();
  }, [user, isInitialized, initializeAgents]);

  // Reset initialization state on logout
  useEffect(() => {
    if (!user) {
      setIsInitialized(false);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return
    
    try {
      await sendMessage(input)
      setInput('')
    } catch (error) {
      Logger.error('Error sending message:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      Logger.error('Error signing out:', error)
    }
  }

  const handleShowAuth = useCallback(() => {
    if (authModalRef.current?.showModal) {
      authModalRef.current.showModal();
    }
  }, []);

  // Show homepage for non-authenticated users
  if (!user) {
    return (
      <ErrorBoundary>
        <HomePage onShowAuth={handleShowAuth} />
        <AuthModal ref={authModalRef} />
      </ErrorBoundary>
    )
  }

  // Show loading state while initializing agents
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-lg">Initializing agents...</div>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <AuthLayout>
        <div className="flex flex-col h-screen bg-gray-100">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          <ChatInterface
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
            isProcessing={isProcessing}
          />
        </div>
      </AuthLayout>
      <AuthModal ref={authModalRef} />
    </ErrorBoundary>
  )
}

function AppWrapper() {
  return (
    <App />
  )
}

export default AppWrapper
