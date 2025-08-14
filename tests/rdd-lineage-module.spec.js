// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('RDD Lineage Visualizer Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-eng/spark-shell.html');
    await page.waitForFunction(() => window.SparkLab);
    
    // Navigate to RDD Lineage module
    await page.locator('text=RDD Lineage').click();
    await page.waitForSelector('#rdd-dag-container');
  });

  test('should load RDD Lineage module', async ({ page }) => {
    // Check module title
    await expect(page.locator('h1')).toContainText('RDD Lineage Visualizer');
    
    // Check route tabs
    await expect(page.locator('[data-route="playground"]')).toBeVisible();
    await expect(page.locator('[data-route="challenges"]')).toBeVisible();
    await expect(page.locator('[data-route="examples"]')).toBeVisible();
    
    // Check main components
    await expect(page.locator('#rdd-dag-container')).toBeVisible();
    await expect(page.locator('#rdd-operations-panel')).toBeVisible();
    await expect(page.locator('#rdd-inspector-panel')).toBeVisible();
  });

  test('should display initial RDD', async ({ page }) => {
    // Check that initial RDD is created and displayed
    const dagContainer = page.locator('#rdd-dag-container');
    await expect(dagContainer).toBeVisible();
    
    // Check for SVG and initial RDD node
    const svg = page.locator('#rdd-dag-svg');
    await expect(svg).toBeVisible();
    
    // Check for RDD node in SVG
    const rddNode = page.locator('.rdd-node');
    await expect(rddNode).toBeVisible();
    
    // Check initial RDD text
    await expect(page.locator('.rdd-text')).toContainText('Initial Data');
  });

  test('should display transformation operations', async ({ page }) => {
    const operationsPanel = page.locator('#rdd-operations-panel');
    await expect(operationsPanel).toBeVisible();
    
    // Check for transformation operations
    await expect(page.locator('text=map')).toBeVisible();
    await expect(page.locator('text=filter')).toBeVisible();
    await expect(page.locator('text=flatMap')).toBeVisible();
    await expect(page.locator('text=groupByKey')).toBeVisible();
    await expect(page.locator('text=reduceByKey')).toBeVisible();
    await expect(page.locator('text=join')).toBeVisible();
    
    // Check operation styling (narrow vs wide)
    const mapButton = page.locator('.operation-btn:has-text("map")');
    await expect(mapButton).toHaveClass(/narrow/);
    
    const groupByKeyButton = page.locator('.operation-btn:has-text("groupByKey")');
    await expect(groupByKeyButton).toHaveClass(/wide/);
  });

  test('should show operation form when clicking operation', async ({ page }) => {
    // Click on map operation
    await page.locator('.operation-btn:has-text("map")').click();
    
    // Check that operation form appears
    const operationForm = page.locator('#operation-form');
    await expect(operationForm).toBeVisible();
    
    // Check form content
    await expect(page.locator('#operation-title')).toContainText('map');
    await expect(page.locator('#operation-type')).toContainText('narrow');
    await expect(page.locator('#operation-description')).toContainText('Transform each element using a function');
    
    // Check input fields
    await expect(page.locator('#operation-function')).toBeVisible();
    await expect(page.locator('#source-rdd')).toBeVisible();
    
    // Check action buttons
    await expect(page.locator('#apply-operation')).toBeVisible();
    await expect(page.locator('#cancel-operation')).toBeVisible();
  });

  test('should apply transformation operation', async ({ page }) => {
    // Click on map operation
    await page.locator('.operation-btn:has-text("map")').click();
    
    // Fill in function input
    await page.locator('#operation-function').fill('x => x * 2');
    
    // Apply operation
    await page.locator('#apply-operation').click();
    
    // Check that new RDD node is created
    const rddNodes = page.locator('.rdd-node');
    await expect(rddNodes).toHaveCount(2);
    
    // Check that edge is drawn between RDDs
    const rddEdge = page.locator('.rdd-edge');
    await expect(rddEdge).toBeVisible();
    
    // Check generated code
    const codeContent = page.locator('#code-content');
    await expect(codeContent).toContainText('map(x => x * 2)');
  });

  test('should display presets', async ({ page }) => {
    const presetsPanel = page.locator('#rdd-presets-panel');
    await expect(presetsPanel).toBeVisible();
    
    // Check preset buttons
    await expect(page.locator('text=Simple Transformations')).toBeVisible();
    await expect(page.locator('text=Key-Value Operations')).toBeVisible();
    await expect(page.locator('text=Join Operations')).toBeVisible();
    await expect(page.locator('text=Complex Pipeline')).toBeVisible();
  });

  test('should load complex pipeline preset', async ({ page }) => {
    // Click on complex pipeline preset
    await page.locator('text=Complex Pipeline').click();
    
    // Wait for multiple RDDs to be created
    await page.waitForFunction(() => {
      const nodes = document.querySelectorAll('.rdd-node');
      return nodes.length >= 4;
    });
    
    // Check that multiple RDD nodes exist
    const rddNodes = page.locator('.rdd-node');
    await expect(rddNodes).toHaveCount(4);
    
    // Check for multiple edges
    const rddEdges = page.locator('.rdd-edge');
    await expect(rddEdges).toHaveCount(3);
    
    // Check for wide transformation edge styling
    const wideEdge = page.locator('.rdd-edge.wide');
    await expect(wideEdge).toBeVisible();
  });

  test('should have working undo/redo functionality', async ({ page }) => {
    // Apply a transformation
    await page.locator('.operation-btn:has-text("map")').click();
    await page.locator('#apply-operation').click();
    
    // Check we have 2 RDDs
    await expect(page.locator('.rdd-node')).toHaveCount(2);
    
    // Click undo
    await page.locator('#rdd-undo').click();
    
    // Should be back to 1 RDD
    await expect(page.locator('.rdd-node')).toHaveCount(1);
    
    // Click redo
    await page.locator('#rdd-redo').click();
    
    // Should have 2 RDDs again
    await expect(page.locator('.rdd-node')).toHaveCount(2);
  });

  test('should select and inspect RDD nodes', async ({ page }) => {
    // Click on the initial RDD node
    await page.locator('.rdd-node').click();
    
    // Check that inspector shows RDD details
    const inspector = page.locator('#inspector-content');
    await expect(inspector).toContainText('rdd_0');
    await expect(inspector).toContainText('Initial Data');
    await expect(inspector).toContainText('parallelize');
    await expect(inspector).toContainText('4'); // partition count
    
    // Check that partition layout is shown
    await expect(page.locator('.partition-cell')).toHaveCount(4);
  });

  test('should switch between routes', async ({ page }) => {
    // Switch to challenges route
    await page.locator('[data-route="challenges"]').click();
    await expect(page.locator('[data-route="challenges"]')).toHaveClass(/active/);
    
    // Check challenge panel appears
    await expect(page.locator('#rdd-challenge-panel')).toBeVisible();
    await expect(page.locator('text=Learning Challenges')).toBeVisible();
    
    // Switch back to playground
    await page.locator('[data-route="playground"]').click();
    await expect(page.locator('[data-route="playground"]')).toHaveClass(/active/);
    await expect(page.locator('#rdd-challenge-panel')).not.toBeVisible();
  });

  test('should show and start challenges', async ({ page }) => {
    // Go to challenges
    await page.locator('[data-route="challenges"]').click();
    
    // Check challenge buttons exist
    await expect(page.locator('text=Basic Transformations')).toBeVisible();
    await expect(page.locator('text=Wide vs Narrow')).toBeVisible();
    await expect(page.locator('text=Optimization Challenge')).toBeVisible();
    
    // Start a challenge
    await page.locator('text=Basic Transformations').click();
    
    // Check challenge is active
    await expect(page.locator('.challenge-active')).toBeVisible();
    await expect(page.locator('text=In Progress')).toBeVisible();
    
    // Check challenge has hint and actions
    await expect(page.locator('.challenge-hint')).toBeVisible();
    await expect(page.locator('text=Check Solution')).toBeVisible();
    await expect(page.locator('text=Exit Challenge')).toBeVisible();
  });

  test('should reset lineage', async ({ page }) => {
    // Apply some transformations first
    await page.locator('.operation-btn:has-text("map")').click();
    await page.locator('#apply-operation').click();
    
    await page.locator('.operation-btn:has-text("filter")').click();
    await page.locator('#apply-operation').click();
    
    // Should have 3 RDDs now
    await expect(page.locator('.rdd-node')).toHaveCount(3);
    
    // Reset lineage
    await page.locator('#rdd-reset').click();
    
    // Should be back to 1 RDD
    await expect(page.locator('.rdd-node')).toHaveCount(1);
    await expect(page.locator('.rdd-text')).toContainText('Initial Data');
  });
});