// we need to return a new state object
// otherwise React will not know that it has changed 
// and will not re-render the component

// state is a global variable accesible through useContext()
// it contains items, theme, etc.

export function reducer(state, action) {
  switch (action.type) {
    case 'SET_ITEMS': {
      // Used for loading items from API on mount
      return { ...state, items: action.payload }
    }
    case 'ADD_ITEM': {
      console.log('Adding item:', action.payload)
      return { ...state, 
        items: [...state.items, action.payload]
      }
    }
    case 'EDIT_ITEM': {
      console.log('Editing item:', action.payload)
      return { ...state, 
        items: state.items.map(item => item.id === action.payload.id ? action.payload : item)
      }
    }
    case 'HIDE_ITEM': {
      const itemToHide = state.items.find(item => item.id === action.payload)
      console.log('Hiding item:', itemToHide)
      return { ...state, 
        items: state.items.map(item => item.id === action.payload ? { ...item, isHidden: true } : item)
      }
    }
    case 'UNHIDE_ITEM': {
      const itemToUnhide = state.items.find(item => item.id === action.payload)
      console.log('Unhiding item:', itemToUnhide)
      return { ...state, 
        items: state.items.map(item => item.id === action.payload ? { ...item, isHidden: false } : item)
      }
    }
    case 'DELETE_ITEM': {
      const itemToDelete = state.items.find(item => item.id === action.payload)
      console.log('Deleting item:', itemToDelete)
      return { ...state, 
        items: state.items.filter(item => item.id !== action.payload)
      }
    }
    default: return state
  }
}

// action.payload is different for each action
// for ADD_ITEM, it's the new item object
// for EDIT_ITEM, it's the updated item object
// for HIDE_ITEM and UNHIDE_ITEM, it's the id of the item to hide/unhide
// for DELETE_ITEM, it's the id of the item to delete