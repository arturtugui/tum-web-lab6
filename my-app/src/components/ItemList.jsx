import { useCollection } from '../context/CollectionContext'
import ItemCard from './ItemCard'
import './ItemList.css'

function ItemList({ onEditClick }) {
    const { state } = useCollection()

    const visible = state.items.filter(item => !item.isHidden)
    const hasNoItems = state.items.length === 0
    const hasNoResults = state.items.length > 0 && visible.length === 0

    return (
        <div className="item-list">
            {visible.length > 0 ? (
                visible.map(item => (
                    <ItemCard key={item.id} item={item} onEditClick={onEditClick} />
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