import { useReducer } from 'react'

// we need to return a new state object
// otherwise React will not know that it has changed 
// and will not re-render the component

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': return { ...state, // copy the old state (not just items, but any other properties
        items: [...state.items, action.payload] } //replace items with a new array that includes the new item
    case 'EDIT_ITEM': return { ...state, 
        items: state.items.map(item => item.id === action.payload.id ? action.payload : item) }
    case 'HIDE_ITEM': return { ...state, 
        items: state.items.map(item => item.id === action.payload.id ? { ...item, hidden: true } : item) }
    case 'UNHIDE_ITEM': return { ...state, 
        items: state.items.map(item => item.id === action.payload.id ? { ...item, hidden: false } : item) }
    case 'DELETE_ITEM': return { ...state, 
        items: state.items.filter(item => item.id !== action.payload.id) }
    default: return state
  }
}