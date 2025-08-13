const { test, expect } = require('@playwright/test');

test('check for JavaScript errors after fixes', async ({ page }) => {
  // Listen for console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
  });
  
  // Listen for errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push(`${error.message}\n${error.stack}`);
  });
  
  await page.goto('file://' + __dirname + '/../data-structures/graph_playground.html');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);
  
  // Try clicking node mode button
  console.log('=== Testing Node Mode ===');
  await page.click('#nodeMode');
  await page.waitForTimeout(100);
  
  // Try clicking on canvas
  console.log('=== Testing Canvas Click ===');
  const canvas = page.locator('#graphCanvas');
  await canvas.click({ position: { x: 200, y: 150 } });
  await page.waitForTimeout(100);
  
  // Try calling preset function directly
  console.log('=== Testing Preset Loading ===');
  await page.evaluate(() => {
    console.log('About to call loadPreset...');
    if (window.loadPreset) {
      window.loadPreset('star');
    } else if (window.playground && window.playground.loadPreset) {
      window.playground.loadPreset('star');
    } else {
      console.error('No loadPreset function found');
    }
  });
  
  await page.waitForTimeout(500);
  
  // Check final state
  const finalState = await page.evaluate(() => {
    return {
      playgroundExists: !!window.playground,
      nodeCount: window.playground ? window.playground.graph.nodes.size : 'N/A',
      edgeCount: window.playground ? window.playground.graph.edges.size : 'N/A',
      loadPresetExists: typeof window.loadPreset !== 'undefined',
      playgroundLoadPresetExists: window.playground && typeof window.playground.loadPreset === 'function'
    };
  });
  
  console.log('=== Final State ===');
  console.log(JSON.stringify(finalState, null, 2));
  
  console.log('=== Console Messages ===');
  consoleMessages.forEach(msg => console.log(msg));
  
  console.log('=== Page Errors ===');
  pageErrors.forEach(error => console.log(error));
});