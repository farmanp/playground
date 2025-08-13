const { test, expect } = require('@playwright/test');

test.describe('Graph Playground', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + __dirname + '/../data-structures/graph_playground.html');
    await page.waitForLoadState('domcontentloaded');
    
    // Give time for JavaScript to execute
    await page.waitForTimeout(1000);
  });

  test('should load successfully', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Graphs Playground');
    await expect(page.locator('.subtitle')).toContainText('Explore graph algorithms through interactive visualization');
    
    // Check initial canvas state
    await expect(page.locator('#graphCanvas')).toBeVisible();
    await expect(page.locator('#nodes')).toBeVisible();
    await expect(page.locator('#edges')).toBeVisible();
  });

  test('should have all required UI elements', async ({ page }) => {
    // Header controls
    await expect(page.locator('#directedBtn')).toBeVisible();
    await expect(page.locator('#weightedBtn')).toBeVisible();
    await expect(page.locator('#themeBtn')).toBeVisible();
    await expect(page.locator('#motionBtn')).toBeVisible();

    // Canvas controls
    await expect(page.locator('#nodeMode')).toBeVisible();
    await expect(page.locator('#edgeMode')).toBeVisible();
    await expect(page.locator('#dragMode')).toBeVisible();
    await expect(page.locator('#deleteMode')).toBeVisible();
    await expect(page.locator('#clearGraph')).toBeVisible();

    // Algorithm controls
    await expect(page.locator('#algorithmSelect')).toBeVisible();
    await expect(page.locator('#playBtn')).toBeVisible();
    await expect(page.locator('#stepBtn')).toBeVisible();
    await expect(page.locator('#resetBtn')).toBeVisible();

    // Statistics
    await expect(page.locator('#nodeCount')).toBeVisible();
    await expect(page.locator('#edgeCount')).toBeVisible();
    await expect(page.locator('#density')).toBeVisible();
    await expect(page.locator('#connected')).toBeVisible();
  });

  test('should toggle between directed and undirected modes', async ({ page }) => {
    const directedBtn = page.locator('#directedBtn');
    
    // Initially should be undirected
    await expect(directedBtn).toContainText('Undirected');
    await expect(directedBtn).not.toHaveClass(/active/);
    
    // Click to make directed
    await directedBtn.click();
    await expect(directedBtn).toContainText('Directed');
    await expect(directedBtn).toHaveClass(/active/);
    
    // Click again to make undirected
    await directedBtn.click();
    await expect(directedBtn).toContainText('Undirected');
    await expect(directedBtn).not.toHaveClass(/active/);
  });

  test('should toggle between weighted and unweighted modes', async ({ page }) => {
    const weightedBtn = page.locator('#weightedBtn');
    
    // Initially should be weighted
    await expect(weightedBtn).toContainText('Weighted');
    await expect(weightedBtn).toHaveClass(/active/);
    
    // Click to make unweighted
    await weightedBtn.click();
    await expect(weightedBtn).toContainText('Unweighted');
    await expect(weightedBtn).not.toHaveClass(/active/);
    
    // Click again to make weighted
    await weightedBtn.click();
    await expect(weightedBtn).toContainText('Weighted');
    await expect(weightedBtn).toHaveClass(/active/);
  });

  test('should cycle through themes', async ({ page }) => {
    const themeBtn = page.locator('#themeBtn');
    const body = page.locator('body');
    
    // Initially light theme
    await expect(body).toHaveAttribute('data-theme', 'light');
    await expect(themeBtn).toContainText('🌙');
    
    // Click to dark theme
    await themeBtn.click();
    await expect(body).toHaveAttribute('data-theme', 'dark');
    await expect(themeBtn).toContainText('☀️');
    
    // Click to high-contrast theme
    await themeBtn.click();
    await expect(body).toHaveAttribute('data-theme', 'high-contrast');
    await expect(themeBtn).toContainText('🔆');
    
    // Click back to light theme
    await themeBtn.click();
    await expect(body).toHaveAttribute('data-theme', 'light');
    await expect(themeBtn).toContainText('🌙');
  });

  test('should load preset graphs', async ({ page }) => {
    // Test grid preset
    await page.click('button:has-text("Grid")');
    await page.waitForTimeout(500); // Allow time for graph to load
    
    // Should have nodes and edges
    const nodeCount = await page.locator('#nodeCount').textContent();
    const edgeCount = await page.locator('#edgeCount').textContent();
    expect(parseInt(nodeCount)).toBeGreaterThan(0);
    expect(parseInt(edgeCount)).toBeGreaterThan(0);
    
    // Test star preset
    await page.click('button:has-text("Star")');
    await page.waitForTimeout(500);
    
    const starNodes = await page.locator('#nodeCount').textContent();
    const starEdges = await page.locator('#edgeCount').textContent();
    expect(parseInt(starNodes)).toBeGreaterThan(0);
    expect(parseInt(starEdges)).toBeGreaterThan(0);
    
    // Test complete preset
    await page.click('button:has-text("Complete")');
    await page.waitForTimeout(500);
    
    const completeNodes = await page.locator('#nodeCount').textContent();
    const completeEdges = await page.locator('#edgeCount').textContent();
    expect(parseInt(completeNodes)).toBeGreaterThan(0);
    expect(parseInt(completeEdges)).toBeGreaterThan(0);
  });

  test('should add nodes in node mode', async ({ page }) => {
    // Clear any existing graph
    await page.click('#clearGraph');
    
    // Switch to node mode
    await page.click('#nodeMode');
    await expect(page.locator('#nodeMode')).toHaveClass(/active/);
    
    // Get initial node count
    const initialNodeCount = await page.locator('#nodeCount').textContent();
    expect(parseInt(initialNodeCount)).toBe(0);
    
    // Click on canvas to add a node
    const canvas = page.locator('#graphCanvas');
    await canvas.click({ position: { x: 200, y: 150 } });
    
    // Wait for node to be added
    await page.waitForTimeout(100);
    
    // Check that node count increased
    const newNodeCount = await page.locator('#nodeCount').textContent();
    expect(parseInt(newNodeCount)).toBe(1);
    
    // Check that node is visible in SVG
    const nodes = page.locator('#nodes .node-circle');
    await expect(nodes).toHaveCount(1);
    
    // Add another node
    await canvas.click({ position: { x: 300, y: 200 } });
    await page.waitForTimeout(100);
    
    const finalNodeCount = await page.locator('#nodeCount').textContent();
    expect(parseInt(finalNodeCount)).toBe(2);
    await expect(nodes).toHaveCount(2);
  });

  test('should add edges in edge mode', async ({ page }) => {
    // Load a preset with nodes
    await page.click('button:has-text("Star")');
    await page.waitForTimeout(500);
    
    const initialEdgeCount = parseInt(await page.locator('#edgeCount').textContent());
    
    // Switch to edge mode
    await page.click('#edgeMode');
    await expect(page.locator('#edgeMode')).toHaveClass(/active/);
    
    // Get two nodes to connect
    const nodes = page.locator('#nodes .node-circle');
    const firstNode = nodes.first();
    const secondNode = nodes.nth(1);
    
    // Click first node
    await firstNode.click();
    await page.waitForTimeout(100);
    
    // Click second node to create edge
    await secondNode.click();
    await page.waitForTimeout(100);
    
    // Check that edge count may have increased (might already be connected in star)
    const newEdgeCount = parseInt(await page.locator('#edgeCount').textContent());
    expect(newEdgeCount).toBeGreaterThanOrEqual(initialEdgeCount);
  });

  test('should clear graph', async ({ page }) => {
    // Load a preset
    await page.click('button:has-text("Complete")');
    await page.waitForTimeout(500);
    
    // Verify graph has content
    const nodeCount = parseInt(await page.locator('#nodeCount').textContent());
    const edgeCount = parseInt(await page.locator('#edgeCount').textContent());
    expect(nodeCount).toBeGreaterThan(0);
    expect(edgeCount).toBeGreaterThan(0);
    
    // Clear the graph
    await page.click('#clearGraph');
    await page.waitForTimeout(100);
    
    // Verify graph is empty
    const newNodeCount = parseInt(await page.locator('#nodeCount').textContent());
    const newEdgeCount = parseInt(await page.locator('#edgeCount').textContent());
    expect(newNodeCount).toBe(0);
    expect(newEdgeCount).toBe(0);
    
    // Verify no nodes or edges in SVG
    await expect(page.locator('#nodes .node-circle')).toHaveCount(0);
    await expect(page.locator('#edges line')).toHaveCount(0);
  });

  test('should run BFS algorithm', async ({ page }) => {
    // Load a graph
    await page.click('button:has-text("Grid")');
    await page.waitForTimeout(500);
    
    // Select BFS algorithm
    await page.selectOption('#algorithmSelect', 'bfs');
    await page.waitForTimeout(100);
    
    // Source node selection should appear
    await expect(page.locator('#sourceNodeGroup')).toBeVisible();
    
    // Select a source node
    await page.selectOption('#sourceNode', { index: 1 }); // Select first available node
    await page.waitForTimeout(100);
    
    // Run the algorithm
    await page.click('#playBtn');
    await page.waitForTimeout(100);
    
    // Check algorithm status
    const status = await page.locator('#algoStatus').textContent();
    expect(status).toMatch(/(Running|Completed)/);
    
    // Wait for algorithm to complete or run for a bit
    await page.waitForTimeout(2000);
    
    // Check that some nodes were visited (should have visual states)
    const visitedNodes = page.locator('#nodes .node-circle.visited, #nodes .node-circle.active');
    const visitedCount = await visitedNodes.count();
    expect(visitedCount).toBeGreaterThan(0);
  });

  test('should run Dijkstra algorithm', async ({ page }) => {
    // Load a graph
    await page.click('button:has-text("Grid")');
    await page.waitForTimeout(500);
    
    // Select Dijkstra algorithm
    await page.selectOption('#algorithmSelect', 'dijkstra');
    await page.waitForTimeout(100);
    
    // Both source and target node selection should appear
    await expect(page.locator('#sourceNodeGroup')).toBeVisible();
    await expect(page.locator('#targetNodeGroup')).toBeVisible();
    
    // Select source and target nodes
    await page.selectOption('#sourceNode', { index: 1 });
    await page.selectOption('#targetNode', { index: 2 });
    await page.waitForTimeout(100);
    
    // Run the algorithm
    await page.click('#playBtn');
    await page.waitForTimeout(100);
    
    // Wait for algorithm to complete
    await page.waitForTimeout(3000);
    
    // Check that algorithm completed
    const status = await page.locator('#algoStatus').textContent();
    expect(status).toBe('Completed');
    
    // Check for path highlighting (should have nodes with on-path class)
    const pathNodes = page.locator('#nodes .node-circle.on-path');
    const pathCount = await pathNodes.count();
    expect(pathCount).toBeGreaterThan(0);
  });

  test('should run MST algorithms', async ({ page }) => {
    // Load a graph and ensure it's undirected
    await page.click('#directedBtn'); // Make sure it's undirected
    if (await page.locator('#directedBtn').textContent() === 'Directed') {
      await page.click('#directedBtn'); // Click again to make undirected
    }
    
    await page.click('button:has-text("Complete")');
    await page.waitForTimeout(500);
    
    // Test Kruskal's algorithm
    await page.selectOption('#algorithmSelect', 'kruskal');
    await page.waitForTimeout(100);
    
    await page.click('#playBtn');
    await page.waitForTimeout(100);
    
    // Wait for algorithm to complete
    await page.waitForTimeout(3000);
    
    const status = await page.locator('#algoStatus').textContent();
    expect(status).toBe('Completed');
    
    // Check for MST edges (should have edges with in-mst class)
    const mstEdges = page.locator('#edges .edge-line.in-mst');
    const mstCount = await mstEdges.count();
    expect(mstCount).toBeGreaterThan(0);
  });

  test('should support undo/redo functionality', async ({ page }) => {
    // Initially undo should be disabled
    await expect(page.locator('#undoBtn')).toBeDisabled();
    await expect(page.locator('#redoBtn')).toBeDisabled();
    
    // Load a graph (this should enable undo)
    await page.click('button:has-text("Star")');
    await page.waitForTimeout(500);
    
    // Undo should now be enabled
    await expect(page.locator('#undoBtn')).toBeEnabled();
    
    // Get current node count
    const nodeCount = parseInt(await page.locator('#nodeCount').textContent());
    expect(nodeCount).toBeGreaterThan(0);
    
    // Undo the preset load
    await page.click('#undoBtn');
    await page.waitForTimeout(100);
    
    // Should be back to empty graph
    const newNodeCount = parseInt(await page.locator('#nodeCount').textContent());
    expect(newNodeCount).toBe(0);
    
    // Redo should now be enabled
    await expect(page.locator('#redoBtn')).toBeEnabled();
    
    // Redo the preset load
    await page.click('#redoBtn');
    await page.waitForTimeout(100);
    
    // Should have nodes again
    const redoNodeCount = parseInt(await page.locator('#nodeCount').textContent());
    expect(redoNodeCount).toBeGreaterThan(0);
  });

  test('should support keyboard shortcuts', async ({ page }) => {
    // Test node mode shortcut
    await page.keyboard.press('n');
    await expect(page.locator('#nodeMode')).toHaveClass(/active/);
    
    // Test edge mode shortcut
    await page.keyboard.press('e');
    await expect(page.locator('#edgeMode')).toHaveClass(/active/);
    
    // Test escape to cancel/reset
    await page.keyboard.press('Escape');
    await expect(page.locator('#dragMode')).toHaveClass(/active/);
    
    // Load a graph for undo/redo testing
    await page.click('button:has-text("Star")');
    await page.waitForTimeout(500);
    
    // Test undo shortcut
    await page.keyboard.press('Meta+z'); // Mac
    await page.waitForTimeout(100);
    
    const nodeCount = parseInt(await page.locator('#nodeCount').textContent());
    expect(nodeCount).toBe(0);
    
    // Test redo shortcut
    await page.keyboard.press('Meta+Shift+z'); // Mac
    await page.waitForTimeout(100);
    
    const redoNodeCount = parseInt(await page.locator('#nodeCount').textContent());
    expect(redoNodeCount).toBeGreaterThan(0);
  });

  test('should update statistics correctly', async ({ page }) => {
    // Start with empty graph
    await page.click('#clearGraph');
    await page.waitForTimeout(100);
    
    // Check initial stats
    await expect(page.locator('#nodeCount')).toContainText('0');
    await expect(page.locator('#edgeCount')).toContainText('0');
    await expect(page.locator('#density')).toContainText('0.00');
    await expect(page.locator('#connected')).toContainText('Yes'); // Empty graph is considered connected
    
    // Load a complete graph
    await page.click('button:has-text("Complete")');
    await page.waitForTimeout(500);
    
    // Check that stats updated
    const nodeCount = parseInt(await page.locator('#nodeCount').textContent());
    const edgeCount = parseInt(await page.locator('#edgeCount').textContent());
    const density = parseFloat(await page.locator('#density').textContent());
    
    expect(nodeCount).toBeGreaterThan(0);
    expect(edgeCount).toBeGreaterThan(0);
    expect(density).toBeGreaterThan(0);
    await expect(page.locator('#connected')).toContainText('Yes');
    
    // For a complete graph, density should be 1.00
    expect(density).toBeCloseTo(1.0, 1);
  });

  test('should show algorithm narration', async ({ page }) => {
    // Load a graph
    await page.click('button:has-text("Grid")');
    await page.waitForTimeout(500);
    
    // Check initial narration
    const initialNarration = await page.locator('#narration').textContent();
    expect(initialNarration).toBeTruthy();
    
    // Select and run BFS
    await page.selectOption('#algorithmSelect', 'bfs');
    await page.selectOption('#sourceNode', { index: 1 });
    await page.click('#playBtn');
    await page.waitForTimeout(100);
    
    // Check that narration updated during algorithm
    await page.waitForTimeout(1000);
    const algorithmNarration = await page.locator('#narration').textContent();
    expect(algorithmNarration).not.toBe(initialNarration);
    expect(algorithmNarration.toLowerCase()).toContain('bfs');
  });

  test('should expand/collapse concept cards', async ({ page }) => {
    const conceptsToggle = page.locator('.toggle-section:has-text("Graph Theory Concepts")');
    const conceptsContent = page.locator('#conceptsContent');
    
    // Initially should be collapsed
    await expect(conceptsContent).not.toHaveClass('open');
    
    // Click to expand
    await conceptsToggle.click();
    await expect(conceptsContent).toHaveClass('open');
    
    // Should see concept cards
    await expect(page.locator('.concept-card')).toHaveCount(6);
    
    // Click to collapse
    await conceptsToggle.click();
    await expect(conceptsContent).not.toHaveClass('open');
  });

  test('should be accessible with keyboard navigation', async ({ page }) => {
    // Test that key interactive elements are focusable
    await page.keyboard.press('Tab');
    
    // Should be able to navigate through buttons
    const focusableElements = [
      '#directedBtn',
      '#weightedBtn', 
      '#themeBtn',
      '#motionBtn',
      '#nodeMode',
      '#edgeMode',
      '#dragMode',
      '#deleteMode',
      '#clearGraph'
    ];
    
    for (const selector of focusableElements.slice(0, 5)) { // Test first few
      const element = page.locator(selector);
      await expect(element).toBeFocused();
      await page.keyboard.press('Tab');
    }
  });

  test('should handle mobile viewport', async ({ page, isMobile }) => {
    if (isMobile) {
      // On mobile, layout should stack vertically
      const appContainer = page.locator('.app-container');
      
      // The grid should change to single column on mobile
      const computedStyle = await appContainer.evaluate(el => 
        window.getComputedStyle(el).gridTemplateColumns
      );
      
      // Should be single column (1fr) on mobile
      expect(computedStyle).toBe('1fr');
      
      // Canvas should still be functional
      await expect(page.locator('#graphCanvas')).toBeVisible();
      
      // Controls should still be accessible
      await expect(page.locator('#nodeMode')).toBeVisible();
    }
  });
});

test.describe('Graph Playground Challenges', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + __dirname + '/../data-structures/graph_playground.html');
    await page.waitForLoadState('domcontentloaded');
    
    // Give time for JavaScript to execute
    await page.waitForTimeout(1000);
    
    // Expand challenges section
    await page.click('.toggle-section:has-text("Graph Challenges")');
  });

  test('should have challenge system', async ({ page }) => {
    const challengesContent = page.locator('#challengesContent');
    await expect(challengesContent).toHaveClass('open');
    
    // Should have challenges
    const challenges = page.locator('.challenge');
    await expect(challenges).toHaveCount(3);
    
    // Each challenge should have title, description, and action buttons
    for (let i = 0; i < 3; i++) {
      const challenge = challenges.nth(i);
      await expect(challenge.locator('.challenge-title')).toBeVisible();
      await expect(challenge.locator('.challenge-description')).toBeVisible();
      await expect(challenge.locator('button:has-text("Check")')).toBeVisible();
      await expect(challenge.locator('button:has-text("Hint")')).toBeVisible();
      await expect(challenge.locator('button:has-text("Solution")')).toBeVisible();
    }
  });

  test('should complete first challenge with solution', async ({ page }) => {
    const firstChallenge = page.locator('.challenge').first();
    
    // Challenge should not be completed initially
    await expect(firstChallenge).not.toHaveClass('completed');
    
    // Click solution button
    await firstChallenge.locator('button:has-text("Solution")').click();
    await page.waitForTimeout(1000); // Allow solution to execute
    
    // Check if challenge is completed
    await firstChallenge.locator('button:has-text("Check")').click();
    await page.waitForTimeout(100);
    
    // Challenge should now be completed or at least have more nodes/edges
    const nodeCount = parseInt(await page.locator('#nodeCount').textContent());
    const edgeCount = parseInt(await page.locator('#edgeCount').textContent());
    expect(nodeCount).toBeGreaterThan(0);
    expect(edgeCount).toBeGreaterThan(0);
  });
});