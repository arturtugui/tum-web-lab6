# Web Programming Laboratory 6 - Front-end

reminder: when presenting mention that you know that useContext should not be used for lists (my item lists), but for low frequency updates (as was mentioned in the course topic), but i decided to use only React built-ins because I have never wrote a react only project myself:

from theory
**Limitation:** Every `useContext` consumer re-renders when the context value changes — even if the specific piece of data it uses didn't change. Fine for low-frequency updates (theme, auth), problematic for high-frequency (forms, lists).

on top of that say that you actually had the idea that the list is a high freq one, but you asked Claude and Gemini and they both said that that is not the case, ask the prof

at the end say how would you handled the state if i were not using react built-ins based on what the professor listed here:

from theory:
## 10. When to Use What

- **Server data** (API calls, caching, loading states) → RTK Query, TanStack Query, SWR. Don't use Redux for this.
- **Global UI state** (modals, themes, auth) → Zustand / Pinia / Angular Signals service. Simple, no ceremony.
- **Complex domain logic** with many actors, audit trails, strict team contracts → Redux Toolkit / NgRx. The structure pays off.
- **Most apps in 2026** → combination of server-state library + small global store. Full Redux is often overkill.

