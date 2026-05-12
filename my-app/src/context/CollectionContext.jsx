import { createContext, useContext, useReducer, useEffect } from 'react'
import { reducer } from '../reducers/collectionReducer'
import { useRole } from './RoleContext'
import { useAuth } from './AuthContext'
import { useError } from './ErrorContext'
import * as api from '../services/api'

const CollectionContext = createContext(null)

export function CollectionProvider({ children }) {
  const { role } = useRole()
  const { getToken, getCurrentToken } = useAuth()
  const { setError: setGlobalError, clearError } = useError()
  const [state, dispatch] = useReducer(reducer, { items: [] })

  // Initialize and load items on mount or role change
  useEffect(() => {
    const initializeApp = async () => {
      try {
        clearError()

        // Get token for current role
        const token = await getToken(role)

        // Fetch items from API
        const response = await api.fetchItems(token)
        dispatch({ type: 'SET_ITEMS', payload: response.items || [] })
      } catch (err) {
        const errorMsg = err.message || 'Failed to load items'
        console.error('Initialization error:', err)
        setGlobalError(errorMsg)
        dispatch({ type: 'SET_ITEMS', payload: [] })
      }
    }

    initializeApp()
  }, [role, getToken, clearError, setGlobalError])

  // Wrapper functions for API mutations
  const addItem = async (item) => {
    try {
      clearError()
      const token = getCurrentToken()
      if (!token) throw new Error('No valid token available')
      
      const response = await api.createItem(token, item)
      dispatch({ type: 'ADD_ITEM', payload: response.item || response })
      return response.item || response
    } catch (err) {
      const errorMsg = err.message || 'Failed to add item'
      setGlobalError(errorMsg)
      throw err
    }
  }

  const editItem = async (id, updates) => {
    try {
      clearError()
      const token = getCurrentToken()
      if (!token) throw new Error('No valid token available')
      
      const response = await api.updateItem(token, id, updates)
      dispatch({ type: 'EDIT_ITEM', payload: response.item || { id, ...updates } })
      return response.item
    } catch (err) {
      const errorMsg = err.message || 'Failed to edit item'
      setGlobalError(errorMsg)
      throw err
    }
  }

  const deleteItem = async (id) => {
    try {
      clearError()
      const token = getCurrentToken()
      if (!token) throw new Error('No valid token available')
      
      await api.deleteItem(token, id)
      dispatch({ type: 'DELETE_ITEM', payload: id })
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete item'
      setGlobalError(errorMsg)
      throw err
    }
  }

  const hideItem = async (id) => {
    try {
      clearError()
      const token = getCurrentToken()
      if (!token) throw new Error('No valid token available')
      
      await api.hideItem(token, id)
      dispatch({ type: 'HIDE_ITEM', payload: id })
    } catch (err) {
      const errorMsg = err.message || 'Failed to hide item'
      setGlobalError(errorMsg)
      throw err
    }
  }

  const unhideItem = async (id) => {
    try {
      clearError()
      const token = getCurrentToken()
      if (!token) throw new Error('No valid token available')
      
      await api.unhideItem(token, id)
      dispatch({ type: 'UNHIDE_ITEM', payload: id })
    } catch (err) {
      const errorMsg = err.message || 'Failed to unhide item'
      setGlobalError(errorMsg)
      throw err
    }
  }

  return (
    <CollectionContext.Provider 
      value={{ 
        state, 
        dispatch,
        // API wrapper functions
        addItem,
        editItem,
        deleteItem,
        hideItem,
        unhideItem,
      }}
    >
      {children}
    </CollectionContext.Provider>
  )
}

export function useCollection() {
  return useContext(CollectionContext)
}