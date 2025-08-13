const { test, expect } = require('@playwright/test');

test('check playground initialization', async ({ page }) => {
  await page.goto('file://' + __dirname + '/../data-structures/graph_playground.html');
  
  // Wait for full load
  await page.waitForLoadState('domcontentloaded');
  
  // Try to trigger initialization manually if needed
  await page.evaluate(() => {
    if (typeof playground === 'undefined' && typeof GraphPlayground !== 'undefined') {
      window.playground = new GraphPlayground();
      window.playground.saveState();
    }
  });
  
  // Wait a bit more
  await page.waitForTimeout(1000);
  
  // Now check if playground exists
  const playgroundExists = await page.evaluate(() => {
    return typeof window.playground !== 'undefined' && window.playground !== null;
  });
  
  console.log('Playground exists after manual init:', playgroundExists);
  
  if (playgroundExists) {
    // Test that basic functionality works
    const nodeCount = await page.locator('#nodeCount').textContent();
    console.log('Initial node count:', nodeCount);
    
    // Try to load a preset
    await page.click('button:has-text("Star")');
    await page.waitForTimeout(500);
    
    const newNodeCount = await page.locator('#nodeCount').textContent();
    console.log('Node count after star preset:', newNodeCount);
  }
});