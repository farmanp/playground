const { test, expect } = require('@playwright/test');

test('debug JavaScript errors', async ({ page }) => {
  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Console error:', msg.text());
    }
  });
  
  // Listen for page errors
  page.on('pageerror', error => {
    console.log('Page error:', error.message);
  });
  
  await page.goto('file://' + __dirname + '/../data-structures/graph_playground.html');
  
  // Wait a bit for any errors to surface
  await page.waitForTimeout(2000);
  
  // Check if DOMContentLoaded fired
  const domReady = await page.evaluate(() => {
    return document.readyState === 'complete';
  });
  console.log('DOM ready:', domReady);
  
  // Check if playground is defined
  const playgroundDefined = await page.evaluate(() => {
    return typeof window.playground !== 'undefined';
  });
  console.log('Playground defined:', playgroundDefined);
  
  // Try to manually trigger DOMContentLoaded if needed
  if (!playgroundDefined) {
    await page.evaluate(() => {
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
    });
    
    await page.waitForTimeout(1000);
    
    const playgroundAfterManual = await page.evaluate(() => {
      return typeof window.playground !== 'undefined';
    });
    console.log('Playground after manual trigger:', playgroundAfterManual);
  }
});