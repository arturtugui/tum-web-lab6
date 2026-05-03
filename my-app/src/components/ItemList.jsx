import { useCollection } from '../context/CollectionContext'
import ItemCard from './ItemCard'

function ItemList() {
    const { state, dispatch } = useCollection()

    const visible = state.items.filter(item => !item.isHidden)

    return (
        <div className="item-list">
            {visible.map(item => (
                <ItemCard key={item.id} item={item} />
            ))}
        </div>
    )
}

export default ItemList