import axios from 'axios'
import { supabase } from './supabase'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Inject Supabase JWT token into every request
api.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    }
  } catch {
    // Continue without auth header if session retrieval fails
  }
  return config
})

// Handle 401 responses — but do NOT redirect or retry automatically.
// The auth store and individual components handle auth state themselves.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Just reject — no automatic redirect.
    // The ProtectedRoute component handles routing to /login.
    return Promise.reject(error)
  }
)

export default api
