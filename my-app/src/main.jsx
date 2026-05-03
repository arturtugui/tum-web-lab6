import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { CollectionProvider } from './context/CollectionContext.jsx'
import { UIProvider } from './context/UIContext.jsx'
import './styles/App.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CollectionProvider>
      <UIProvider>
        <App />
      </UIProvider>
    </CollectionProvider>
  </StrictMode>,
)
