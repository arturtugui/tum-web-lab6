import { createContext, useContext, useReducer, useEffect } from 'react'
import { reducer } from '../reducers/collectionReducer'

const CollectionContext = createContext(null)

// Default test data
const DEFAULT_ITEMS = [
  {
    id: 1,
    title: 'The Boys',
    category: 'series',
    status: 'in_progress',
    coverUrl: 'https://image.tmdb.org/t/p/original/2zmTngn1tYC1AvfnrFLhxeD82hz.jpg',
  },
  {
    id: 2,
    title: 'Apex Legends',
    category: 'game',
    status: 'in_progress',
    coverUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg',
  },
  {
    id: 3,
    title: 'Resident Evil 2',
    category: 'game',
    status: 'completed',
    coverUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/883710/library_600x900_2x.jpg',
  },
  {
    id: 4,
    title: 'Dexter',
    category: 'series',
    status: 'completed',
    coverUrl: 'https://image.tmdb.org/t/p/original/q8dWfc4JwQuv3HayIZeO84jAXED.jpg',
  },
  {
    id: 5,
    title: "Schindler's List",
    category: 'movie',
    status: 'planned',
    coverUrl: 'https://image.tmdb.org/t/p/original/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg',
  },
  {
    id: 6,
    title: 'Tokyo Ghoul',
    category: 'manga',
    status: 'completed',
    coverUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqf9NgrDpoUTRfA2vfs10ic6T5tJOxoojSptkdHHpxF2aoBaoIxtQYJCwOS1kGkanCa68vOxMmUYrCxryQdgrbz7Vu4R7Z_a6xMbOGPQ39vg&s=10',
  },
  {
    id: 7,
    title: "Takopi's Original Sin",
    category: 'anime',
    status: 'completed',
    coverUrl: 'https://i0.wp.com/ronitjauthor.com/wp-content/uploads/2025/08/Takopis-Original-Sin-2025-Official-Poster-e1754218186871.webp?resize=540%2C720&ssl=1',
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