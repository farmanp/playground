// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Spark Abstractions Lab - Core Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-eng/spark-shell.html');
    // Wait for the SparkLab to initialize
    await page.waitForFunction(() => window.SparkLab);
  });

  test('should load the main application', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle('Spark Abstractions Lab');
    
    // Check main header
    await expect(page.locator('.app-title')).toContainText('Spark Abstractions Lab');
    
    // Check welcome screen is visible
    await expect(page.locator('.welcome-screen')).toBeVisible();
    await expect(page.locator('.welcome-title')).toContainText('Spark Abstractions Lab');
  });

  test('should have accessibility controls', async ({ page }) => {
    // Check high contrast toggle
    await expect(page.locator('#highContrastToggle')).toBeVisible();
    await expect(page.locator('#highContrastToggle')).toContainText('High Contrast');
    
    // Check reduced motion toggle
    await expect(page.locator('#reducedMotionToggle')).toBeVisible();
    await expect(page.locator('#reducedMotionToggle')).toContainText('Reduced Motion');
  });

  test('should toggle high contrast mode', async ({ page }) => {
    const body = page.locator('body');
    const highContrastBtn = page.locator('#highContrastToggle');
    
    // Initially should not have high contrast
    await expect(body).not.toHaveClass(/high-contrast/);
    
    // Click to enable high contrast
    await highContrastBtn.click();
    await expect(body).toHaveClass(/high-contrast/);
    await expect(highContrastBtn).toHaveClass(/active/);
    
    // Click again to disable
    await highContrastBtn.click();
    await expect(body).not.toHaveClass(/high-contrast/);
    await expect(highContrastBtn).not.toHaveClass(/active/);
  });

  test('should toggle reduced motion mode', async ({ page }) => {
    const body = page.locator('body');
    const reducedMotionBtn = page.locator('#reducedMotionToggle');
    
    // Initially should not have reduced motion
    await expect(body).not.toHaveClass(/reduced-motion/);
    
    // Click to enable reduced motion
    await reducedMotionBtn.click();
    await expect(body).toHaveClass(/reduced-motion/);
    await expect(reducedMotionBtn).toHaveClass(/active/);
    
    // Click again to disable
    await reducedMotionBtn.click();
    await expect(body).not.toHaveClass(/reduced-motion/);
    await expect(reducedMotionBtn).not.toHaveClass(/active/);
  });

  test('should display modules in sidebar', async ({ page }) => {
    const moduleList = page.locator('#moduleList');
    await expect(moduleList).toBeVisible();
    
    // Check that modules are registered and displayed
    const moduleItems = page.locator('.module-item');
    await expect(moduleItems).toHaveCount(3); // RDD Lineage, Data Partitioning, Shuffle Simulator
    
    // Check RDD Lineage module
    await expect(page.locator('text=RDD Lineage')).toBeVisible();
    await expect(page.locator('text=Visualize transformation dependencies')).toBeVisible();
    
    // Check Data Partitioning module  
    await expect(page.locator('text=Data Partitioning')).toBeVisible();
    await expect(page.locator('text=Visualize data distribution strategies')).toBeVisible();
    
    // Check Shuffle Operations module
    await expect(page.locator('text=Shuffle Operations')).toBeVisible();
    await expect(page.locator('text=Explore data movement patterns')).toBeVisible();
  });

  test('should navigate back to home with Escape key', async ({ page }) => {
    // Load a module first
    await page.locator('text=RDD Lineage').click();
    await expect(page.locator('.welcome-screen')).not.toBeVisible();
    
    // Press Escape to go home
    await page.keyboard.press('Escape');
    await expect(page.locator('.welcome-screen')).toBeVisible();
    await expect(page.url()).toMatch(/#$/);
  });

  test('should handle URL routing', async ({ page }) => {
    // Test direct navigation to module
    await page.goto('/data-eng/spark-shell.html#rdd-lineage');
    await expect(page.locator('.welcome-screen')).not.toBeVisible();
    await expect(page.locator('text=RDD Lineage Visualizer')).toBeVisible();
    
    // Test navigation to specific route
    await page.goto('/data-eng/spark-shell.html#data-partitioning/hash');
    await expect(page.locator('text=Data Partitioning & Distribution')).toBeVisible();
  });
});