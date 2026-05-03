import Navbar from './components/Navbar'
import FilterBar from './components/FilterBar'
import ItemList from './components/ItemList'
import ItemForm from './components/ItemForm'
import ItemView from './components/ItemView'
import { useUI } from './context/UIContext'
import './styles/App.css'

function App() {
  const { showModal, showItemView } = useUI()

  return (
    <div className="app-container">
      <Navbar />
      <FilterBar />
      <div className="main-grid">
        <ItemList />
      </div>
      {showModal && <ItemForm />}
      {showItemView && <ItemView />}
    </div>
  )
}

export default App
