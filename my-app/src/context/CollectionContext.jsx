import { createContext, useContext, useReducer, useEffect } from 'react'
import { reducer } from '../reducers/collectionReducer'

const CollectionContext = createContext(null)

// Default test data
const DEFAULT_ITEMS = [
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
    episodes: null,
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
    episodes: 62,
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
    developer: 'FromSoftware',
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
    pages: 688,
  },
]

// Load initial state from localStorage or use default test data
function getInitialState() {
  try {
    const saved = localStorage.getItem('pit-collection')
    if (saved) {
      return { items: JSON.parse(saved) }
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error)
  }
  return { items: DEFAULT_ITEMS }
}

//wrapper for App.jsx to provide collection state and dispatch
//usage in any component
//const { state, dispatch } = useCollection()
export function CollectionProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, getInitialState)

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('pit-collection', JSON.stringify(state.items))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }, [state.items])

  return (
    <CollectionContext.Provider value={{ state, dispatch }}>
      {children}
    </CollectionContext.Provider>
  )
}

export function useCollection() {
  return useContext(CollectionContext)
}