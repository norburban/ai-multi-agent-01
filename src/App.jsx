import { useState, useEffect, useCallback, useRef } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ChatInterface from './components/ChatInterface'
import { useAgentStore } from './stores/agentStore'
import AuthLayout from './components/AuthLayout'
import AuthModal from './components/AuthModal'
import { useAuthStore } from './stores/authStore'
import ErrorBoundary from './components/ErrorBoundary'
import Logger from './utils/logger'
import HomePage from './components/HomePage'
import Dashboard from './components/Dashboard'
import ProfileSettings from './components/ProfileSettings'

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const user = useAuthStore(state => state.user)
  if (!user) {
    return <Navigate to="/" replace />
  }
  return children
}

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

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <HomePage onShowAuth={handleShowAuth} />
              )
            } 
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
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
              </ProtectedRoute>
            }
          />
        </Routes>
        <AuthModal ref={authModalRef} />
      </BrowserRouter>
    </ErrorBoundary>
  )
}

function AppWrapper() {
  return (
    <App />
  )
}

export default AppWrapper
