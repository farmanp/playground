// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-eng/spark-shell.html');
    await page.waitForFunction(() => window.SparkLab);
  });

  test('should match welcome screen layout', async ({ page }) => {
    // Take screenshot of welcome screen
    await expect(page.locator('.welcome-screen')).toHaveScreenshot('welcome-screen.png');
  });

  test('should match RDD Lineage visualizer layout', async ({ page }) => {
    // Navigate to RDD Lineage
    await page.locator('text=RDD Lineage').click();
    await page.waitForSelector('#rdd-dag-container');
    
    // Wait for initial RDD to render
    await page.waitForSelector('.rdd-node');
    
    // Take screenshot of the full module
    await expect(page.locator('.rdd-lineage-container')).toHaveScreenshot('rdd-lineage-initial.png');
  });

  test('should match RDD DAG with transformations', async ({ page }) => {
    // Navigate to RDD Lineage
    await page.locator('text=RDD Lineage').click();
    await page.waitForSelector('#rdd-dag-container');
    
    // Apply map transformation
    await page.locator('.operation-btn:has-text("map")').click();
    await page.locator('#apply-operation').click();
    
    // Apply filter transformation
    await page.locator('.operation-btn:has-text("filter")').click();
    await page.locator('#apply-operation').click();
    
    // Wait for transformations to render
    await page.waitForFunction(() => document.querySelectorAll('.rdd-node').length === 3);
    
    // Take screenshot of DAG with transformations
    await expect(page.locator('#rdd-dag-container')).toHaveScreenshot('rdd-dag-transformations.png');
  });

  test('should match Data Partitioning conveyor belt', async ({ page }) => {
    // Navigate to Data Partitioning
    await page.locator('text=Data Partitioning').click();
    await page.waitForSelector('#partitioning-conveyor');
    
    // Wait for data to load and distribute
    await page.waitForSelector('.partition-bin .data-item');
    
    // Take screenshot of conveyor belt visualization
    await expect(page.locator('.conveyor-row')).toHaveScreenshot('partitioning-conveyor.png');
  });

  test('should match partition distribution chart', async ({ page }) => {
    // Navigate to Data Partitioning
    await page.locator('text=Data Partitioning').click();
    await page.waitForSelector('#distribution-chart');
    
    // Wait for chart to render
    await page.waitForTimeout(500);
    
    // Take screenshot of distribution chart
    await expect(page.locator('.partition-chart')).toHaveScreenshot('distribution-chart.png');
  });

  test('should match partitioning with different strategies', async ({ page }) => {
    // Navigate to Data Partitioning
    await page.locator('text=Data Partitioning').click();
    await page.waitForSelector('#partitioning-conveyor');
    
    // Switch to range partitioning
    await page.locator('#strategy-select').selectOption('range');
    await page.waitForTimeout(300);
    
    // Take screenshot with range partitioning
    await expect(page.locator('.partitioning-workspace')).toHaveScreenshot('partitioning-range.png');
    
    // Switch to custom partitioning
    await page.locator('#strategy-select').selectOption('custom');
    await page.waitForTimeout(300);
    
    // Take screenshot with custom partitioning
    await expect(page.locator('.partitioning-workspace')).toHaveScreenshot('partitioning-custom.png');
  });

  test('should match skewed data distribution', async ({ page }) => {
    // Navigate to Data Partitioning
    await page.locator('text=Data Partitioning').click();
    await page.waitForSelector('#partitioning-conveyor');
    
    // Switch to skewed dataset
    await page.locator('#dataset-select').selectOption('skewed-data');
    
    // Add some data skew
    await page.locator('#data-skew').fill('70');
    
    // Wait for redistribution
    await page.waitForTimeout(500);
    
    // Take screenshot showing skewed distribution
    await expect(page.locator('.partitioning-workspace')).toHaveScreenshot('partitioning-skewed.png');
  });

  test('should match challenge interface', async ({ page }) => {
    // Navigate to RDD Lineage challenges
    await page.locator('text=RDD Lineage').click();
    await page.locator('[data-route="challenges"]').click();
    
    // Take screenshot of challenge list
    await expect(page.locator('#rdd-challenge-panel')).toHaveScreenshot('rdd-challenges-list.png');
    
    // Start a challenge
    await page.locator('text=Basic Transformations').click();
    
    // Take screenshot of active challenge
    await expect(page.locator('#rdd-challenge-panel')).toHaveScreenshot('rdd-challenge-active.png');
  });

  test('should match partitioning challenges', async ({ page }) => {
    // Navigate to Data Partitioning challenges
    await page.locator('text=Data Partitioning').click();
    await page.locator('[data-route="challenges"]').click();
    
    // Take screenshot of partitioning challenge list
    await expect(page.locator('#challenge-panel')).toHaveScreenshot('partitioning-challenges-list.png');
    
    // Start load balancer challenge
    await page.locator('text=Load Balancer').click();
    
    // Take screenshot of active partitioning challenge
    await expect(page.locator('#challenge-panel')).toHaveScreenshot('partitioning-challenge-active.png');
  });

  test('should match dark mode appearance', async ({ page }) => {
    // Set dark mode preference
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.reload();
    await page.waitForFunction(() => window.SparkLab);
    
    // Take screenshot of welcome screen in dark mode
    await expect(page.locator('.welcome-screen')).toHaveScreenshot('welcome-screen-dark.png');
    
    // Navigate to RDD Lineage in dark mode
    await page.locator('text=RDD Lineage').click();
    await page.waitForSelector('#rdd-dag-container');
    
    // Take screenshot of RDD lineage in dark mode
    await expect(page.locator('.rdd-lineage-container')).toHaveScreenshot('rdd-lineage-dark.png');
  });

  test('should match high contrast mode', async ({ page }) => {
    // Enable high contrast mode
    await page.locator('#highContrastToggle').click();
    
    // Take screenshot of welcome screen in high contrast
    await expect(page.locator('.welcome-screen')).toHaveScreenshot('welcome-screen-high-contrast.png');
    
    // Navigate to Data Partitioning in high contrast
    await page.locator('text=Data Partitioning').click();
    await page.waitForSelector('#partitioning-conveyor');
    
    // Take screenshot of partitioning in high contrast
    await expect(page.locator('.partitioning-workspace')).toHaveScreenshot('partitioning-high-contrast.png');
  });

  test('should match responsive mobile layout', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Take screenshot of mobile welcome screen
    await expect(page.locator('.welcome-screen')).toHaveScreenshot('welcome-screen-mobile.png');
    
    // Navigate to RDD Lineage on mobile
    await page.locator('text=RDD Lineage').click();
    await page.waitForSelector('#rdd-dag-container');
    
    // Take screenshot of RDD lineage on mobile
    await expect(page.locator('.rdd-lineage-container')).toHaveScreenshot('rdd-lineage-mobile.png');
  });
});