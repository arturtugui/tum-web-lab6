# Web Programming Laboratory 6 - Front-end

## Project Overview

**My Interests Collection** is a personal interest tracker web application where users can organize, categorize, and manage items of interest (movies, books, games, etc.). The app allows users to add items with details, filter by category and status, search by title, and toggle between light/dark themes.

**Stack:** React 19 + Vite

## Features

- ✅ **CRUD Operations**: Add, edit, view, delete, and hide items
- ✅ **Categorization**: 9 categories (Movies, Series, Anime, Games, Manga, Comics, Books, Albums, YouTube)
- ✅ **Status Tracking**: Planned, In Progress, Completed, Dropped
- ✅ **Filtering**: By category and status with combined filters
- ✅ **Search**: Real-time search by item title
- ✅ **Ratings**: Optional 1-10 rating system
- ✅ **Persistence**: localStorage auto-saves all data
- ✅ **Theme Toggle**: Light/dark mode with persistence
- ✅ **Item Details Modal**: View all item characteristics in a modal
- ✅ **Category-Specific Fields**: Dynamic fields based on item type (e.g., Genres for movies, Platform for games)

## State Management Architecture

### By Location

**Local State (useState)**:
- Menu visibility, form inputs, modal open/close states in individual components
- Used for UI interactions that don't need global access

**Global State (useContext)**:
- **CollectionContext**: Items array with CRUD operations via useReducer
- **UIContext**: Modal visibility, editing state, item viewing
- **FilterContext**: Active category, status, search text filters
- **ThemeContext**: Current theme (light/dark) with localStorage sync

### By Type

**Component Data** (local):
- Button menu state, form input fields - low frequency, component-level

**Domain Data** (global via CollectionContext):
- Items collection with full CRUD - accessed by multiple components, persisted

**UI State** (global via UIContext):
- Modal open/close, which item is being edited/viewed - affects navbar and cards

**Filtering State** (global via FilterContext):
- Active filters and search - used by ItemList to display filtered results

**Theme State** (global via ThemeContext):
- Light/dark preference - low frequency updates, app-wide styling

## Getting Started

```bash
# Install dependencies
cd my-app
npm install

# Start development server
npm run dev
```

Server runs on `http://localhost:5174/`

## Reset Data

To clear localStorage and reset to default items, run in browser console:
```javascript
localStorage.removeItem('pit-collection')
```
Then refresh the page.

## Project Links

- GitHub Pages: https://arturtugui.github.io/tum-web-lab6/
- Live Website: ...
