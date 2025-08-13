const { test, expect } = require('@playwright/test');

test('simple page load test', async ({ page }) => {
  await page.goto('file://' + __dirname + '/../data-structures/graph_playground.html');
  
  // Take a screenshot to see what's happening
  await page.screenshot({ path: 'test-screenshot.png' });
  
  // Check basic page elements
  const title = await page.title();
  console.log('Page title:', title);
  
  const h1 = await page.locator('h1').textContent();
  console.log('H1 text:', h1);
  
  // Check if playground object exists
  const playgroundExists = await page.evaluate(() => {
    return typeof window.playground !== 'undefined';
  });
  console.log('Playground object exists:', playgroundExists);
  
  // Check if canvas exists and is visible
  const canvasVisible = await page.locator('#graphCanvas').isVisible();
  console.log('Canvas visible:', canvasVisible);
  
  // Check if nodes group exists
  const nodesExists = await page.locator('#nodes').count();
  console.log('Nodes group count:', nodesExists);
  
  // Get nodes group attributes
  const nodesAttrs = await page.evaluate(() => {
    const nodes = document.getElementById('nodes');
    if (nodes) {
      return {
        tag: nodes.tagName,
        style: nodes.style.cssText,
        computed: window.getComputedStyle(nodes).display
      };
    }
    return null;
  });
  console.log('Nodes attributes:', nodesAttrs);
});