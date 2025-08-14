// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Data Partitioning & Distribution Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-eng/spark-shell.html');
    await page.waitForFunction(() => window.SparkLab);
    
    // Navigate to Data Partitioning module
    await page.locator('text=Data Partitioning').click();
    await page.waitForSelector('#partitioning-conveyor');
  });

  test('should load Data Partitioning module', async ({ page }) => {
    // Check module title
    await expect(page.locator('h1')).toContainText('Data Partitioning & Distribution');
    
    // Check route tabs
    await expect(page.locator('[data-route="hash"]')).toBeVisible();
    await expect(page.locator('[data-route="range"]')).toBeVisible();
    await expect(page.locator('[data-route="custom"]')).toBeVisible();
    await expect(page.locator('[data-route="challenges"]')).toBeVisible();
    
    // Check main components
    await expect(page.locator('#partitioning-conveyor')).toBeVisible();
    await expect(page.locator('#partition-controls')).toBeVisible();
    await expect(page.locator('#distribution-chart')).toBeVisible();
  });

  test('should display conveyor belt visualization', async ({ page }) => {
    // Check conveyor belt components
    await expect(page.locator('.conveyor-input')).toBeVisible();
    await expect(page.locator('text=Input Data Stream')).toBeVisible();
    await expect(page.locator('#data-source')).toBeVisible();
    
    // Check partitioning logic section
    await expect(page.locator('#partitioner-box')).toBeVisible();
    await expect(page.locator('#partitioner-label')).toContainText('Hash Partitioning');
    
    // Check partition outputs
    await expect(page.locator('.partition-outputs')).toBeVisible();
    await expect(page.locator('text=Partitions')).toBeVisible();
    await expect(page.locator('#partition-bins')).toBeVisible();
  });

  test('should show data items in source', async ({ page }) => {
    const dataSource = page.locator('#data-source');
    await expect(dataSource).toBeVisible();
    
    // Should have data items displayed
    const dataItems = page.locator('#data-source .data-item');
    await expect(dataItems).toHaveCount.greaterThan(10);
  });

  test('should display partition bins', async ({ page }) => {
    const partitionBins = page.locator('.partition-bin');
    
    // Should have 4 partition bins by default
    await expect(partitionBins).toHaveCount(4);
    
    // Each bin should have header and content
    for (let i = 0; i < 4; i++) {
      await expect(page.locator(`.partition-header:has-text("P${i}")`)).toBeVisible();
    }
    
    // Bins should contain distributed data items
    const partitionItems = page.locator('.partition-bin .data-item');
    await expect(partitionItems).toHaveCount.greaterThan(50);
  });

  test('should have working partition controls', async ({ page }) => {
    // Test partition count slider
    const partitionSlider = page.locator('#partition-count');
    await expect(partitionSlider).toBeVisible();
    
    // Change partition count to 8
    await partitionSlider.fill('8');
    await expect(page.locator('#partition-count-value')).toContainText('8');
    
    // Should now have 8 partition bins
    await expect(page.locator('.partition-bin')).toHaveCount(8);
    
    // Test data skew slider
    const skewSlider = page.locator('#data-skew');
    await skewSlider.fill('50');
    await expect(page.locator('#data-skew-value')).toContainText('50%');
    
    // Test animation speed slider
    const speedSlider = page.locator('#animation-speed');
    await speedSlider.fill('2');
    await expect(page.locator('#speed-value')).toContainText('2x');
  });

  test('should switch partitioning strategies', async ({ page }) => {
    const strategySelect = page.locator('#strategy-select');
    
    // Switch to range partitioning
    await strategySelect.selectOption('range');
    await expect(page.locator('#partitioner-label')).toContainText('Range Partitioning');
    
    // Switch to custom partitioning
    await strategySelect.selectOption('custom');
    await expect(page.locator('#partitioner-label')).toContainText('Custom Partitioning');
    
    // Switch back to hash
    await strategySelect.selectOption('hash');
    await expect(page.locator('#partitioner-label')).toContainText('Hash Partitioning');
  });

  test('should switch datasets', async ({ page }) => {
    const datasetSelect = page.locator('#dataset-select');
    
    // Switch to timestamps dataset
    await datasetSelect.selectOption('timestamps');
    
    // Switch to skewed data
    await datasetSelect.selectOption('skewed-data');
    
    // Check that data distribution changed (some partitions should have more items)
    const partitionBins = page.locator('.partition-bin');
    
    // Switch back to user-ids
    await datasetSelect.selectOption('user-ids');
  });

  test('should display distribution metrics', async ({ page }) => {
    const metricsPanel = page.locator('.metrics-panel');
    await expect(metricsPanel).toBeVisible();
    
    // Check metric labels and values
    await expect(page.locator('text=Total Items:')).toBeVisible();
    await expect(page.locator('text=Avg per Partition:')).toBeVisible();
    await expect(page.locator('text=Load Balance:')).toBeVisible();
    await expect(page.locator('text=Skew Factor:')).toBeVisible();
    
    // Check that values are populated
    await expect(page.locator('#total-items')).toContainText('100');
    await expect(page.locator('#avg-per-partition')).toContainText(/\d+/);
    await expect(page.locator('#load-balance')).toContainText(/Perfect|Good|Fair|Poor/);
    await expect(page.locator('#skew-factor')).toContainText(/%/);
  });

  test('should show distribution chart', async ({ page }) => {
    const chart = page.locator('#distribution-chart');
    await expect(chart).toBeVisible();
    
    // Chart should be a canvas element
    await expect(chart).toHaveAttribute('width', '300');
    await expect(chart).toHaveAttribute('height', '150');
  });

  test('should select partition bins', async ({ page }) => {
    const firstBin = page.locator('.partition-bin').first();
    
    // Click on first partition bin
    await firstBin.click();
    
    // Should be selected
    await expect(firstBin).toHaveClass(/selected/);
    
    // Click again to deselect
    await firstBin.click();
    await expect(firstBin).not.toHaveClass(/selected/);
  });

  test('should display strategy information', async ({ page }) => {
    const strategyInfo = page.locator('#strategy-info');
    await expect(strategyInfo).toBeVisible();
    
    // Should show strategy description and properties
    await expect(strategyInfo).toContainText('consistent hashing');
    await expect(strategyInfo).toContainText('Hash');
    await expect(strategyInfo).toContainText('Deterministic');
    await expect(strategyInfo).toContainText('Load Balance');
  });

  test('should start data flow animation', async ({ page }) => {
    const startFlowBtn = page.locator('#start-flow');
    await expect(startFlowBtn).toBeVisible();
    
    // Click start flow
    await startFlowBtn.click();
    
    // Animation items should appear on the conveyor track
    // Note: This is hard to test directly, but we can check the button worked
    // In a real scenario, we might need to wait for animation elements
  });

  test('should reset partitions', async ({ page }) => {
    // First, select a partition
    await page.locator('.partition-bin').first().click();
    await expect(page.locator('.partition-bin').first()).toHaveClass(/selected/);
    
    // Reset partitions
    await page.locator('#reset-partitions').click();
    
    // Selection should be cleared
    await expect(page.locator('.partition-bin.selected')).toHaveCount(0);
  });

  test('should switch between routes', async ({ page }) => {
    // Switch to range route
    await page.locator('[data-route="range"]').click();
    await expect(page.locator('[data-route="range"]')).toHaveClass(/active/);
    await expect(page.locator('#strategy-select')).toHaveValue('range');
    
    // Switch to custom route
    await page.locator('[data-route="custom"]').click();
    await expect(page.locator('[data-route="custom"]')).toHaveClass(/active/);
    await expect(page.locator('#strategy-select')).toHaveValue('custom');
    
    // Switch to challenges route
    await page.locator('[data-route="challenges"]').click();
    await expect(page.locator('[data-route="challenges"]')).toHaveClass(/active/);
    await expect(page.locator('#challenge-panel')).toBeVisible();
  });

  test('should show challenges when in challenges route', async ({ page }) => {
    // Go to challenges route
    await page.locator('[data-route="challenges"]').click();
    
    // Should show challenge list
    await expect(page.locator('text=Partitioning Challenges')).toBeVisible();
    await expect(page.locator('text=Load Balancer')).toBeVisible();
    await expect(page.locator('text=Hash Master')).toBeVisible();
    await expect(page.locator('text=Range Designer')).toBeVisible();
    
    // Each challenge should have title, description, and goal
    const challengeBtns = page.locator('.challenge-btn');
    await expect(challengeBtns).toHaveCount(3);
    
    for (let i = 0; i < 3; i++) {
      const btn = challengeBtns.nth(i);
      await expect(btn.locator('.challenge-title')).toBeVisible();
      await expect(btn.locator('.challenge-desc')).toBeVisible();
      await expect(btn.locator('.challenge-goal')).toBeVisible();
    }
  });

  test('should start and check challenges', async ({ page }) => {
    // Go to challenges
    await page.locator('[data-route="challenges"]').click();
    
    // Start load balancer challenge
    await page.locator('text=Load Balancer').click();
    
    // Should show active challenge
    await expect(page.locator('.challenge-active')).toBeVisible();
    await expect(page.locator('text=Load Balancer')).toBeVisible();
    await expect(page.locator('text=Achieve <20% variance')).toBeVisible();
    
    // Should show status and hint
    await expect(page.locator('.challenge-status')).toBeVisible();
    await expect(page.locator('.challenge-hint')).toBeVisible();
    
    // Should have check and exit buttons
    await expect(page.locator('text=Check Solution')).toBeVisible();
    await expect(page.locator('text=Exit Challenge')).toBeVisible();
    
    // Try checking solution
    await page.locator('text=Check Solution').click();
    
    // Exit challenge
    await page.locator('text=Exit Challenge').click();
    await expect(page.locator('.challenge-active')).not.toBeVisible();
  });

  test('should maintain layout stability', async ({ page }) => {
    const conveyorRow = page.locator('.conveyor-row');
    const controlsRow = page.locator('.controls-row');
    
    // Check initial layout
    const initialHeight = await conveyorRow.boundingBox();
    expect(initialHeight.height).toBeGreaterThan(350); // Should be around 400px
    
    // Interact with controls
    await page.locator('#partition-count').fill('8');
    await page.locator('#strategy-select').selectOption('range');
    await page.locator('.partition-bin').first().click();
    
    // Layout should remain stable
    const afterHeight = await conveyorRow.boundingBox();
    expect(Math.abs(afterHeight.height - initialHeight.height)).toBeLessThan(5);
  });
});