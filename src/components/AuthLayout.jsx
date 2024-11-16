import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import AuthModal from './AuthModal'
// Touch to update features

export default function AuthLayout({ children }) {
  const { user, loading, initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return <AuthModal />
  }

  return <>{children}</>
}
