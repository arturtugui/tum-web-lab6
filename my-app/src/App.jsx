import Navbar from './components/Navbar'
import FilterBar from './components/FilterBar'
import './styles/App.css'

function App() {

  return (
    <div className="app-container">
      <Navbar />
      <FilterBar />
      <div className="content-placeholder"></div>
    </div>
  )
}

export default App
