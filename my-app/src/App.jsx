import Navbar from './components/Navbar'
import FilterBar from './components/FilterBar'
import ItemList from './components/ItemList'
import ItemForm from './components/ItemForm'
import { useUI } from './context/UIContext'
import './styles/App.css'

function App() {
  const { showModal, modalMode, editingItem, closeModal } = useUI()

  return (
    <div className="app-container">
      <Navbar />
      <FilterBar />
      <div className="main-grid">
        <ItemList />
      </div>
      {showModal && (
        <ItemForm
          mode={modalMode}
          item={editingItem}
          onClose={closeModal}
        />
      )}
    </div>
  )
}

export default App
