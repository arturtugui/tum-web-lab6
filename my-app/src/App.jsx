import Navbar from './components/Navbar'
import FilterBar from './components/FilterBar'
import ItemList from './components/ItemList'
import './styles/App.css'

function App() {

  return (
    <div className="app-container">
      <Navbar />
      <FilterBar />
      <div className="main-grid">
        <ItemList />
      </div>
    </div>
  )
}

export default App
