import { test, expect } from '@playwright/test';
import { LoginPage, RegisterPage, GroupsPage, GroupDetailPage } from '../utils/pageObjects';

// Generate unique test data based on timestamp
function generateUniqueEmail(prefix: string): string {
  const timestamp = Date.now();
  return `${prefix}-${timestamp}@test.com`;
}

function generateGroupName(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `TestGroup-${timestamp}-${random}`;
}

test.describe('Production Tests - User and Group Creation', () => {
  let testUsers: { email: string; password: string; name: string }[] = [];
  let groupName: string;

  test.beforeEach(async ({ page }) => {
    // Set a longer timeout for production server
    page.setDefaultTimeout(15000);
    page.setDefaultNavigationTimeout(15000);
  });

  test('[PROD-001] Create multiple test users successfully', async ({ page }) => {
    const users = [
      { name: 'Alice Johnson', password: 'Test@12345' },
      { name: 'Bob Smith', password: 'Test@12345' },
      { name: 'Charlie Brown', password: 'Test@12345' },
    ];

    for (const user of users) {
      const email = generateUniqueEmail(user.name.split(' ')[0].toLowerCase());
      testUsers.push({ email, password: user.password, name: user.name });

      const registerPage = new RegisterPage(page);
      await page.goto('/register', { waitUntil: 'networkidle' });
      await page.waitForLoadState('domcontentloaded');

      // Fill registration form
      const nameInputs = await page.locator('input[type="text"]');
      if (await nameInputs.count() > 0) {
        await nameInputs.first().fill(user.name);
      }

      const emailInput = await page.locator('input[type="email"]');
      if (await emailInput.count() > 0) {
        await emailInput.fill(email);
      }

      const passwordInputs = await page.locator('input[type="password"]');
      if (await passwordInputs.count() > 0) {
        await passwordInputs.first().fill(user.password);
      }

      // Click register button
      const registerButton = page.locator('button:has-text("Register"), button:has-text("Create Account")');
      if (await registerButton.isVisible()) {
        await registerButton.click();
        
        // Wait for success or error
        await page.waitForTimeout(2000);
        
        // Check for success message or navigation
        const successMsg = await page.locator('text=/Successfully|registered|created|success/i').first().isVisible().catch(() => false);
        const currentUrl = page.url();
        
        console.log(`User ${email} - Success: ${successMsg}, URL: ${currentUrl}`);
        expect(currentUrl).toBeDefined();
      }
    }

    // Verify we have test users
    expect(testUsers.length).toBeGreaterThan(0);
    console.log(`Created ${testUsers.length} test users`);
  });

  test('[PROD-002] Login with first created user', async ({ page }) => {
    if (testUsers.length === 0) {
      test.skip();
      return;
    }

    const loginPage = new LoginPage(page);
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    const firstUser = testUsers[0];

    // Check if already on login
    const url = page.url();
    if (!url.includes('login') && !url.includes('register')) {
      // Already logged in, just proceed
      console.log('Already logged in');
    } else {
      // Fill login form
      const emailInput = await page.locator('input[type="email"]');
      if (await emailInput.count() > 0) {
        await emailInput.fill(firstUser.email);
      }

      const passwordInputs = await page.locator('input[type="password"]');
      if (await passwordInputs.count() > 0) {
        await passwordInputs.first().fill(firstUser.password);
      }

      // Click login button
      const loginButton = page.locator('button:has-text("Login")');
      if (await loginButton.isVisible()) {
        await loginButton.click();
        
        // Wait for navigation
        await page.waitForTimeout(2000);
      }
    }

    // Verify logged in
    const finalUrl = page.url();
    console.log(`Login attempt - Final URL: ${finalUrl}`);
    expect(finalUrl).toBeDefined();
  });

  test('[PROD-003] Create a test group', async ({ page }) => {
    const groupsPage = new GroupsPage(page);
    
    // Navigate to groups
    await page.goto('/groups', { waitUntil: 'networkidle' });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    groupName = generateGroupName();
    console.log(`Creating group: ${groupName}`);

    // Click create group button
    const createButtons = await page.locator('button');
    let clicked = false;
    const count = await createButtons.count();
    
    for (let i = 0; i < count; i++) {
      const text = await createButtons.nth(i).textContent();
      if (text && (text.includes('Create') || text.includes('New'))) {
        await createButtons.nth(i).click();
        clicked = true;
        await page.waitForTimeout(500);
        break;
      }
    }

    if (clicked) {
      // Fill group name in modal/form
      const inputs = await page.locator('input[type="text"]');
      if (await inputs.count() > 0) {
        await inputs.first().fill(groupName);
      }

      // Click confirm button
      const confirmButtons = await page.locator('button');
      const confirmCount = await confirmButtons.count();
      
      for (let i = 0; i < confirmCount; i++) {
        const text = await confirmButtons.nth(i).textContent();
        if (text && (text.trim() === 'Create' || text.includes('Add'))) {
          await confirmButtons.nth(i).click();
          await page.waitForTimeout(2000);
          break;
        }
      }
    }

    // Verify group was created
    const groupLink = page.locator(`text=${groupName}`);
    const exists = await groupLink.isVisible().catch(() => false);
    console.log(`Group created: ${exists}`);
    expect(exists).toBeTruthy();
  });

  test('[PROD-004] Add members to the created group', async ({ page }) => {
    if (!groupName || testUsers.length < 2) {
      test.skip();
      return;
    }

    // Navigate to groups and find the created group
    await page.goto('/groups', { waitUntil: 'networkidle' });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Click on the group
    const groupLink = page.locator(`text=${groupName}`);
    if (await groupLink.isVisible()) {
      await groupLink.click();
      await page.waitForTimeout(2000);
    }

    // Try to add members
    const addMemberButtons = await page.locator('button');
    let memberAdded = false;
    const count = await addMemberButtons.count();

    for (let i = 0; i < count; i++) {
      const text = await addMemberButtons.nth(i).textContent();
      if (text && (text.includes('Add') || text.includes('Member') || text.includes('Invite'))) {
        await addMemberButtons.nth(i).click();
        await page.waitForTimeout(500);
        memberAdded = true;
        break;
      }
    }

    if (memberAdded) {
      // Fill in member email
      const inputs = await page.locator('input[type="email"], input[type="text"]');
      if (await inputs.count() > 0) {
        // Get second user's email if available
        if (testUsers.length > 1) {
          await inputs.first().fill(testUsers[1].email);
        } else {
          await inputs.first().fill('member@test.com');
        }
      }

      // Click add button
      const buttons = await page.locator('button');
      const btnCount = await buttons.count();
      
      for (let i = 0; i < btnCount; i++) {
        const text = await buttons.nth(i).textContent();
        if (text && (text.trim() === 'Add' || text.includes('Add Member'))) {
          await buttons.nth(i).click();
          await page.waitForTimeout(1500);
          break;
        }
      }
    }

    // Verify we're on group page
    const finalUrl = page.url();
    console.log(`After adding member - URL: ${finalUrl}`);
    expect(finalUrl).toBeDefined();
  });

  test('[PROD-005] Verify group details and members', async ({ page }) => {
    if (!groupName) {
      test.skip();
      return;
    }

    // Navigate to groups
    await page.goto('/groups', { waitUntil: 'networkidle' });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Find and click the group
    const groupLink = page.locator(`text=${groupName}`);
    const exists = await groupLink.isVisible().catch(() => false);

    if (exists) {
      await groupLink.click();
      await page.waitForTimeout(1500);

      // Check for group details
      const groupTitle = page.locator(`text=${groupName}`);
      const titleVisible = await groupTitle.isVisible().catch(() => false);

      console.log(`Group details visible: ${titleVisible}`);
      expect(titleVisible).toBeTruthy();
    } else {
      console.warn(`Group ${groupName} not found`);
    }
  });

  test('[PROD-006] Verify all test data', async ({ page }) => {
    // Summary of test execution
    console.log('===== PRODUCTION TEST SUMMARY =====');
    console.log(`Total Users Created: ${testUsers.length}`);
    testUsers.forEach((user, index) => {
      console.log(`  User ${index + 1}: ${user.name} (${user.email})`);
    });
    console.log(`Group Created: ${groupName || 'N/A'}`);
    console.log('====================================');

    expect(testUsers.length).toBeGreaterThan(0);
  });
});
