import { useState, useEffect } from 'react'
import ChatInterface from './components/ChatInterface'
import { useAgentStore } from './stores/agentStore'
import AuthLayout from './components/AuthLayout'
import AuthModal from './components/AuthModal'
import { useAuthStore } from './stores/authStore'
import ErrorBoundary from './components/ErrorBoundary'

// Touch to update features

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

  // Handle initialization
  useEffect(() => {
    const initialize = async () => {
      if (!isInitialized && user) {
        try {
          console.log('Initializing agents...');
          await initializeAgents();
          setIsInitialized(true);
          console.log('Agents initialized successfully');
        } catch (error) {
          console.error('Failed to initialize agents:', error);
        }
      }
    };

    initialize();
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
    } catch (err) {
      console.error('Error sending message:', err)
    }
  }

  const handleSignOut = async (e) => {
    if (e) e.preventDefault();
    console.log('Sign out clicked');
    
    if (!user) {
      console.log('No user found to sign out');
      return;
    }

    try {
      console.log('Attempting to sign out...');
      const { error } = await signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        return;
      }
      
      console.log('Successfully signed out');
      window.location.href = '/';
    } catch (err) {
      console.error('Exception during sign out:', err);
    }
  }

  // Debug logging for render conditions
  console.log('Render state:', { user, isInitialized, error, loading });

  if (loading) {
    console.log('Auth is loading...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No user, showing auth modal');
    return <AuthModal />;
  }

  if (!isInitialized) {
    console.log('Still initializing agents...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <div className="text-gray-600">Initializing agents...</div>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('Encountered error:', error);
    return (
      <div className="error-container">
        <h2>Configuration Error</h2>
        <p>{error}</p>
        <p>Please check your environment configuration and reload the page.</p>
      </div>
    );
  }

  console.log('Rendering main content');
  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-end p-4">
        <button
          type="button"
          onClick={handleSignOut}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 active:bg-gray-800 active:transform active:scale-95 transition-all duration-150 cursor-pointer z-50"
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
  );
}

function AppWrapper() {
  return (
    <ErrorBoundary>
      <AuthLayout>
        <App />
      </AuthLayout>
    </ErrorBoundary>
  )
}

export default AppWrapper
