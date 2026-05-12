import { createContext, useContext, useReducer, useEffect, useState } from 'react'
import { reducer } from '../reducers/collectionReducer'
import { useRole } from './RoleContext'
import * as api from '../services/api'
import * as tokenService from '../services/tokenService'

const CollectionContext = createContext(null)

export function CollectionProvider({ children }) {
  const { role } = useRole()
  const [state, dispatch] = useReducer(reducer, { items: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Initialize token and load items on mount or role change
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get or refresh token for current role
        const token = await tokenService.getValidToken(api.getTokenForRole, role)

        // Fetch items from API
        const response = await api.fetchItems(token)
        dispatch({ type: 'SET_ITEMS', payload: response.items || [] })
      } catch (err) {
        const errorMsg = err.message || 'Failed to initialize app'
        console.error('App initialization error:', err)
        setError(errorMsg)
        // Fall back to empty items on error
        dispatch({ type: 'SET_ITEMS', payload: [] })
      } finally {
        setLoading(false)
      }
    }

    initializeApp()
  }, [role])

  // Wrapper functions for API mutations
  const addItem = async (item) => {
    try {
      setError(null)
      const token = tokenService.getToken()
      if (!token) throw new Error('No token available')
      
      const response = await api.createItem(token, item)
      dispatch({ type: 'ADD_ITEM', payload: response.item || response })
      return response.item || response
    } catch (err) {
      const errorMsg = err.message || 'Failed to add item'
      setError(errorMsg)
      throw err
    }
  }

  const editItem = async (id, updates) => {
    try {
      setError(null)
      const token = tokenService.getToken()
      if (!token) throw new Error('No token available')
      
      const response = await api.updateItem(token, id, updates)
      dispatch({ type: 'EDIT_ITEM', payload: response.item || { id, ...updates } })
      return response.item
    } catch (err) {
      const errorMsg = err.message || 'Failed to edit item'
      setError(errorMsg)
      throw err
    }
  }

  const deleteItem = async (id) => {
    try {
      setError(null)
      const token = tokenService.getToken()
      if (!token) throw new Error('No token available')
      
      await api.deleteItem(token, id)
      dispatch({ type: 'DELETE_ITEM', payload: id })
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete item'
      setError(errorMsg)
      throw err
    }
  }

  const hideItem = async (id) => {
    try {
      setError(null)
      const token = tokenService.getToken()
      if (!token) throw new Error('No token available')
      
      await api.hideItem(token, id)
      dispatch({ type: 'HIDE_ITEM', payload: id })
    } catch (err) {
      const errorMsg = err.message || 'Failed to hide item'
      setError(errorMsg)
      throw err
    }
  }

  const unhideItem = async (id) => {
    try {
      setError(null)
      const token = tokenService.getToken()
      if (!token) throw new Error('No token available')
      
      await api.unhideItem(token, id)
      dispatch({ type: 'UNHIDE_ITEM', payload: id })
    } catch (err) {
      const errorMsg = err.message || 'Failed to unhide item'
      setError(errorMsg)
      throw err
    }
  }

  const clearError = () => setError(null)

  return (
    <CollectionContext.Provider 
      value={{ 
        state, 
        dispatch,
        loading,
        error,
        clearError,
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