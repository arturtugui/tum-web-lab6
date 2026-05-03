import { createContext, useContext, useState } from 'react'

const FilterContext = createContext()

export function FilterProvider({ children }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeStatus, setActiveStatus] = useState('all')
  const [searchText, setSearchText] = useState('')

  return (
    <FilterContext.Provider
      value={{
        activeCategory,
        setActiveCategory,
        activeStatus,
        setActiveStatus,
        searchText,
        setSearchText,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('useFilter must be used within FilterProvider')
  }
  return context
}
