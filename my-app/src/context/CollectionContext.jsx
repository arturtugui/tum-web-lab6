import { createContext, useContext, useReducer, useEffect, useState } from 'react'
import { reducer } from '../reducers/collectionReducer'
import { useRole } from './RoleContext'
import { useAuth } from './AuthContext'
import { useError } from './ErrorContext'
import * as api from '../services/api'

const CollectionContext = createContext(null)

const ITEMS_PER_PAGE = 10

export function CollectionProvider({ children }) {
  const { role } = useRole()
  const { getToken, getCurrentToken } = useAuth()
  const { setError: setGlobalError, clearError } = useError()
  const [state, dispatch] = useReducer(reducer, { items: [] })
  const [currentPage, setCurrentPage] = useState(0)
  const [total, setTotal] = useState(0)

  // Initialize and load items on mount or role change
  useEffect(() => {
    const initializeApp = async () => {
      try {
        clearError()

        // Get token for current role
        const token = await getToken(role)

        // Fetch items from API with pagination
        const offset = currentPage * ITEMS_PER_PAGE
        const response = await api.fetchItems(token, ITEMS_PER_PAGE, offset)
        dispatch({ type: 'SET_ITEMS', payload: response.items || [] })
        setTotal(response.total || 0)
      } catch (err) {
        const errorMsg = err.message || 'Failed to load items'
        console.error('Initialization error:', err)
        setGlobalError(errorMsg)
        dispatch({ type: 'SET_ITEMS', payload: [] })
        setTotal(0)
      }
    }

    initializeApp()
  }, [role, getToken, clearError, setGlobalError, currentPage])

  // Wrapper functions for API mutations
  // Use getToken(role) to auto-refresh expired tokens, not getCurrentToken()
  const addItem = async (item) => {
    try {
      clearError()
      const token = await getToken(role)
      
      const response = await api.createItem(token, item, () => getToken(role))
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
      const token = await getToken(role)
      
      const response = await api.updateItem(token, id, updates, () => getToken(role))
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
      const token = await getToken(role)
      
      await api.deleteItem(token, id, () => getToken(role))
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
      const token = await getToken(role)
      
      await api.hideItem(token, id, () => getToken(role))
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
      const token = await getToken(role)
      
      await api.unhideItem(token, id, () => getToken(role))
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
        currentPage,
        setCurrentPage,
        total,
        itemsPerPage: ITEMS_PER_PAGE,
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