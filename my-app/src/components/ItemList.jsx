import { useCollection } from '../context/CollectionContext'
import { useFilter } from '../context/FilterContext'
import ItemCard from './ItemCard'
import './ItemList.css'

function ItemList() {
    const { state } = useCollection()
    const { activeCategory, activeStatus } = useFilter()

    // Apply filtering logic
    let filtered = state.items.filter((item) => !item.isHidden)

    if (activeCategory !== 'all') {
        filtered = filtered.filter((item) => item.category === activeCategory)
    }

    if (activeStatus !== 'all') {
        filtered = filtered.filter((item) => item.status === activeStatus)
    }

    const hasNoItems = state.items.length === 0
    const hasNoResults = state.items.length > 0 && filtered.length === 0

    return (
        <div className="item-list">
            {filtered.length > 0 ? (
                filtered.map(item => (
                    <ItemCard key={item.id} item={item} />
                ))
            ) : hasNoItems ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📦</div>
                    <p className="empty-state-message">No items yet — add your first interest to get started!</p>
                </div>
            ) : hasNoResults ? (
                <div className="empty-state">
                    <div className="empty-state-icon">🔍</div>
                    <p className="empty-state-message">No results match your filters. Try adjusting them.</p>
                </div>
            ) : null}
        </div>
    )
}

export default ItemList