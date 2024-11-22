import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useAuthStore } from '../stores/authStore'

const AuthModal = forwardRef((props, ref) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const { signIn, signUp } = useAuthStore()
  const dialogRef = useRef(null)

  useImperativeHandle(ref, () => ({
    showModal: () => {
      if (dialogRef.current) {
        dialogRef.current.showModal();
      }
    },
    close: () => {
      if (dialogRef.current) {
        dialogRef.current.close();
      }
    }
  }));

  useEffect(() => {
    // Polyfill for dialog element
    if (dialogRef.current && !dialogRef.current.showModal) {
      dialogRef.current.showModal = () => {
        dialogRef.current.setAttribute('open', '');
      };
      dialogRef.current.close = () => {
        dialogRef.current.removeAttribute('open');
      };
    }
  }, []);

  const closeModal = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    const result = isSignUp 
      ? await signUp({ email, password })
      : await signIn({ email, password })

    if (result.error) {
      setError(result.error.message)
    } else {
      setMessage('Success!')
      closeModal()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="bg-[var(--nestle-offwhite)] rounded-lg shadow-xl p-6 w-full max-w-md backdrop:bg-black/50"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[var(--nestle-dark-brown)]">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h2>
        <button
          onClick={closeModal}
          className="text-[var(--nestle-medium-brown)] hover:text-[var(--nestle-dark-brown)]"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[var(--nestle-brown)]">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-[var(--nestle-light-brown)] bg-white shadow-sm focus:border-[var(--nestle-tan)] focus:ring-[var(--nestle-tan)]"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[var(--nestle-brown)]">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-[var(--nestle-light-brown)] bg-white shadow-sm focus:border-[var(--nestle-tan)] focus:ring-[var(--nestle-tan)]"
          />
        </div>

        {error && (
          <div className="text-[var(--nestle-red)] text-sm">{error}</div>
        )}

        {message && (
          <div className="text-[var(--nestle-chestnut)] text-sm">{message}</div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[var(--nestle-brown)] to-[var(--nestle-chestnut)] text-[var(--nestle-offwhite)] py-2 px-4 rounded-md hover:opacity-90 transition-opacity duration-200"
        >
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>

        <div className="text-center text-sm">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[var(--nestle-chestnut)] hover:text-[var(--nestle-liver)]"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </form>
    </dialog>
  )
})

export default AuthModal
