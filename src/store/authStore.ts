import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { UserProfile } from '../lib/types'
import type { Session, User } from '@supabase/supabase-js'
import api from '../lib/api'

interface AuthState {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  isLoading: boolean
  isInitialized: boolean

  initialize: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>
  signInWithGoogle: () => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  fetchProfile: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isInitialized: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        set({ user: session.user, session })
        await get().fetchProfile()
      }
    } catch (err) {
      console.error('[Auth] Initialization error:', err)
    } finally {
      set({ isLoading: false, isInitialized: true })
    }

    // Listen for auth state changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      set({ user: session?.user ?? null, session })
      if (event === 'SIGNED_IN' && session) {
        await get().fetchProfile()
      }
      if (event === 'SIGNED_OUT') {
        set({ profile: null })
      }
    })
  },

  signInWithEmail: async (email, password) => {
    set({ isLoading: true })
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { error: error.message }
      return { error: null }
    } catch {
      return { error: 'An unexpected error occurred. Please try again.' }
    } finally {
      set({ isLoading: false })
    }
  },

  signUpWithEmail: async (email, password, fullName) => {
    set({ isLoading: true })
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      })
      if (error) return { error: error.message }
      return { error: null }
    } catch {
      return { error: 'An unexpected error occurred. Please try again.' }
    } finally {
      set({ isLoading: false })
    }
  },

  signInWithGoogle: async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app/dashboard`,
        },
      })
      if (error) return { error: error.message }
      return { error: null }
    } catch {
      return { error: 'Google sign-in failed. Please try again.' }
    }
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, session: null, profile: null })
  },

  fetchProfile: async () => {
    // Only fetch if we have a valid session — avoids 401 spam
    const session = get().session
    if (!session?.access_token) {
      const user = get().user
      if (user) {
        set({
          profile: {
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || '',
            role: 'entrepreneur',
            is_onboarded: false,
          },
        })
      }
      return
    }

    try {
      const { data } = await api.get<UserProfile>('/auth/profile/')
      if (data) {
        set({ profile: data })
      }
    } catch {
      // Profile may not exist yet (pre-onboarding)
      const user = get().user
      if (user) {
        set({
          profile: {
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || '',
            role: 'entrepreneur',
            is_onboarded: false,
          },
        })
      }
    }
  },

  updateProfile: (data) => {
    const current = get().profile
    if (current) {
      set({ profile: { ...current, ...data } })
    }
  },
}))
