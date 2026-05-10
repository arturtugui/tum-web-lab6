# React Concepts — Before You Start Coding

> Tailored for someone with C / Java / Python background and Astro/HTML/CSS experience.
> No Redux, no Zustand — just React built-ins.

---

## 1. JSX — HTML inside JavaScript

In React you don't write `.html` files. Instead you write **JSX** — a syntax that looks like HTML but lives inside `.jsx` files.

```jsx
function Greeting() {
  const name = "Alex"
  return <h1>Hello, {name}</h1>  // {} lets you inject any JS expression
}
```

**Think of it like:** a Java method that returns a string of HTML, except the compiler understands it natively.

Rules to remember:
- Every component must return **one root element** (wrap in `<div>` or `<>...</>` if needed)
- Use `className` instead of `class` (because `class` is a reserved word in JS)
- Self-close tags that have no children: `<img />`, `<input />`

---

## 2. Components — The Basic Building Block

A component is just a **function** that returns JSX. That's it.

```jsx
function Button() {
  return <button>Click me</button>
}
```

You use it like an HTML tag:
```jsx
function App() {
  return (
    <div>
      <Button />
      <Button />
    </div>
  )
}
```

**Think of it like:** a Java class with only one method (`render`), but written as a plain function.

File convention: one component per file, filename matches component name.
```
Button.jsx       → exports function Button
MovieCard.jsx    → exports function MovieCard
```

---

## 3. Props — Passing Data Into a Component

Props are how a parent passes data to a child. They work like function parameters.

```jsx
function Button({ label, color }) {
  return <button style={{ background: color }}>{label}</button>
}

// Usage:
<Button label="Add Movie" color="blue" />
<Button label="Delete" color="red" />
```

**Think of it like:** a function signature in C — `void Button(char* label, char* color)`.

Props are **read-only** inside the child. You never modify them.

---

## 4. useState — Local State (Memory of a Component)

When you need a variable that, when changed, causes the UI to update — use `useState`.

```jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)  // [currentValue, setterFunction]

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  )
}
```

**Rules:**
- Never modify the value directly (`count = count + 1` won't work)
- Always use the setter (`setCount(count + 1)`)
- Calling the setter triggers a re-render

**Think of it like:** a variable + a signal that tells the UI "redraw now."

**When to use it:** modal open/close, search input value, active filter, anything local to one component.

---

## 5. useReducer — Global-style State Logic

When your state has multiple fields and multiple ways to change, `useReducer` is cleaner than many `useState` calls.

```jsx
import { useReducer } from 'react'

// The reducer: a pure function (like a switch statement dispatcher)
function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) }
    default:
      return state
  }
}

const initialState = { items: [] }

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: { id: 1, title: 'Inception' } })}>
      Add
    </button>
  )
}
```

**Think of it like:**
- `state` = the current data (read-only snapshot)
- `dispatch` = sending a message to the event loop: "hey, something happened"
- `reducer` = the handler that decides what the new state looks like
- `action` = `{ type: 'WHAT_HAPPENED', payload: optionalData }`

**The reducer must be a pure function:**
- No API calls inside it
- Never mutate the old state — always return a new copy (`{ ...state, ... }`)

---

## 6. useContext — Sharing State Without Passing Props Everywhere

Without Context, you'd have to pass props through every level of the component tree ("prop drilling"). Context is a way to broadcast state to any component that needs it.

**Step 1 — Create the context:**
```jsx
// src/context/CollectionContext.jsx
import { createContext, useContext, useReducer } from 'react'

const CollectionContext = createContext(null)

export function CollectionProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [] })

  return (
    <CollectionContext.Provider value={{ state, dispatch }}>
      {children}
    </CollectionContext.Provider>
  )
}

// Custom hook for convenience
export function useCollection() {
  return useContext(CollectionContext)
}
```

**Step 2 — Wrap your app:**
```jsx
// src/main.jsx or App.jsx
<CollectionProvider>
  <App />
</CollectionProvider>
```

**Step 3 — Use it anywhere in the tree:**
```jsx
function MovieCard({ item }) {
  const { dispatch } = useCollection()

  return (
    <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}>
      Delete
    </button>
  )
}
```

**Think of it like:** a global singleton — any component can `inject()` it and get the same instance.

---

## 7. Rendering Lists

To render a list of items you use `.map()` — like `forEach` but it returns a new array of JSX.

```jsx
function ItemList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  )
}
```

The `key` prop is required — React uses it internally to track which item is which. Always use a unique and stable value (like an `id`), never the array index.

---

## 8. Conditional Rendering

You can show/hide elements with plain JS logic inside JSX.

```jsx
// Ternary — show one thing or another
{isOwner ? <EditButton /> : null}

// Short-circuit — show only if true
{isOwner && <EditButton />}

// If/else before the return
function Panel({ role }) {
  if (role === 'viewer') return <p>Read only</p>
  return <EditForm />
}
```

---

## 9. Event Handling

Events in React are camelCase and take a function, not a string.

```jsx
// HTML:    <button onclick="handleClick()">
// React:   <button onClick={handleClick}>

function Form() {
  const [value, setValue] = useState('')

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}  // e.target.value = current input
    />
  )
}
```

---

## 10. File & Folder Structure (for this project)

```
src/
├── main.jsx                  # Entry point — mounts App, don't touch much
├── App.jsx                   # Root component — sets up providers and routing
│
├── context/
│   ├── CollectionContext.jsx # useReducer + useContext for the interest collection
│   ├── RoleContext.jsx       # owner vs viewer role
│   └── ThemeContext.jsx      # light / dark theme
│
├── components/
│   ├── ItemCard.jsx          # Single interest item display
│   ├── ItemForm.jsx          # Add/edit form (modal)
│   ├── FilterBar.jsx         # Category tabs + search + status filter
│   ├── ItemList.jsx          # Renders the grid/list of ItemCards
│   └── Navbar.jsx            # Top navigation, theme toggle, role switcher
│
├── reducers/
│   └── collectionReducer.js  # The reducer function + action types
│
└── styles/
    ├── global.css            # CSS variables for light/dark theme, resets
    ├── App.css
    └── components/           # Per-component CSS files
```

---

## 11. localStorage — Persisting State

To save your collection so it survives a page refresh:

```js
// Save
localStorage.setItem('collection', JSON.stringify(state.items))

// Load (on first render)
const saved = localStorage.getItem('collection')
const initial = saved ? JSON.parse(saved) : []
```

In your app this will happen in two places:
- **Load** — when the `CollectionProvider` initializes its state
- **Save** — every time `dispatch` is called and state changes (via `useEffect`)

---

## Quick Reference — Which Hook For What

| Situation | Hook |
|-----------|------|
| Toggle a modal open/closed | `useState` |
| Track search input text | `useState` |
| Active filter/tab selection | `useState` |
| The entire interest collection | `useReducer` |
| Share collection across components | `useContext` |
| Current role (owner/viewer) | `useContext` |
| Light/dark theme | `useContext` + `localStorage` |
