import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

// Get initial theme from localStorage or system preference
function getInitialTheme() {
  try {
    const saved = localStorage.getItem('pit-theme')
    if (saved === 'light' || saved === 'dark') {
      return saved
    }
  } catch (error) {
    console.error('Failed to load theme from localStorage:', error)
  }
  // Default to light theme
  return 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  // Update document attribute and localStorage whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('pit-theme', theme)
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
