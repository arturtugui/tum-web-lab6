# Advanced State Management in Modern Frontend Frameworks

> March 2026 | Advanced Web Development

---

## 1. Built-in State Management (What Each Framework Gives You)

### React

**`useState` — local component state**
```jsx
function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**`useReducer` — for complex state logic**
```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 }
    case 'reset': return { count: 0 }
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 })
  return (
    <>
      <span>{state.count}</span>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </>
  )
}
```

**`useContext` — sharing state across the tree**
```jsx
const ThemeContext = createContext('light')

function App() {
  const [theme, setTheme] = useState('light')
  return (
    <ThemeContext.Provider value={theme}>
      <DeepChild />
    </ThemeContext.Provider>
  )
}

function DeepChild() {
  const theme = useContext(ThemeContext) // no prop drilling
  return <div className={theme}>Hello</div>
}
```

**Limitation:** Every `useContext` consumer re-renders when the context value changes — even if the specific piece of data it uses didn't change. Fine for low-frequency updates (theme, auth), problematic for high-frequency (forms, lists).

---

### Vue

**`ref()` / `reactive()` — reactive primitives**
```vue
<script setup>
import { ref, reactive } from 'vue'

const count = ref(0)           // primitive → unwrap with .value in JS, auto in template
const user = reactive({        // object → direct property access
  name: 'Alice',
  age: 25
})
</script>

<template>
  <button @click="count++">{{ count }}</button>
  <p>{{ user.name }}</p>
</template>
```

**`computed()` — derived state**
```vue
<script setup>
const count = ref(4)
const isEven = computed(() => count.value % 2 === 0)
</script>
```

**`provide/inject` — cross-tree sharing**
```vue
<!-- Parent.vue -->
<script setup>
import { provide, ref } from 'vue'
const theme = ref('light')
provide('theme', theme)
</script>

<!-- DeepChild.vue -->
<script setup>
import { inject } from 'vue'
const theme = inject('theme')
</script>
```

**Limitation:** Works well for small-medium apps. No enforced structure for large teams.

---

### Angular

**`@Input/@Output` — parent-child communication**
```ts
// child.component.ts
@Component({ selector: 'app-child', template: `
  <button (click)="clicked.emit()">Click me</button>
` })
export class ChildComponent {
  @Input() label = ''
  @Output() clicked = new EventEmitter()
}

// parent template
// <app-child [label]="'Hello'" (clicked)="onClicked()" />
```

**Services + `BehaviorSubject` — the classic Angular global state**
```ts
@Injectable({ providedIn: 'root' })
export class CounterService {
  private count$ = new BehaviorSubject(0)
  readonly value$ = this.count$.asObservable()

  increment() { this.count$.next(this.count$.value + 1) }
}

// In component:
export class CounterComponent {
  count$ = inject(CounterService).value$
}
// template: {{ count$ | async }}
```

**Signals (Angular 17+) — the modern approach**
```ts
@Injectable({ providedIn: 'root' })
export class CounterStore {
  count = signal(0)
  doubled = computed(() => this.count() * 2)

  increment() { this.count.update(v => v + 1) }
}

// In component:
export class CounterComponent {
  store = inject(CounterStore)
}
// template: {{ store.count() }}
```

**Limitation:** RxJS has a steep learning curve. Services without structure can turn into spaghetti at scale.

---

## 2. The Problem These Don't Solve

As apps grow:
- State is spread across many components
- Multiple components need the same data
- State changes become hard to trace ("who changed this and when?")
- Testing becomes difficult
- Time-travel debugging is impossible

This is where **Flux architecture** enters.

---

## 3. Flux Architecture

Introduced by Facebook/Meta in 2014 alongside React.

**Core idea:** unidirectional data flow.

```
Action → Dispatcher → Store → View → (user interaction) → Action
```

![basic_flux_architecture](https://krasimir.gitbooks.io/react-in-patterns/content/chapter-08/fluxiny_basic_flux_architecture.jpg)

**Four concepts:**
- **Store** — holds application state
- **Action** — a plain description of what happened (`{ type: 'ADD_TODO', payload: ... }`)
- **Dispatcher** — routes actions to the right store
- **View** — reads from store, dispatches actions on user input

**Why it matters:** state changes are **explicit, traceable, and predictable**. You can log every action and replay them.

Redux simplified the original Flux (single store, no dispatcher) and became the dominant implementation.

---

## 4. Redux (Original)

Library: `redux` + `react-redux`

```js
// Action
const increment = () => ({ type: 'INCREMENT' })

// Reducer
function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT': return state + 1
    default: return state
  }
}

// Store
const store = createStore(counter)
```

**Problems with vanilla Redux:**
- Enormous boilerplate (actions, action creators, reducers, selectors — all separate files)
- Mutable state mistakes are easy
- Async logic (thunks/sagas) is bolted on awkwardly

---

## 5. Redux Toolkit (RTK) — Redux Today

Package: `@reduxjs/toolkit`

The official, opinionated way to write Redux. Eliminates most boilerplate.

```js
const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment: state => state + 1,
    decrement: state => state - 1,
  }
})
```

- `createSlice` — actions + reducer in one place
- `createAsyncThunk` — async logic with loading/error states built in
- `RTK Query` — data fetching + caching (replaces much of what people used Redux for)
- Uses **Immer** under the hood — write "mutating" code that stays immutable

> RTK Query specifically has reduced the need for Redux in many apps. If your state is mostly server data, RTK Query + a little local state often replaces a full Redux setup.

---

## 6. Zustand — React State Without the Ceremony

Package: `zustand`

Minimal, fast, no boilerplate. Increasingly the default choice for React apps that don't need RTK's structure.

```js
const useStore = create(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 }))
}))

// In component:
const count = useStore(state => state.count)
```

- No Provider wrapping needed
- Selector-based subscriptions (no unnecessary re-renders)
- Works outside React (in plain JS)
- **When to use:** medium-sized apps, teams that find Redux too heavy

---

## 7. Pinia — Vue's Official State Library

Package: `pinia` (replaced Vuex as the official Vue store)

```js
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    doubled: state => state.count * 2
  },
  actions: {
    increment() { this.count++ }
  }
})
```

- First-class TypeScript support
- Devtools integration
- No mutations concept (simpler than Vuex)
- Modular by design — each store is independent
- **Pinia vs Vuex:** Pinia won. Vuex is legacy.

---

## 8. Angular: NgRx, Akita, and Signals-based Stores

### NgRx — Redux for Angular
Package: `@ngrx/store`

Full Redux pattern adapted for Angular with RxJS:
- `Actions`, `Reducers`, `Selectors`, `Effects` (for side effects via RxJS)
- Very verbose but explicit and testable
- Standard choice for large enterprise Angular apps

```ts
// Action
const increment = createAction('[Counter] Increment')

// Reducer
const counterReducer = createReducer(0,
  on(increment, state => state + 1)
)
```

### NgRx Signal Store (new in 2024–2025)
- NgRx rebuilt around Signals — drops RxJS dependency for state
- Much less boilerplate than classic NgRx
- The direction Angular state management is heading

### Akita
- Alternative to NgRx, entity-based, less verbose
- Smaller community, but simpler mental model

### Plain Services + Signals (Angular 17+)
For many apps this is enough:
```ts
@Injectable({ providedIn: 'root' })
export class CounterStore {
  count = signal(0)
  increment() { this.count.update(v => v + 1) }
}
```

---

## 9. Comparison Table

| Library | Framework | Philosophy | Boilerplate | Best For |
|---------|-----------|------------|-------------|----------|
| Redux (vanilla) | React | Strict Flux | High | Legacy codebases |
| Redux Toolkit | React | Opinionated Redux | Medium | Large apps, teams |
| RTK Query | React | Server state | Low | Data fetching |
| Zustand | React | Minimal | Very low | Small-medium apps |
| Pinia | Vue | Composition-friendly | Low | All Vue apps |
| NgRx Store | Angular | Redux + RxJS | High | Large enterprise |
| NgRx Signal Store | Angular | Signals-first | Medium | Modern Angular |
| Services + Signals | Angular | Framework-native | Very low | Small-medium apps |

---

## 10. When to Use What

- **Server data** (API calls, caching, loading states) → RTK Query, TanStack Query, SWR. Don't use Redux for this.
- **Global UI state** (modals, themes, auth) → Zustand / Pinia / Angular Signals service. Simple, no ceremony.
- **Complex domain logic** with many actors, audit trails, strict team contracts → Redux Toolkit / NgRx. The structure pays off.
- **Most apps in 2026** → combination of server-state library + small global store. Full Redux is often overkill.

---

## 11. The Signals Shift

Signals (Angular v17, Vue 3.4+, Solid, Svelte 5 Runes) change state management fundamentally:
- Fine-grained reactivity — only the exact component that reads a signal re-renders
- No selector optimization needed (unlike Redux)
- Synchronous, predictable
- TC39 proposal to add to JS itself — signals may become a platform primitive

> The trajectory: Signals will handle most reactive UI state. External stores will be reserved for genuinely cross-cutting concerns.