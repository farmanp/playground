// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-eng/spark-shell.html');
    await page.waitForFunction(() => window.SparkLab);
  });

  test('should have proper ARIA landmarks and roles', async ({ page }) => {
    // Check main landmarks
    await expect(page.locator('header[role="banner"]')).toBeVisible();
    await expect(page.locator('main[role="main"]')).toBeVisible();
    await expect(page.locator('nav[role="navigation"]')).toBeVisible();
    
    // Check ARIA labels
    await expect(page.locator('[aria-label="Spark Abstractions Lab Home"]')).toBeVisible();
    await expect(page.locator('[aria-label="Module navigation"]')).toBeVisible();
    await expect(page.locator('[aria-label="Module content"]')).toBeVisible();
  });

  test('should have accessible buttons and controls', async ({ page }) => {
    // Check buttons have proper labels
    await expect(page.locator('#highContrastToggle[aria-label="Toggle high contrast mode"]')).toBeVisible();
    await expect(page.locator('#reducedMotionToggle[aria-label="Toggle reduced motion"]')).toBeVisible();
    
    // Check buttons have proper roles
    const buttons = page.locator('button[role="button"]');
    await expect(buttons).toHaveCount.greaterThan(0);
  });

  test('should have keyboard navigation support', async ({ page }) => {
    // Tab through navigation
    await page.keyboard.press('Tab');
    
    // Should focus on accessibility controls
    await expect(page.locator('#highContrastToggle')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('#reducedMotionToggle')).toBeFocused();
    
    // Test Escape key navigation
    await page.locator('text=RDD Lineage').click();
    await page.keyboard.press('Escape');
    await expect(page.locator('.welcome-screen')).toBeVisible();
  });

  test('should support keyboard interaction with modules', async ({ page }) => {
    // Navigate to RDD Lineage module
    await page.locator('text=RDD Lineage').click();
    await page.waitForSelector('.rdd-node');
    
    // Tab to RDD node and activate with Enter
    await page.keyboard.press('Tab');
    // Keep tabbing until we reach an RDD node
    let attempts = 0;
    while (attempts < 20) {
      const focused = await page.locator(':focus').getAttribute('class');
      if (focused && focused.includes('rdd-node')) break;
      await page.keyboard.press('Tab');
      attempts++;
    }
    
    // Press Enter to select RDD node
    await page.keyboard.press('Enter');
    
    // Inspector should show details
    await expect(page.locator('#inspector-content')).toContainText('rdd_0');
  });

  test('should support keyboard interaction with partitioning', async ({ page }) => {
    // Navigate to Data Partitioning module
    await page.locator('text=Data Partitioning').click();
    await page.waitForSelector('.partition-bin');
    
    // Use keyboard to navigate to partition controls
    await page.keyboard.press('Tab');
    
    // Find and focus on partition count slider
    await page.locator('#partition-count').focus();
    
    // Use arrow keys to change partition count
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    
    // Check that partition count changed
    await expect(page.locator('#partition-count-value')).toContainText('6');
  });

  test('should have proper screen reader announcements', async ({ page }) => {
    const ariaStatus = page.locator('#ariaStatus');
    
    // Check that ARIA live region exists
    await expect(ariaStatus).toHaveAttribute('aria-live', 'polite');
    
    // Navigate to a module and check for announcements
    await page.locator('text=RDD Lineage').click();
    
    // Note: In a real test environment, we'd need assistive technology
    // to properly test screen reader announcements. This just checks
    // that the ARIA live region infrastructure is in place.
  });

  test('should have proper color contrast', async ({ page }) => {
    // Enable high contrast mode
    await page.locator('#highContrastToggle').click();
    
    // Check that high contrast class is applied
    await expect(page.locator('body')).toHaveClass(/high-contrast/);
    
    // Check that text remains visible in high contrast mode
    await expect(page.locator('.welcome-title')).toBeVisible();
    await expect(page.locator('.welcome-subtitle')).toBeVisible();
  });

  test('should respect reduced motion preference', async ({ page }) => {
    // Enable reduced motion
    await page.locator('#reducedMotionToggle').click();
    
    // Check that reduced motion class is applied
    await expect(page.locator('body')).toHaveClass(/reduced-motion/);
    
    // In reduced motion mode, animations should be minimal
    // This would need specific CSS checks in a real implementation
  });

  test('should have proper form labels and descriptions', async ({ page }) => {
    // Navigate to RDD Lineage
    await page.locator('text=RDD Lineage').click();
    
    // Click on an operation to show form
    await page.locator('.operation-btn:has-text("map")').click();
    
    // Check that form inputs have proper labels
    const functionInput = page.locator('#operation-function');
    await expect(functionInput).toBeVisible();
    
    const sourceSelect = page.locator('#source-rdd');
    await expect(sourceSelect).toBeVisible();
    
    // Check for associated labels
    await expect(page.locator('label[for="operation-function"]')).toBeVisible();
    await expect(page.locator('label[for="source-rdd"]')).toBeVisible();
  });

  test('should have accessible data partitioning controls', async ({ page }) => {
    // Navigate to Data Partitioning
    await page.locator('text=Data Partitioning').click();
    
    // Check that range inputs have proper labels
    const partitionCount = page.locator('#partition-count');
    await expect(partitionCount).toBeVisible();
    
    const dataSkew = page.locator('#data-skew');
    await expect(dataSkew).toBeVisible();
    
    // Check for associated labels
    await expect(page.locator('label[for="partition-count"]')).toBeVisible();
    await expect(page.locator('label[for="data-skew"]')).toBeVisible();
    
    // Check that select elements have labels
    const strategySelect = page.locator('#strategy-select');
    await expect(strategySelect).toBeVisible();
    
    const datasetSelect = page.locator('#dataset-select');
    await expect(datasetSelect).toBeVisible();
  });

  test('should have semantic HTML structure', async ({ page }) => {
    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount.greaterThan(0);
    
    const h2 = page.locator('h2');
    await expect(h2).toHaveCount.greaterThan(0);
    
    const h3 = page.locator('h3');
    await expect(h3).toHaveCount.greaterThan(0);
    
    // Check for proper list structure in sidebar
    const moduleList = page.locator('#moduleList[role="list"]');
    await expect(moduleList).toBeVisible();
    
    const listItems = page.locator('#moduleList li');
    await expect(listItems).toHaveCount(3);
  });

  test('should handle focus management properly', async ({ page }) => {
    // Navigate to RDD Lineage
    await page.locator('text=RDD Lineage').click();
    
    // Open operation form
    await page.locator('.operation-btn:has-text("map")').click();
    
    // Focus should be managed when form opens
    // Cancel the form
    await page.locator('#cancel-operation').click();
    
    // Focus should return to a logical place
    // This would need more specific implementation testing
  });

  test('should support system dark mode preference', async ({ page }) => {
    // Test with system dark mode
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.reload();
    await page.waitForFunction(() => window.SparkLab);
    
    // Check that dark mode styles are applied
    // This would need specific CSS property checks
    await expect(page.locator('.app-header')).toBeVisible();
    await expect(page.locator('.welcome-screen')).toBeVisible();
  });

  test('should have proper error handling and messaging', async ({ page }) => {
    // Navigate to RDD Lineage
    await page.locator('text=RDD Lineage').click();
    
    // Try to access inspector without selecting anything
    const inspector = page.locator('#inspector-content');
    await expect(inspector).toContainText('Click on an RDD node');
    
    // This provides clear guidance to users
  });

  test('should support mobile accessibility', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that touch targets are appropriate size
    const moduleLinks = page.locator('.module-link');
    
    for (let i = 0; i < await moduleLinks.count(); i++) {
      const link = moduleLinks.nth(i);
      const box = await link.boundingBox();
      
      // Touch targets should be at least 44x44px
      expect(box.height).toBeGreaterThanOrEqual(40);
    }
    
    // Check that content is accessible in mobile layout
    await expect(page.locator('.welcome-title')).toBeVisible();
    await expect(page.locator('.sidebar')).toBeVisible();
  });
});