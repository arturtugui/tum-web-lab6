import { createContext, useContext, useState, useCallback } from 'react'
import { useError } from './ErrorContext'
import * as tokenService from '../services/tokenService'
import * as api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { setError: setGlobalError, clearError } = useError()
  const [token, setToken] = useState(null)

  // Get token for a specific role, refreshing if expired
  const getToken = useCallback(async (role) => {
    try {
      clearError()
      
      // Check if we have a stored token that's still valid
      const storedToken = tokenService.getToken()
      if (storedToken && !tokenService.isTokenExpired(storedToken)) {
        setToken(storedToken)
        return storedToken
      }

      // Token missing or expired, fetch a new one
      const response = await api.getTokenForRole(role)
      const newToken = response?.token

      if (!newToken) {
        throw new Error('Failed to get token from server')
      }

      tokenService.setToken(newToken)
      setToken(newToken)
      return newToken
    } catch (err) {
      const errorMsg = err.message || 'Failed to authenticate'
      setGlobalError(errorMsg)
      throw err
    }
  }, [setGlobalError, clearError])

  // Clear token and logout
  const clearToken = useCallback(() => {
    tokenService.clearToken()
    setToken(null)
    clearError()
  }, [clearError])

  // Get current stored token without refresh
  const getCurrentToken = useCallback(() => {
    const storedToken = tokenService.getToken()
    if (storedToken && !tokenService.isTokenExpired(storedToken)) {
      return storedToken
    }
    return null
  }, [])

  return (
    <AuthContext.Provider
      value={{
        token,
        getToken,
        getCurrentToken,
        clearToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
