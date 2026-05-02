import Navbar from './components/Navbar'
import FilterBar from './components/FilterBar'
import ItemCard from './components/ItemCard'
import './styles/App.css'

function App() {

  return (
    <div className="app-container">
      <Navbar />
      <FilterBar />
      <div className="main-grid">
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
      </div>
    </div>
  )
}

export default App
