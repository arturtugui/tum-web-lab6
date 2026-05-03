import { useState } from 'react'
import Navbar from './components/Navbar'
import FilterBar from './components/FilterBar'
import ItemList from './components/ItemList'
import ItemForm from './components/ItemForm'
import './styles/App.css'

function App() {
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('add') // 'add' or 'edit'
  const [editingItem, setEditingItem] = useState(null)

  const handleOpenAddModal = () => {
    setModalMode('add')
    setEditingItem(null)
    setShowModal(true)
  }

  const handleOpenEditModal = (item) => {
    setModalMode('edit')
    setEditingItem(item)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingItem(null)
    setModalMode('add')
  }

  return (
    <div className="app-container">
      <Navbar onAddClick={handleOpenAddModal} />
      <FilterBar />
      <div className="main-grid">
        <ItemList onEditClick={handleOpenEditModal} />
      </div>
      {showModal && (
        <ItemForm
          mode={modalMode}
          item={editingItem}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default App
