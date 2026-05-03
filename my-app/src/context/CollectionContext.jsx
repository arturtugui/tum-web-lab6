import { createContext, useContext, useReducer } from 'react'
import { reducer } from '../reducers/collectionReducer'

const CollectionContext = createContext(null)

//wrapper for App.jsx to provide collection state and dispatch
//usage in any component
//const { state, dispatch } = useCollection()
export function CollectionProvider({ children }) {
  const initialState = { 
    items: [
      { 
        id: 1, 
        title: 'Inception', 
        category: 'movie', 
        status: 'completed', 
        rating: 9, 
        coverUrl: 'https://loremflickr.com/250/350/movie',
        notes: 'Mind-bending sci-fi masterpiece',
        isHidden: false,
        genres: 'Sci-Fi, Thriller',
        episodes: null
      },
      { 
        id: 2, 
        title: 'Breaking Bad', 
        category: 'series', 
        status: 'completed', 
        rating: 10, 
        coverUrl: 'https://loremflickr.com/250/350/tv',
        notes: 'Best series ever made',
        isHidden: false,
        genres: 'Drama, Crime',
        episodes: 62
      },
      { 
        id: 3, 
        title: 'Elden Ring', 
        category: 'game', 
        status: 'in_progress', 
        rating: 8, 
        coverUrl: 'https://loremflickr.com/250/350/gaming',
        notes: 'Challenging and beautiful',
        isHidden: false,
        platform: 'PC',
        developer: 'FromSoftware'
      },
      { 
        id: 4, 
        title: 'Dune', 
        category: 'book', 
        status: 'planned', 
        rating: null, 
        coverUrl: 'https://loremflickr.com/250/350/book',
        notes: 'Epic sci-fi novel I want to read',
        isHidden: false,
        author: 'Frank Herbert',
        pages: 688
      },
    ] 
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <CollectionContext.Provider value={{ state, dispatch }}>
      {children}
    </CollectionContext.Provider>
  )
}

export function useCollection() {
  return useContext(CollectionContext)
}