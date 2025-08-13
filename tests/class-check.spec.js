const { test, expect } = require('@playwright/test');

test('check if classes are defined', async ({ page }) => {
  // Listen for all console messages
  page.on('console', msg => {
    console.log(`[${msg.type()}] ${msg.text()}`);
  });
  
  // Listen for errors
  page.on('pageerror', error => {
    console.log('Page error:', error.message);
    console.log('Stack:', error.stack);
  });
  
  await page.goto('file://' + __dirname + '/../data-structures/graph_playground.html');
  await page.waitForLoadState('domcontentloaded');
  
  // Check what's defined in the window
  const windowObjects = await page.evaluate(() => {
    const objects = {};
    objects.Graph = typeof Graph;
    objects.GraphPlayground = typeof GraphPlayground;
    objects.playground = typeof playground;
    objects.documentReady = document.readyState;
    
    // Check if there are any error elements or messages
    const errorElements = document.querySelectorAll('.error, .warning');
    objects.errorElements = errorElements.length;
    
    return objects;
  });
  
  console.log('Window objects:', windowObjects);
  
  // Try to create the classes manually
  const manualCreation = await page.evaluate(() => {
    try {
      if (typeof Graph !== 'undefined') {
        const graph = new Graph();
        return { Graph: 'created successfully' };
      }
      return { Graph: 'not defined' };
    } catch (error) {
      return { Graph: `error: ${error.message}` };
    }
  });
  
  console.log('Manual creation test:', manualCreation);
});