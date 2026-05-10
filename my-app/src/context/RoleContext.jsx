import { createContext, useContext, useState } from 'react'

const RoleContext = createContext(null)

export function RoleProvider({ children }) {
  const [role, setRole] = useState('owner') // default: owner

  const toggleRole = () => {
    setRole(prev => prev === 'owner' ? 'viewer' : 'owner')
  }

  return (
    <RoleContext.Provider value={{ role, toggleRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  return useContext(RoleContext)
}
