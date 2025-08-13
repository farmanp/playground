# Hash Map Playground

**A gentle, educational exploration of hash tables inspired by thatgamecompany's aesthetic philosophy.**

A single-file web application that teaches hash table fundamentals through soothing visuals, ambient interactions, and progressive discovery.

## Features

### 🎨 **"Feels Engineering" Design**
- **Soft gradients** and warm earth tones (sky, sand, ink color palette)
- **Gentle motion** with 350ms easing transitions
- **Floating particles** that drift across the canvas
- **Three themes**: calm (default), dark mode, and high-contrast
- **Audio cues** (muted by default) with sine wave chimes
- **Respectful of accessibility** - supports reduced motion and screen readers

### 🧠 **Educational Content**
- **Complete hash table implementation** with all major collision strategies:
  - Separate Chaining (linked lists in buckets)
  - Linear Probing (sequential search)
  - Quadratic Probing (i + k² sequence)
  - Double Hashing (secondary hash function)
- **Live visualization** of hash computation and probe sequences
- **Real-time statistics**: size, capacity, load factor, max depth, average comparisons
- **Concept cards** explaining hash functions, collisions, load factors, tombstones

### 🎯 **Interactive Learning**
- **5 Built-in challenges** with validators and auto-solutions:
  1. Basic insert/find operations
  2. Collision demonstration
  3. Load factor and resizing
  4. Quadratic probing patterns
  5. Tombstone mechanics in open addressing
- **Preset datasets**: uniform keys, collision-prone keys, anagrams
- **Code preview panel** showing exact JavaScript operations
- **Narration system** with gentle, encouraging language

### ⚙️ **Advanced Features**
- **40-step undo/redo** system with full state preservation
- **Automatic resizing** when load factor exceeds threshold (0.75 default)
- **Tombstone visualization** for deleted entries in open addressing
- **Flying hash animations** showing computation: `hash(key) % capacity = index`
- **Operation history** with timestamps
- **Keyboard shortcuts**: `i` (focus input), `c` (clear), `Ctrl+Z/Y` (undo/redo), `Esc` (reset)

### ♿ **Accessibility & Preferences**
- **Complete keyboard navigation** with proper focus management
- **ARIA live regions** for screen reader narration
- **High contrast mode** with stark black/white/blue palette
- **Reduced motion support** (respects `prefers-reduced-motion`)
- **Muted by default** audio with volume control

## Usage

Open `hash_playground.html` in any modern browser. No build tools or external dependencies required.

### Basic Operations
1. **Insert**: Enter a key (and optional value), click Insert or press Enter
2. **Find**: Enter a key, click Find to see the probe sequence
3. **Delete**: Enter a key, click Delete (creates tombstones in open addressing)

### Learning Flow
1. Start with **Separate Chaining** to understand basic hashing
2. Try the **"Uniform Keys"** preset to see good distribution
3. Switch to **Linear Probing** and use **"Naughty Keys"** to see clustering
4. Complete the **challenges** to deepen understanding
5. Experiment with **different hash seeds** to see distribution changes

### Advanced Exploration
- Watch **probe sequences** in different collision strategies
- Observe **load factor impact** on performance
- Study **tombstone behavior** in open addressing
- Analyze **code preview** to understand implementation details

## Why This Approach?

Traditional hash table tutorials often focus on complexity analysis and implementation details. This playground takes a different approach:

- **Emotional connection**: Gentle visuals and sounds create a calm learning environment
- **Visual intuition**: See the probe sequences and collision patterns in real-time  
- **Progressive complexity**: Start simple, build understanding gradually
- **Hands-on experimentation**: Learn by doing, not just reading
- **Respectful interaction**: No harsh error messages or jarring transitions

The design philosophy embraces what thatgamecompany calls "feels engineering" - technology that serves human emotional needs, not just functional requirements.

## Technical Details

- **Single HTML file** with embedded CSS and JavaScript
- **No external dependencies** - runs entirely offline
- **Responsive design** that works on desktop and mobile
- **Progressive enhancement** - core functionality works without JavaScript
- **Performance optimized** - handles 500+ items smoothly
- **Memory efficient** - maintains history with circular buffer

The hash function uses a DJB2-style algorithm with configurable seeds, and all collision strategies are implemented with proper edge case handling.

## Implementation Highlights

### Hash Function
```javascript
hash(key, seed = this.hashSeed) {
    let hash = seed;
    const str = String(key);
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}
```

### Collision Strategies
- **Chaining**: Each bucket maintains an array of key-value pairs
- **Linear Probing**: `index = (baseHash + i) % capacity`
- **Quadratic Probing**: `index = (baseHash + i²) % capacity`
- **Double Hashing**: `index = (baseHash + i * secondHash(key)) % capacity`

### State Management
Full application state is serializable for undo/redo functionality. Operations are recorded with probe sequences, comparison counts, and timing data for educational analysis.

## File Structure
```
hash_playground.html    # Complete application (HTML + CSS + JS)
hash_map_README.md     # This documentation
```

The entire application is contained in a single HTML file for maximum portability and offline usage.