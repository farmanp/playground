const { test, expect } = require('@playwright/test');

test('test node creation and edge creation', async ({ page }) => {
  await page.goto('file://' + __dirname + '/../data-structures/graph_playground.html');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);
  
  // Clear any existing graph
  await page.evaluate(() => {
    if (window.playground) {
      window.playground.clearGraph();
    }
  });
  
  console.log('=== Testing Node Creation ===');
  
  // Switch to node mode
  await page.click('#nodeMode');
  await page.waitForTimeout(100);
  
  // Check initial state
  const initialState = await page.evaluate(() => {
    return {
      nodeCount: window.playground ? window.playground.graph.nodes.size : 0,
      mode: window.playground ? window.playground.mode : 'unknown'
    };
  });
  console.log('Initial state:', initialState);
  
  // Click on canvas to add a node
  const canvas = page.locator('#graphCanvas');
  await canvas.click({ position: { x: 200, y: 150 } });
  await page.waitForTimeout(100);
  
  // Check if node was added
  const afterFirstClick = await page.evaluate(() => {
    return {
      nodeCount: window.playground ? window.playground.graph.nodes.size : 0,
      nodes: window.playground ? Array.from(window.playground.graph.nodes.values()) : []
    };
  });
  console.log('After first click:', afterFirstClick);
  
  // Add another node
  await canvas.click({ position: { x: 300, y: 200 } });
  await page.waitForTimeout(100);
  
  const afterSecondClick = await page.evaluate(() => {
    return {
      nodeCount: window.playground ? window.playground.graph.nodes.size : 0
    };
  });
  console.log('After second click:', afterSecondClick);
  
  console.log('=== Testing Edge Creation ===');
  
  // Switch to edge mode
  await page.click('#edgeMode');
  await page.waitForTimeout(100);
  
  // Click on the two nodes to create an edge
  const nodes = page.locator('#nodes .node-circle');
  if (await nodes.count() >= 2) {
    await nodes.first().click();
    await page.waitForTimeout(100);
    await nodes.nth(1).click();
    await page.waitForTimeout(100);
    
    const afterEdgeCreation = await page.evaluate(() => {
      return {
        nodeCount: window.playground ? window.playground.graph.nodes.size : 0,
        edgeCount: window.playground ? window.playground.graph.edges.size : 0
      };
    });
    console.log('After edge creation:', afterEdgeCreation);
  }
  
  console.log('=== Testing Preset Loading ===');
  
  // Test preset loading
  await page.click('button:has-text("Star")');
  await page.waitForTimeout(500);
  
  const afterPreset = await page.evaluate(() => {
    return {
      nodeCount: window.playground ? window.playground.graph.nodes.size : 0,
      edgeCount: window.playground ? window.playground.graph.edges.size : 0
    };
  });
  console.log('After star preset:', afterPreset);
  
  // Check UI updates
  const uiNodeCount = await page.locator('#nodeCount').textContent();
  const uiEdgeCount = await page.locator('#edgeCount').textContent();
  console.log(`UI shows: ${uiNodeCount} nodes, ${uiEdgeCount} edges`);
});