// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Spark Lab Smoke Tests', () => {
  test('should load the Spark Abstractions Lab and basic functionality', async ({ page }) => {
    // Navigate to the file directly
    const filePath = 'file://' + require('path').resolve(__dirname, '../data-eng/spark-shell.html');
    await page.goto(filePath);
    
    // Wait for the SparkLab to initialize
    await page.waitForFunction(() => typeof window.SparkLab !== 'undefined');
    
    // Check page title
    await expect(page).toHaveTitle('Spark Abstractions Lab');
    
    // Check main header
    await expect(page.locator('.app-title')).toContainText('Spark Abstractions Lab');
    
    // Check welcome screen is visible
    await expect(page.locator('.welcome-screen')).toBeVisible();
    await expect(page.locator('.welcome-title')).toContainText('Spark Abstractions Lab');
    
    console.log('✅ Main application loaded successfully');
  });

  test('should navigate to RDD Lineage module', async ({ page }) => {
    const filePath = 'file://' + require('path').resolve(__dirname, '../data-eng/spark-shell.html');
    await page.goto(filePath);
    await page.waitForFunction(() => typeof window.SparkLab !== 'undefined');
    
    // Navigate to RDD Lineage module
    await page.locator('text=RDD Lineage').click();
    await page.waitForSelector('#rdd-dag-container');
    
    // Check module title
    await expect(page.locator('h1')).toContainText('RDD Lineage Visualizer');
    
    // Check that initial RDD is created and displayed
    const svg = page.locator('#rdd-dag-svg');
    await expect(svg).toBeVisible();
    
    // Check for RDD node in SVG
    const rddNode = page.locator('.rdd-node');
    await expect(rddNode).toBeVisible();
    
    console.log('✅ RDD Lineage module loaded and displays initial RDD');
  });

  test('should navigate to Data Partitioning module', async ({ page }) => {
    const filePath = 'file://' + require('path').resolve(__dirname, '../data-eng/spark-shell.html');
    await page.goto(filePath);
    await page.waitForFunction(() => typeof window.SparkLab !== 'undefined');
    
    // Navigate to Data Partitioning module
    await page.locator('text=Data Partitioning').click();
    await page.waitForSelector('#partitioning-conveyor');
    
    // Check module title
    await expect(page.locator('h1')).toContainText('Data Partitioning & Distribution');
    
    // Check conveyor belt components
    await expect(page.locator('.conveyor-input')).toBeVisible();
    await expect(page.locator('#partitioner-box')).toBeVisible();
    await expect(page.locator('#partition-bins')).toBeVisible();
    
    // Should have 4 partition bins by default
    const partitionBins = page.locator('.partition-bin');
    await expect(partitionBins).toHaveCount(4);
    
    console.log('✅ Data Partitioning module loaded with conveyor belt visualization');
  });

  test('should apply RDD transformation', async ({ page }) => {
    const filePath = 'file://' + require('path').resolve(__dirname, '../data-eng/spark-shell.html');
    await page.goto(filePath);
    await page.waitForFunction(() => typeof window.SparkLab !== 'undefined');
    
    // Navigate to RDD Lineage
    await page.locator('text=RDD Lineage').click();
    await page.waitForSelector('#rdd-dag-container');
    
    // Click on map operation (first one that contains exactly "map")
    await page.locator('.operation-btn').filter({ hasText: /^map$/ }).click();
    
    // Check that operation form appears
    const operationForm = page.locator('#operation-form');
    await expect(operationForm).toBeVisible();
    
    // Apply operation
    await page.locator('#apply-operation').click();
    
    // Check that new RDD node is created
    const rddNodes = page.locator('.rdd-node');
    await expect(rddNodes).toHaveCount(2);
    
    // Check that edge is drawn between RDDs
    const rddEdge = page.locator('.rdd-edge');
    await expect(rddEdge).toBeVisible();
    
    console.log('✅ RDD transformation applied successfully');
  });

  test('should change partitioning strategy', async ({ page }) => {
    const filePath = 'file://' + require('path').resolve(__dirname, '../data-eng/spark-shell.html');
    await page.goto(filePath);
    await page.waitForFunction(() => typeof window.SparkLab !== 'undefined');
    
    // Navigate to Data Partitioning
    await page.locator('text=Data Partitioning').click();
    await page.waitForSelector('#partitioning-conveyor');
    
    // Initially should show Hash Partitioning
    await expect(page.locator('#partitioner-label')).toContainText('Hash Partitioning');
    
    // Switch to range partitioning
    await page.locator('#strategy-select').selectOption('range');
    await expect(page.locator('#partitioner-label')).toContainText('Range Partitioning');
    
    // Switch to custom partitioning
    await page.locator('#strategy-select').selectOption('custom');
    await expect(page.locator('#partitioner-label')).toContainText('Custom Partitioning');
    
    console.log('✅ Partitioning strategy switching works correctly');
  });

  test('should display distribution metrics', async ({ page }) => {
    const filePath = 'file://' + require('path').resolve(__dirname, '../data-eng/spark-shell.html');
    await page.goto(filePath);
    await page.waitForFunction(() => typeof window.SparkLab !== 'undefined');
    
    // Navigate to Data Partitioning
    await page.locator('text=Data Partitioning').click();
    await page.waitForSelector('#partitioning-conveyor');
    
    // Check metric labels and values (be more specific to avoid duplicates)
    await expect(page.locator('#partition-stats').locator('text=Total Items:')).toBeVisible();
    await expect(page.locator('#partition-stats').locator('text=Load Balance:')).toBeVisible();
    
    // Check that values are populated
    await expect(page.locator('#total-items')).toContainText('100');
    await expect(page.locator('#load-balance')).toContainText(/Perfect|Good|Fair|Poor/);
    
    // Check distribution chart exists
    const chart = page.locator('#distribution-chart');
    await expect(chart).toBeVisible();
    
    console.log('✅ Distribution metrics and chart display correctly');
  });

  test('should have working accessibility controls', async ({ page }) => {
    const filePath = 'file://' + require('path').resolve(__dirname, '../data-eng/spark-shell.html');
    await page.goto(filePath);
    await page.waitForFunction(() => typeof window.SparkLab !== 'undefined');
    
    const body = page.locator('body');
    const highContrastBtn = page.locator('#highContrastToggle');
    
    // Initially should not have high contrast
    await expect(body).not.toHaveClass(/high-contrast/);
    
    // Click to enable high contrast
    await highContrastBtn.click();
    await expect(body).toHaveClass(/high-contrast/);
    await expect(highContrastBtn).toHaveClass(/active/);
    
    // Test reduced motion toggle
    const reducedMotionBtn = page.locator('#reducedMotionToggle');
    await reducedMotionBtn.click();
    await expect(body).toHaveClass(/reduced-motion/);
    
    console.log('✅ Accessibility controls function correctly');
  });

  test('should load challenges', async ({ page }) => {
    const filePath = 'file://' + require('path').resolve(__dirname, '../data-eng/spark-shell.html');
    await page.goto(filePath);
    await page.waitForFunction(() => typeof window.SparkLab !== 'undefined');
    
    // Test RDD Lineage challenges
    await page.locator('text=RDD Lineage').click();
    await page.locator('[data-route="challenges"]').click();
    
    await expect(page.locator('text=Learning Challenges')).toBeVisible();
    await expect(page.locator('text=Basic Transformations')).toBeVisible();
    
    // Test Data Partitioning challenges
    await page.locator('text=Data Partitioning').click();
    await page.locator('[data-route="challenges"]').click();
    
    await expect(page.locator('text=Partitioning Challenges')).toBeVisible();
    await expect(page.locator('text=Load Balancer')).toBeVisible();
    
    console.log('✅ Challenge systems load correctly in both modules');
  });
});