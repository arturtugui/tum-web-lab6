import { createContext, useContext, useState } from 'react'

const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('add') // 'add' or 'edit'
  const [editingItem, setEditingItem] = useState(null)

  const openAddModal = () => {
    setModalMode('add')
    setEditingItem(null)
    setShowModal(true)
  }

  const openEditModal = (item) => {
    setModalMode('edit')
    setEditingItem(item)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingItem(null)
    setModalMode('add')
  }

  return (
    <UIContext.Provider value={{
      showModal,
      modalMode,
      editingItem,
      openAddModal,
      openEditModal,
      closeModal
    }}>
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  return useContext(UIContext)
}
