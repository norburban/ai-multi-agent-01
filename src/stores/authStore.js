import { create } from 'zustand'
import { supabase } from '../lib/supabase'
// Touch to update features

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,
  signIn: async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      set({ user: data.user, session: data.session })
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },
  signUp: async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            email_confirm: true
          }
        }
      })
      if (error) throw error
      
      // If email confirmation is required
      if (data?.user?.identities?.length === 0) {
        return { 
          data, 
          error: null,
          message: 'Please check your email for the confirmation link.'
        }
      }
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      set({ user: null, session: null })
      return { error: null }
    } catch (error) {
      return { error }
    }
  },
  initialize: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      set({ 
        user: session?.user ?? null, 
        session,
        loading: false 
      })
    } catch (error) {
      set({ loading: false })
      console.error('Error initializing auth:', error)
    }
  }
}))
