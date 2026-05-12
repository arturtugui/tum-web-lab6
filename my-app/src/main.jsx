import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CollectionProvider } from './context/CollectionContext.jsx'
import { ErrorProvider } from './context/ErrorContext.jsx'
import { UIProvider } from './context/UIContext.jsx'
import { FilterProvider } from './context/FilterContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { RoleProvider } from './context/RoleContext.jsx'
import './styles/App.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RoleProvider>
      <ErrorProvider>
        <AuthProvider>
          <ThemeProvider>
            <CollectionProvider>
              <UIProvider>
                <FilterProvider>
                  <App />
                </FilterProvider>
              </UIProvider>
            </CollectionProvider>
          </ThemeProvider>
        </AuthProvider>
      </ErrorProvider>
    </RoleProvider>
  </StrictMode>,
)
