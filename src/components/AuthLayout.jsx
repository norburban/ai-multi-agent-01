import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import AuthModal from './AuthModal'
import Logger from '../utils/logger'
// Touch to update features

export default function AuthLayout({ children }) {
  const { user, loading, initialize } = useAuthStore()

  useEffect(() => {
    Logger.info('AuthLayout: Initializing auth');
    initialize()
  }, [initialize])

  useEffect(() => {
    Logger.info('AuthLayout state:', { user, loading });
  }, [user, loading]);

  if (loading) {
    Logger.info('AuthLayout: Loading...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    Logger.info('AuthLayout: No user, showing auth modal');
    return <AuthModal />
  }

  Logger.info('AuthLayout: Rendering children');
  return children
}
