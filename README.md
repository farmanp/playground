# Playground
*Interactive coding visualizers with a focus on gentle learning and beautiful design*

A collection of educational tools that make computer science concepts accessible through visual, tactile experiences. Inspired by "feels engineering" - technology that serves human emotional needs alongside functional requirements.

## Categories

### 📊 **Data Structures**
Explore fundamental data structures through interactive visualizations.
- **Hash Tables** - [Hash Map Playground](data-structures/hash_playground.html) with 4 collision strategies
- *Coming soon: Trees, Graphs, Heaps, Stacks & Queues*

### 🧮 **Algorithms** 
Watch algorithms come to life with step-by-step animations.
- *Coming soon: Sorting, Searching, Graph Traversal, Dynamic Programming*

### 🏗️ **System Design**
Understand distributed systems through interactive diagrams.
- *Coming soon: Load Balancing, Caching, Microservices, Database Patterns*

### 🌐 **Web Fundamentals**
Master web development concepts with hands-on tools.
- **JavaScript Arrays** - [Array Methods Playground](web-fundamentals/array_playground.html)
- *Coming soon: DOM Manipulation, Event Systems, Async Patterns*

### 📐 **Math Visualization**
Mathematical concepts through visual exploration.
- *Coming soon: Graph Theory, Statistics, Linear Algebra, Calculus*

## Design Philosophy

Each playground follows these principles:

- **Gentle Learning**: No harsh errors or jarring transitions
- **Visual Intuition**: See concepts in action, not just read about them
- **Progressive Complexity**: Start simple, build understanding gradually
- **Accessibility First**: Keyboard navigation, screen readers, reduced motion
- **Emotional Connection**: Beautiful aesthetics that make learning joyful

## Quick Start

1. Browse to any category directory
2. Open the HTML file in your browser
3. No build tools or dependencies required - everything runs offline

## Contributing

Each playground is a self-contained HTML file with embedded CSS and JavaScript. This approach prioritizes:
- **Portability**: Works anywhere, no setup required
- **Simplicity**: Easy to modify and understand
- **Durability**: Won't break due to dependency changes

### Adding a New Playground

1. Choose the appropriate category directory
2. Create a single HTML file with embedded styles and scripts
3. Follow the existing naming pattern: `concept_playground.html`
4. Add documentation as `concept_README.md`
5. Update this main README with a link

### Design Guidelines

- Use soft, warm color palettes
- Implement smooth transitions (300-400ms)
- Provide audio feedback (muted by default)
- Support multiple themes (light/dark/high-contrast)
- Include comprehensive keyboard shortcuts
- Add ARIA labels and live regions for accessibility

## File Structure

```
playground/
├── README.md                    # This file
├── index.html                   # Navigation hub (planned)
├── prompts/                     # AI prompt templates
├── data-structures/             # Hash tables, trees, graphs
├── algorithms/                  # Sorting, searching, optimization
├── system-design/               # Distributed systems concepts
├── web-fundamentals/            # DOM, events, async patterns
└── math-visualization/          # Mathematical concepts
``` 
