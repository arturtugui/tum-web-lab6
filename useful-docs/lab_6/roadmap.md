# Roadmap — Personal Interest Tracker (Lab 6)

> Each stage = one Pull Request. Commit often within each stage — at least one commit per meaningful step.
> **Scope:** Front-end only, localStorage storage. API/JWT/Pagination are Lab 7 tasks.

---

## Stage 1 — Project Cleanup & Folder Structure

**Branch:** `stage/1-setup`

The Vite starter comes with demo code you don't need. Clean it up and set up your structure.

**Tasks:**

- Delete everything inside `src/` except `main.jsx` and `App.jsx`
- Clear `App.jsx` down to a bare shell: just a `<div>` returning "Hello"
- Create the folder structure from `concepts.md` (empty files are fine for now):
  - `src/context/` — `CollectionContext.jsx`, `RoleContext.jsx`, `ThemeContext.jsx`
  - `src/components/` — `Navbar.jsx`, `ItemList.jsx`, `ItemCard.jsx`, `ItemForm.jsx`, `FilterBar.jsx`
  - `src/reducers/` — `collectionReducer.js`
  - `src/styles/` — `global.css`, `App.css`
- Link `global.css` in `main.jsx`

**Deliverable:** App runs, shows "Hello", no console errors.

---

## Stage 2 — Layout & Visual Shell

**Branch:** `stage/2-ui-shell`

Build the full visual skeleton before touching logic.

**Tasks:**

- Design overall page layout in `App.css`:
  - Top navbar area
  - Filter bar below navbar
  - Main content area (grid of cards)
- Build static `Navbar.jsx`:
  - App name/logo on left
  - Placeholder buttons on right (Add, theme toggle, role toggle) — no functionality yet
- Build static `FilterBar.jsx`:
  - Category tabs (All, Movies, Series, Anime, Games, Manga, Comics, Books, Albums, YouTube)
  - Status filter dropdown (All, Planned, In Progress, Completed, Dropped)
  - Search input by title
  - No functionality yet — just HTML/CSS
- Build static `ItemCard.jsx`:
  - Cover image area
  - Title, category badge, status badge, rating
  - Action buttons: "View", "Edit", "Hide", "Delete" (placeholders, no functionality)
  - Use hardcoded values to design it
- Drop a few `<ItemCard />` copies into `App.jsx` to preview the grid
- Set up CSS variables in `global.css` for light theme:
  ```css
  :root {
    --bg: #ffffff;
    --text: #111111;
    --card-bg: #f5f5f5;
    --accent: #your-chosen-color;
    --border: #e0e0e0;
  }
  ```
- All component CSS uses `var(--bg)`, `var(--text)` etc — never hardcoded colors

**Design Tips for App.css & global.css:**

- **Essential CSS variables for both light & dark themes:**

  ```css
  /* Colors */
  --bg:
    page background --text: primary text --text-secondary: dimmer text
      (helpers, descriptions) --card-bg: card/component backgrounds
      --border: borders,
    dividers --accent: primary action color (buttons, highlights)
      --accent-hover: hover state for accent --success / --warning /
      --error: status colors (optional but useful) /* Spacing & Layout */
      --spacing-xs: 4px --spacing-sm: 8px --spacing-md: 16px --spacing-lg: 24px
      --spacing-xl: 32px /* Typography */ --font-family: system font stack
      --font-size-sm: 12px or 14px --font-size-base: 16px --font-size-lg: 18px
      or 20px --font-size-xl: 24px or 28px;
  ```

- **Color scheme strategy (works for light + dark):**
  - Start with a **primary accent color** (e.g., vibrant blue, teal, purple) that feels intentional
  - Light theme: white backgrounds, dark text, light accents
  - Dark theme: very dark backgrounds (#111, #0a0a0a), light text, same accent color
  - Test contrast: text should be easily readable (WCAG AA minimum)
  - Example:

    ```css
    /* Light theme */
    :root {
      --bg: #fafafa;
      --text: #1a1a1a;
      --card-bg: #ffffff;
      --accent: #4f46e5; /* Indigo */
    }

    /* Dark theme */
    [data-theme="dark"] {
      --bg: #0a0a0a;
      --text: #f5f5f5;
      --card-bg: #1a1a1a;
      --accent: #6366f1; /* Slightly lighter indigo for readability */
    }
    ```

- **Layout structure to include:**
  - **Navbar:** fixed or sticky, 60–80px height, flex row with space-between
  - **FilterBar:** sticky below navbar, padding with tabs/dropdown/input
  - **Main grid:** CSS Grid with `grid-template-columns: repeat(auto-fill, minmax(250px, 1fr))` or similar
  - **CardContainer:** gap between cards (16–24px)
  - **Responsive:** use media queries for mobile (single column on < 640px)

- **Placeholder elements to add:**
  - Empty `<div class="placeholder-image">` with background color for cover images
  - Badge styles for category/status
  - Button hover states (opacity change or subtle shadow)
  - Loading skeleton (optional, but nice prep for later)

- **Quick wins:**
  - Use `box-shadow` lightly for card depth (not harsh)
  - `border-radius: 8px` or `12px` for modern feel
  - Smooth transitions: `transition: all 0.2s ease` on interactive elements
  - Consistent padding: use your spacing scale, not random values

**Deliverable:** App looks complete with navbar, filter bar, and static card grid. No interactivity yet.

---

## Stage 3 — Data Model & Reducer

**Branch:** `stage/3-reducer`

Define item structure and reducer logic for mutations.

**Tasks:**

- In `collectionReducer.js` define:
  - Initial state: `{ items: [] }`
  - Action types as constants: `ADD_ITEM`, `EDIT_ITEM`, `HIDE_ITEM`, `UNHIDE_ITEM`, `DELETE_ITEM`
  - Reducer function handling all five actions
- Item structure:
  ```js
  {
    id,           // `Date.now() + Math.random()` or `crypto.randomUUID()`
    title,        // string
    category,     // 'movie' | 'series' | 'anime' | 'game' | 'manga' | 'comic' | 'book' | 'album' | 'youtube'
    status,       // 'planned' | 'in_progress' | 'completed' | 'dropped'
    rating,       // null or number (1–10)
    coverUrl,     // URL string
    notes,        // optional string
    isHidden,     // false by default (for archiving)
    // category-specific fields (optional, added dynamically during edit):
    // episodes (number), genres (string), platform (string), developer (string), author (string), etc.
  }
  ```
- Reducer actions:
  - `ADD_ITEM`: Create new item with `id` and `isHidden: false`, plus any category-specific fields
  - `EDIT_ITEM`: Merge new fields into existing item (by id)
  - `HIDE_ITEM`: Set `isHidden: true` (archive, reversible)
  - `UNHIDE_ITEM`: Set `isHidden: false` (restore from archive)
  - `DELETE_ITEM`: Permanently remove item from collection
- In `CollectionContext.jsx`:
  - Create context
  - Write `CollectionProvider` using `useReducer`
  - Export `useCollection` hook
- Wrap `<App />` with `<CollectionProvider>` in `main.jsx`

**Deliverable:** Reducer is wired up with full CRUD logic. No visible UI change.

---

## Stage 4 — Display Items & Empty States

**Branch:** `stage/4-item-display`

Connect state to UI and handle edge cases.

**Tasks:**

- Add 3–4 hardcoded items into `initialState.items` (different categories) for testing
- Build `ItemList.jsx`:
  - Gets items from `useCollection()`
  - **Filters out hidden items** (show only `i.isHidden === false`)
  - Maps over visible items and renders `<ItemCard />` for each with real data
  - **Empty state 1:** "No items yet — add your first interest to get started! 📦" (when collection is completely empty)
  - **Empty state 2:** "No results match your filters. Try adjusting them. 🔍" (when filtered view is empty but collection has items)
- Update `ItemCard.jsx` to accept and display item props (not hardcoded)
- Drop `<ItemList />` into `App.jsx`
- Empty state styling: centered, friendly message, optional icon

**Deliverable:** App displays items from state with context-aware empty messages.

---

## Stage 5 — Add, Edit, Hide, Delete Items

**Branch:** `stage/5-edit-remove`

Make the collection fully editable with all CRUD operations.

**Tasks:**

- Build `ItemForm.jsx` as a **reusable add/edit form**:
  - Always shows: title, category (dropdown), status (dropdown), rating (1–10), coverUrl, notes
  - **Form mode:**
    - `mode="add"` → empty fields, submit button says "Add Item"
    - `mode="edit"` → pre-fill with existing item data, submit button says "Update Item"
  - **Category-specific fields:** Based on selected category, include relevant fields:
    - movie/series/anime: genres (string), episodes (number)
    - game: platform (string), developer (string)
    - manga/comic: author (string), chapters (number)
    - book: author (string), pages (number)
    - album: artist (string), year (number)
    - youtube: channelUrl (URL), uploadFrequency (string)
  - On submit: `dispatch({ type: 'ADD_ITEM', payload: formData })` (add) or `dispatch({ type: 'EDIT_ITEM', payload: formData })` (edit)
  - On cancel: close modal (reset form state)
  - Optional: form validation for required fields
- In `Navbar.jsx`:
  - "Add" button opens ItemForm in `mode="add"` in a modal
- In `ItemCard.jsx`:
  - "Edit" button opens ItemForm in `mode="edit"` with item pre-filled
  - "Hide" button: `dispatch({ type: 'HIDE_ITEM', payload: item.id })` with optional confirmation
  - "Delete" button: `dispatch({ type: 'DELETE_ITEM', payload: item.id })` with confirmation (permanent action)
  - "View" button (optional): could open a detail view with full item info; skip for now if time-constrained
- Modal open/close and form mode state in `App.jsx` as `useState`
- Remove hardcoded items from `initialState`

**Deliverable:** Full CRUD: add, edit, hide/unhide, delete. Collection starts empty. All changes in memory (localStorage comes in Stage 7).

---

## Stage 6 — Filter & Search

**Branch:** `stage/6-filter-search`

Navigate collection by category, status, and search.

**Tasks:**

- Build `FilterBar.jsx`:
  - Category tabs (All, Movies, Series, Anime, Games, ...)
  - Status filter dropdown (All, Planned, In Progress, Completed, Dropped)
  - Search input by title (real-time filtering)
  - Optional: "Show Archived" checkbox to include hidden items
- Filter state (activeCategory, activeStatus, search text) in `App.jsx` as `useState`
- Filtering logic in `App.jsx` before passing to `ItemList`:

  ```js
  let visible = state.items.filter((i) => !i.isHidden); // Always exclude hidden by default

  if (activeCategory !== "all") {
    visible = visible.filter((i) => i.category === activeCategory);
  }
  if (activeStatus !== "all") {
    visible = visible.filter((i) => i.status === activeStatus);
  }
  if (search.trim()) {
    visible = visible.filter((i) =>
      i.title.toLowerCase().includes(search.toLowerCase()),
    );
  }

  // Optional: if showArchived is true, re-add hidden items
  ```

- Pass `visible` to `ItemList` as a prop

**Deliverable:** Filter by category/status, search by title. Empty states reflect filtered results correctly.

---

## Stage 7 — localStorage Persistence

**Branch:** `stage/7-persistence`

Make the collection survive a page refresh.

**Tasks:**

- In `CollectionContext.jsx`:
  - On init, load from localStorage:
    ```js
    const saved = localStorage.getItem("pit-collection");
    const initialState = { items: saved ? JSON.parse(saved) : [] };
    ```
  - After every dispatch, save to localStorage using `useEffect`:
    ```js
    useEffect(() => {
      localStorage.setItem("pit-collection", JSON.stringify(state.items));
    }, [state.items]);
    ```
- Test: add items, refresh the page — they should still be there

**Deliverable:** Collection persists across page refreshes.

---

## Stage 8 — Role System (Owner / Viewer) I WILL NOT TOUCH THIS FOR LAB 6

**Branch:** `stage/8-roles`

Simulate two-role system (prep for Lab 7 JWT).

**Tasks:**

- In `RoleContext.jsx`:
  - Context holds `role` (`'owner'` or `'viewer'`) and `toggleRole` function
  - Use `useState` internally (role is just one value)
  - Export `useRole` hook
- Wrap app in `<RoleProvider>` in `main.jsx`
- In `Navbar.jsx`:
  - Add role toggle button: "Switch to Viewer" / "Switch to Owner"
  - Hide "Add" button when role is `'viewer'`
- In `ItemCard.jsx`:
  - Hide "Edit", "Hide", "Delete" buttons when role is `'viewer'`
  - Optional: show "Read-only mode" badge or indicator
- Viewer mode is purely frontend simulation; roles don't persist (Stage 10 can add role to localStorage if desired)

**Deliverable:** Toggling to viewer mode makes app read-only. Edit buttons disappear for viewers.

---

## Stage 9 — Light / Dark Theme

**Branch:** `stage/9-theme`

Add a theme toggle with CSS variables.

**Tasks:**

- In `global.css` define CSS variables for both themes:

  ```css
  :root {
    --bg: #ffffff;
    --text: #111111;
    --card-bg: #f5f5f5;
    /* etc */
  }

  [data-theme="dark"] {
    --bg: #111111;
    --text: #f5f5f5;
    --card-bg: #1e1e1e;
  }
  ```

- In `ThemeContext.jsx`:
  - Context holds `theme` (`'light'` or `'dark'`) and `toggleTheme`
  - On toggle: update `document.documentElement.setAttribute('data-theme', theme)`
  - Persist preference to `localStorage`
- Wrap app in `<ThemeProvider>` in `main.jsx`
- Add a theme toggle button in `Navbar.jsx`
- Make sure all your component CSS uses `var(--bg)`, `var(--text)` etc instead of hardcoded colors

**Deliverable:** Theme toggle works and preference is remembered after refresh.

---

## Stage 10 — Polish & Deploy

**Branch:** `stage/10-deploy`

Final cleanup, documentation, and GitHub Pages deployment.

**Tasks:**

- Write comprehensive `README.md`:
  - What the app is and its purpose
  - Features: add/edit/hide/delete items, filter by category/status, search by title, light/dark theme, role simulation
  - How to run locally: `npm install && npm run dev`
  - Description of entities and category-specific fields (lab requirement)
  - Screenshots (optional but recommended)
  - Deployment instructions
  - Note: "Backend/API/JWT integration planned for Lab 7"
- Polish CSS:
  - Ensure responsive design (mobile-friendly)
  - Consistent spacing, typography, colors
  - Smooth transitions/animations (nice-to-have)
  - Intentional, polished look (not default)
- End-to-end testing:
  - Add item → appears in list ✓
  - Edit item → changes persist ✓
  - Hide item → disappears from grid (unless "Show Archived" checked) ✓
  - Unhide item → reappears ✓
  - Delete item → permanently removed ✓
  - Filter by category/status/search ✓
  - Empty state messages appear correctly ✓
  - Refresh page → all data persists ✓
  - Switch to viewer → no edit controls ✓
  - Toggle theme → persists after refresh ✓
  - All responsive on mobile/tablet ✓
- Deploy to GitHub Pages:
  - Install: `npm install --save-dev gh-pages`
  - Update `vite.config.js`: `base: '/your-repo-name/'`
  - Add scripts to `package.json`:
    ```json
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
    ```
  - Run `npm run deploy`
  - Test live URL works

**Deliverable:** App is live on GitHub Pages. Submit repo URL + live URL + PR links.

---

## Summary — PR Checklist

| Stage | Branch                  | Key Feature                                                             |
| ----- | ----------------------- | ----------------------------------------------------------------------- |
| 1     | `stage/1-setup`         | Clean project + folder structure                                        |
| 2     | `stage/2-ui-shell`      | Static layout, navbar, filter bar, cards, CSS variables, action buttons |
| 3     | `stage/3-reducer`       | Data model (with isHidden) + ADD/EDIT/HIDE/UNHIDE/DELETE actions        |
| 4     | `stage/4-item-display`  | Display items from state + empty state messages                         |
| 5     | `stage/5-edit-remove`   | Add/edit/hide/delete via reusable form with category-specific fields    |
| 6     | `stage/6-filter-search` | Filter by category/status, search by title, respect hidden items        |
| 7     | `stage/7-persistence`   | localStorage — survives refresh                                         |
| 8     | `stage/8-roles`         | Owner/viewer role toggle (prep for Lab 7 JWT)                           |
| 9     | `stage/9-theme`         | Light/dark theme with CSS variables + persistence                       |
| 10    | `stage/10-deploy`       | README + GitHub Pages deployment + end-to-end testing                   |

---

## Lab 6 Scope Boundaries

✅ **IN Lab 6:**

- Frontend-only React app
- localStorage for persistence
- useReducer + useContext for state management
- Client-side role toggle (simulation only)
- Light/dark theme with CSS variables
- Add/edit/hide/delete items
- Filter and search
- Category-specific form fields
- Empty state messages
- Responsive UI design

❌ **OUT of Lab 6 (defer to Lab 7):**

- Backend server / API endpoints
- JWT authentication
- Database
- Pagination (not needed for small local collection)
- API documentation / Swagger UI
- Real user authentication / login system
- Server-side role/permission validation
- API error handling / retry logic

**Lab 7 will replace:** localStorage → API calls, role toggle → JWT tokens, client-side simulation → real authentication.
