import axios from 'axios'
import { supabase } from './supabase'

const getBaseUrl = () => {
  // 1. Explicit Vite env variable
  if (import.meta.env.VITE_API_URL) {
    const raw = import.meta.env.VITE_API_URL.replace(/\/+$/, '')
    return raw.endsWith('/api') ? raw : `${raw}/api`
  }
  // 2. Auto-detect Render deployment to avoid broken /api relative routes on static hosting
  if (typeof window !== 'undefined' && window.location.hostname.includes('dwar-frontend.onrender.com')) {
    return 'https://dwar-f1g7.onrender.com/api'
  }
  // 3. Local dev fallback (Vite proxy)
  return '/api'
}

const api = axios.create({
  baseURL: getBaseUrl(),
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

// Handle 401 responses — do not hard redirect, ProtectedRoute handles route guards
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  }
)

export default api
