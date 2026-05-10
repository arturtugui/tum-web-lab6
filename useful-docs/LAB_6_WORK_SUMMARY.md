# Lab 6 — Personal Interest Tracker: Work Summary

## Project Overview

**Lab 6** is a **frontend-only** web application for tracking personal interests across 9 different categories. Users can add, edit, hide, and delete items from their collection, filter by category/status, search, and toggle between light/dark themes.

**Tech Stack:**

- **Framework:** React 19 + Vite (fast build/HMR)
- **State Management:** `useReducer` + `useContext` (no external libraries)
- **Styling:** CSS with CSS variables for theming
- **Storage:** localStorage (Lab 6), will be replaced with backend API (Lab 7)
- **Deployment:** GitHub Pages

**GitHub Repo:** `tum-web-lab6` (public)

---

## What's Been Completed

### ✅ Stage 1: Project Cleanup & Folder Structure

**Branch:** `stage/1-cleanup` | **Commit:** `chore: remove vite demo files and create folder structure`

**Tasks:**

- Removed Vite demo files (Vite logo SVG, welcome page, etc.)
- Created folder structure:
  - `src/components/` — React components
  - `src/context/` — Global state contexts
  - `src/reducers/` — Pure reducer functions
  - `src/styles/` — CSS files
  - `useful-docs/` — Documentation
- Set up git with proper commit message format

**Deliverable:** Clean project foundation ready for components.

---

### ✅ Stage 2: Layout & Visual Shell

**Branch:** `stage/2-ui-shell` | **Commit:** `feat: create UI shell with navbar, filters, and component placeholders`

**Tasks:**

#### 2.1 Navbar Component (`src/components/Navbar.jsx` + `.css`)

- **Visual elements:**
  - App title: "MyInterestsSS" (centered)
  - Add button (blue accent color)
  - Theme toggle button (moon icon for dark mode)
  - Role indicator button (user icon to show owner/viewer)
- **Layout:** Flexbox horizontal bar with space-between
- **Styling:** Uses CSS variables for colors (--accent, --card-bg, --text, etc.)
- **Status:** Complete, styled, ready for event handlers

#### 2.2 FilterBar Component (`src/components/FilterBar.jsx` + `.css`)

- **Elements:**
  - Category tabs (All, Movie, Series, Anime, Game, Manga, Comic, Book, Album, YouTube)
  - Status dropdown (All, Planned, In Progress, Completed, Dropped)
  - Search input field
- **Layout:** Horizontal layout with tab-like styling for categories
- **Status:** HTML structure complete, needs event handlers and active state styling

#### 2.3 ItemCard Component (`src/components/ItemCard.jsx` + `.css`)

- **Display:**
  - Image placeholder (gradient background)
  - Title text
  - Category badge (colored tag)
  - Status badge
  - Rating (if available)
  - Action buttons: Edit, Hide, Delete
- **Layout:** Card with image on top, info below
- **Status:** Template complete, needs props and event handlers

#### 2.4 ItemList Component (`src/components/ItemList.jsx` + `.css`)

- **Purpose:** Maps items array and renders ItemCard for each
- **Features:**
  - Empty state message when no items
  - Hidden items filtered out
  - Responsive grid layout
- **Status:** Component shell created, needs context connection

#### 2.5 ItemForm Component (`src/components/ItemForm.jsx` + `.css`)

- **Purpose:** Reusable form for adding/editing items (modal-based)
- **Features:**
  - Category selector dropdown
  - Dynamic fields based on selected category
  - Common fields: title, status, rating, notes, cover URL
  - Category-specific fields (genres, episodes, platform, author, etc.)
  - Submit and Cancel buttons
- **Status:** Structure defined, needs form state management

#### 2.6 ItemView Component (`src/components/ItemView.jsx` + `.css`)

- **Purpose:** Optional detail view showing full item information
- **Status:** Created but not prioritized for initial release

#### 2.7 Global Styles (`src/styles/global.css`)

- **Design System:**
  - Base font size: 18px
  - Spacing scale: rem-based (xs: 0.25rem, sm: 0.5rem, md: 1rem, lg: 1.5rem, xl: 2rem)
  - Color palette with CSS variables for light and dark themes
  - Typography: System font stack for cross-platform consistency
- **Status:** Design guidelines documented, file needs creation with full variable definitions

#### 2.8 Context Files (Empty Shells)

- `src/context/CollectionContext.jsx` — Global state for items collection
- `src/context/FilterContext.jsx` — Global state for active filters
- `src/context/ThemeContext.jsx` — Global state for light/dark theme
- `src/context/UIContext.jsx` — Global state for modal open/close
- **Status:** File structure created, implementation pending

#### 2.9 Reducer File (Empty Shell)

- `src/reducers/collectionReducer.js` — Action types and reducer logic
- **Status:** File created, logic pending

**Deliverable:** Complete visual layout with all UI components ready for logic implementation.

---

## Current Architecture

### Directory Structure

```
my-app/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              ✅ Complete with styling
│   │   ├── Navbar.css              ✅ Complete
│   │   ├── FilterBar.jsx           🔄 HTML only
│   │   ├── FilterBar.css           🔄 HTML only
│   │   ├── ItemCard.jsx            🔄 Template
│   │   ├── ItemCard.css            🔄 Template
│   │   ├── ItemList.jsx            🔄 Shell
│   │   ├── ItemList.css            🔄 Shell
│   │   ├── ItemForm.jsx            🔄 Shell
│   │   ├── ItemForm.css            🔄 Shell
│   │   ├── ItemView.jsx            🔄 Shell
│   │   └── ItemView.css            🔄 Shell
│   ├── context/
│   │   ├── CollectionContext.jsx   ⏳ Empty
│   │   ├── FilterContext.jsx       ⏳ Empty
│   │   ├── ThemeContext.jsx        ⏳ Empty
│   │   └── UIContext.jsx           ⏳ Empty
│   ├── reducers/
│   │   └── collectionReducer.js    ⏳ Empty
│   ├── styles/
│   │   ├── global.css              ⏳ Needs creation
│   │   └── App.css                 (existing)
│   ├── App.jsx                     🔄 Shell
│   └── main.jsx                    ✅ Imports global.css
└── public/
```

---

## Data Model

### Interest Item Structure

Each item in the collection has:

**Base Fields (all items):**

- `id` (string, UUID)
- `title` (string)
- `category` (enum: movie|series|anime|game|manga|comic|book|album|youtube)
- `status` (enum: planned|in_progress|completed|dropped)
- `rating` (number 1–10 or null)
- `coverUrl` (string, optional)
- `notes` (string, optional)
- `isHidden` (boolean, default: false)

**Category-Specific Fields:**

- **movie|series|anime:** `genres` (array), `episodes` (number)
- **game:** `platform` (string), `developer` (string)
- **manga|comic:** `author` (string), `chapters` (number)
- **book:** `author` (string), `pages` (number)
- **album:** `artist` (string), `year` (number)
- **youtube:** `channelUrl` (string), `uploadFrequency` (string)

### Collection State

```javascript
{
  items: [
    { id: "1", title: "Inception", category: "movie", ... },
    { id: "2", title: "Attack on Titan", category: "anime", ... },
    // ...
  ],
  isHidden: false  // Not exposed to user, computed when rendering
}
```

---

## Design System & Styling Guidelines

### CSS Variables Strategy

All styling uses **CSS custom properties** for easy light/dark theme switching.

**Color Palette (Light Theme):**

```css
:root {
  --accent: #007bff; /* Blue */
  --accent-hover: #0056b3; /* Darker blue */
  --success: #28a745; /* Green */
  --danger: #dc3545; /* Red */
  --warning: #ffc107; /* Yellow */
  --bg: #ffffff; /* White background */
  --card-bg: #f8f9fa; /* Light gray */
  --border: #e9ecef; /* Light border */
  --text: #212529; /* Dark text */
  --text-muted: #6c757d; /* Gray text */
}
```

**Color Palette (Dark Theme):**

```css
[data-theme="dark"] {
  --accent: #0d6efd;
  --accent-hover: #0b5ed7;
  --success: #198754;
  --danger: #dc3545;
  --warning: #ffc107;
  --bg: #1a1a1a;
  --card-bg: #2d2d2d;
  --border: #404040;
  --text: #f1f1f1;
  --text-muted: #a9a9a9;
}
```

**Spacing Scale (rem-based, font-size: 18px base):**

```css
--spacing-xs: 0.25rem; /* 4.5px */
--spacing-sm: 0.5rem; /* 9px */
--spacing-md: 1rem; /* 18px */
--spacing-lg: 1.5rem; /* 27px */
--spacing-xl: 2rem; /* 36px */
```

**Typography:**

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
font-size: 18px;
line-height: 1.5;
```

### Theme Implementation

- Light theme is default (`:root` variables)
- Dark theme triggered by `data-theme="dark"` attribute on `<html>` element
- Toggle button in Navbar switches theme via JavaScript
- Preference saved in localStorage as `theme-preference`

---

## State Management Pattern

### Global Contexts (implemented in Lab 6 Stage 3+)

**CollectionContext:**

- Holds: Current items array, collection actions
- Provider in: `App.jsx`
- Consumed by: ItemList, ItemForm, ItemCard

**FilterContext:**

- Holds: Active category tab, status filter, search query
- Provider in: `App.jsx`
- Consumed by: FilterBar, ItemList

**ThemeContext:**

- Holds: Current theme ("light" | "dark")
- Provider in: `App.jsx`
- Consumed by: Navbar (for toggle button), `<html>` for theming

**UIContext:**

- Holds: Modal open/close state (add/edit forms), currently editing item
- Provider in: `App.jsx`
- Consumed by: Navbar (Add button), ItemForm (modal), ItemCard (Edit button)

### Reducer Pattern (collectionReducer.js)

Action types:

- `ADD_ITEM` — Add new item to collection
- `EDIT_ITEM` — Update existing item
- `HIDE_ITEM` — Toggle isHidden flag (soft delete)
- `UNHIDE_ITEM` — Reverse soft delete
- `DELETE_ITEM` — Permanently remove item
- `LOAD_FROM_STORAGE` — Hydrate collection from localStorage on app load

---

## What's Next (Remaining Stages)

### Lab 6 Remaining Work (14 stages total)

| Stage  | Tasks                                                               | Est. Complexity |
| ------ | ------------------------------------------------------------------- | --------------- |
| **3**  | Implement collectionReducer.js with all action types                | Medium          |
| **4**  | Wire ItemList + ItemCard to CollectionContext, add empty states     | Medium          |
| **5**  | Implement Add/Edit forms, wire CRUD buttons, show success feedback  | Hard            |
| **6**  | Implement FilterBar filtering + search functionality                | Medium          |
| **7**  | Implement localStorage persistence (save/load on dispatch)          | Easy            |
| **9**  | Implement light/dark theme toggle with ThemeContext                 | Easy            |
| **10** | Polish UI, accessibility, responsive design, GitHub Pages deploy    | Medium          |
| **11** | Replace localStorage with backend API calls (Stage 11, after Lab 7) | Hard            |
| **12** | Final deployment with API integration (Stage 12, after Lab 7)       | Easy            |

### Lab 7 Backend (will be in separate repo)

- Express.js server with JWT authentication
- CRUD REST API endpoints
- In-memory data store (swappable for MongoDB later)
- Swagger UI documentation
- Docker containerization
- CORS configuration

---

## Git Workflow

**Branch Naming:** `stage/N-description`

- Example: `stage/3-reducer`, `stage/4-item-display`

**Commit Messages:**

- `feat:` — New feature (e.g., `feat: implement collection reducer`)
- `fix:` — Bug fix
- `refactor:` — Code reorganization
- `docs:` — Documentation updates
- `chore:` — Tooling, setup (e.g., `chore: remove vite demo files`)

**Process:**

1. Create feature branch: `git checkout -b stage/N-description`
2. Make changes, test locally
3. Commit with proper message format
4. Push to GitHub: `git push origin stage/N-description`
5. Create Pull Request (optional, can squash-merge)

---

## Key Decisions Made

1. **No External State Management:** Using `useReducer + useContext` to keep dependencies minimal
2. **CSS Variables for Theming:** Enables instant theme switching without component re-renders
3. **localStorage for Lab 6:** Keeps frontend isolated; will be replaced with API in Lab 7
4. **Separate Repos:** Lab 6 (frontend) and Lab 7 (backend) in different repositories for clean git history
5. **Role Simulation in Lab 6:** Toggle button simulates owner/viewer; real JWT roles in Lab 7

---

## Notes for Extending/Modifying

### Adding a New Category

1. Add category to allowed enum in `collectionReducer.js`
2. Add category-specific fields to the item template in `ItemForm.jsx`
3. Add category tab to `FilterBar.jsx`
4. Add category styling (badge color) in `ItemCard.css`

### Changing Color Scheme

- Edit CSS variables in `global.css` (both `:root` and `[data-theme="dark"]`)
- No component changes needed; all use `var(--color-name)`

### Responsive Design

- Use `@media (max-width: 768px)` in component CSS files
- Spacing scale already uses rem, so responsive font-size changes affect all calculations
- Grid layout in ItemList should switch to stacked column on mobile

---

## Testing Checklist (Before Deployment)

- [ ] All CRUD operations work (add, edit, hide, delete)
- [ ] Filters and search produce correct results
- [ ] localStorage persists data across page reloads
- [ ] Theme toggle switches instantly and persists preference
- [ ] Empty states display when no items match filters
- [ ] Mobile layout is responsive and readable
- [ ] All category types display their specific fields
- [ ] Keyboard navigation works (Tab, Enter, Esc)
- [ ] Lighthouse score > 90

---

## Useful Documentation Files

- `LAB_6_CONDITION.md` — Original Lab 6 requirements
- `LAB_6_THEORY.md` — Concepts and best practices
- `ROADMAP.md` — Stage-by-stage breakdown with tasks
- `CONCEPTS.md` — React, CSS, git, and design patterns used
- `IDEA.md` — Original project idea and vision
- `COMMIT_BRANCH_NAMING.md` — Git conventions
