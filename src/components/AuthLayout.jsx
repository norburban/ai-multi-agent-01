import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import AuthModal from './AuthModal'
// Touch to update features

export default function AuthLayout({ children }) {
  const { user, loading, initialize } = useAuthStore()

  useEffect(() => {
    console.log('AuthLayout: Initializing auth');
    initialize()
  }, [initialize])

  useEffect(() => {
    console.log('AuthLayout state:', { user, loading });
  }, [user, loading]);

  if (loading) {
    console.log('AuthLayout: Loading...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    console.log('AuthLayout: No user, showing auth modal');
    return <AuthModal />
  }

  console.log('AuthLayout: Rendering children');
  return children
}
