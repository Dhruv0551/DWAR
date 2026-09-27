import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { Loading } from './components/ui'
import Workspace from './components/layout/Workspace'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { OnboardingGuard } from './components/layout/OnboardingGuard'

const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Onboarding = lazy(() => import('./pages/Onboarding'))

export default function App() {
  const { initialize, isInitialized, user } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  if (!isInitialized) {
    return <Loading />
  }

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/app/dashboard" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/app/dashboard" replace /> : <Register />} 
        />
        <Route 
          path="/onboarding" 
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/app/*" 
          element={
            <ProtectedRoute>
              <OnboardingGuard>
                <Workspace />
              </OnboardingGuard>
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
