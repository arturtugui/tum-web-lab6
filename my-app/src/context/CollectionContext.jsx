import { createContext, useContext, useReducer } from 'react'
import { reducer } from '../reducers/collectionReducer'

const CollectionContext = createContext(null)

//wrapper for App.jsx to provide collection state and dispatch
//usage in any component
//const { state, dispatch } = useCollection()
export function CollectionProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [] })

  return (
    <CollectionContext.Provider value={{ state, dispatch }}>
      {children}
    </CollectionContext.Provider>
  )
}

export function useCollection() {
  return useContext(CollectionContext)
}