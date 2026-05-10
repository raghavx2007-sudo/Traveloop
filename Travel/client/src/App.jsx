import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from './context/AuthContext'
import { useTheme } from './context/ThemeContext'
import CinematicCursor from './components/CinematicCursor'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MyTrips from './pages/MyTrips'
import TripDetail from './pages/TripDetail'
import Profile from './pages/Profile'
import PublicTrip from './pages/PublicTrip'
import Explore from './pages/Explore'
import Settings from './pages/Settings'
import Analytics from './pages/Analytics'
import Community from './pages/Community'
import Billing from './pages/Billing'
import MainLayout from './layouts/MainLayout'
import LoadingScreen from './components/LoadingScreen'

const Spinner = () => (
  <LoadingScreen message="Loading your adventure…" />
)

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  return user ? children : <Navigate to="/login" />
}

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  return user ? <Navigate to="/dashboard" /> : children
}

export default function App() {
  const { isDark } = useTheme()

  return (
    <Router>
      {/* Cinematic custom cursor */}
      <CinematicCursor />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: isDark ? '#0d1526' : '#ffffff',
            color: isDark ? '#e0f2fe' : '#0c4a6e',
            border: `1.5px solid ${isDark ? 'rgba(56,189,248,0.2)' : 'rgba(186,230,253,0.8)'}`,
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: '600',
            fontFamily: 'Nunito, sans-serif',
            boxShadow: isDark
              ? '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(56,189,248,0.05)'
              : '0 8px 32px rgba(14,165,233,0.15)',
            backdropFilter: 'blur(12px)',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      <Routes>
        <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard"  element={<Dashboard />} />
          <Route path="my-trips"   element={<MyTrips />} />
          <Route path="trips/:id"  element={<TripDetail />} />
          <Route path="explore"    element={<Explore />} />
          <Route path="analytics"  element={<Analytics />} />
          <Route path="community"  element={<Community />} />
          <Route path="profile"    element={<Profile />} />
          <Route path="settings"   element={<Settings />} />
          <Route path="billing"    element={<Billing />} />
        </Route>

        <Route path="/public/trips/:id" element={<PublicTrip />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}
