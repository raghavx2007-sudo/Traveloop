import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  // Set axios default authorization header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      loadUser()
    } else {
      setLoading(false)
    }
  }, [token])

  // Load user data
  const loadUser = async () => {
    try {
      const response = await axios.get('/api/auth/me')
      setUser(response.data.data)
    } catch (error) {
      console.error('Load user error:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  // Register user
  const register = async (name, email, password) => {
    try {
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password
      })
      
      const { token: newToken, user: userData } = response.data.data
      
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(userData)
      
      toast.success('Registration successful!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  // Login user
  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      })
      
      const { token: newToken, user: userData } = response.data.data
      
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(userData)
      
      toast.success('Login successful!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  // Logout user
  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
  }

  const value = {
    user,
    setUser,
    loading,
    register,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
