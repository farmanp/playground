# Base Playground Prompt Template

## Goal
Create a single-page, self-contained web app (HTML/CSS/JS) that acts as an interactive playground for learning and experimenting with a specific technical concept or data structure.

## Requirements

### 1. Core Features
- **Visualization Panel:** Real-time visual representation of the concept (e.g., graph, table, memory slots, list) with animations for changes.
- **Controls Panel:**
  - User-selectable operations/methods relevant to the concept.
  - Dynamic input fields based on the chosen operation.
  - "Run" button that executes the operation and animates the change.
- **Code Preview:** Shows the exact code that would run (e.g., `arr.push(42)`), updating live with user inputs.
- **Inspector:** Displays internal state before and after operations (arrays, node links, hash buckets, etc.).
- **History & Undo/Redo:** Log of past operations with ability to restore previous states.
- **Presets:** Pre-configured example datasets or states for instant exploration.

### 2. Learning Layer
- **Mini-Challenges:** Guided exercises with hints, solutions, and auto-check logic.
- **Concept Cards:** Expandable sections explaining key ideas, pitfalls, and examples.
- **Tooltips & Docs:** Inline explanations for methods/operations (signature, complexity, behavior).
- **Complexity Notes:** Show average/worst time complexities for operations.

### 3. Behavior & UX
- **Animations:** Smooth, visually clear transitions when data changes.
- **Accessibility:** ARIA roles, keyboard navigation, high-contrast mode, reduced motion option.
- **Persistence:** Save user state, progress, and settings to localStorage.
- **Responsive Design:** Works well on desktop and mobile.

### 4. Technical Constraints
- No external libraries; pure HTML, CSS, and JavaScript.
- Runs offline in any modern browser.
- Entire app must be contained in a single HTML file.

### 5. Deliverables
- A complete, functional HTML file implementing all above requirements.
- Inline comments explaining major code sections.
- Collapsible README section in-app explaining how to use the playground.

## Instructions
- Generate the full HTML/CSS/JS in one file.
- Ensure the code is clean, modular (via functions or IIFE/classes), and easy to extend.
- Include sample data and at least 5 starter challenges relevant to the chosen concept.
