import { createContext, useContext, useState, useCallback } from 'react'

const ErrorContext = createContext(null)

export function ErrorProvider({ children }) {
  const [error, setError] = useState(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
    </ErrorContext.Provider>
  )
}

export function useError() {
  return useContext(ErrorContext)
}
