import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/', { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillEmail(email: string) {
    await this.page.waitForSelector('input[type="email"]', { timeout: 5000 });
    await this.page.fill('input[type="email"]', email);
  }

  async fillPassword(password: string) {
    await this.page.waitForSelector('input[type="password"]', { timeout: 5000 });
    await this.page.fill('input[type="password"]', password);
  }

  async clickLoginButton() {
    await this.page.waitForSelector('button:has-text("Login")', { timeout: 5000 });
    await this.page.click('button:has-text("Login")');
  }

  async clickRegisterLink() {
    await this.page.click('a:has-text("Register here")');
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  async waitForLoginSuccess() {
    // Wait for navigation to groups page or home
    await this.page.waitForURL(/.*groups|.*home|.*dashboard/, { timeout: 10000 });
  }

  async getErrorMessage() {
    try {
      return await this.page.textContent('div:has-text("Login failed")');
    } catch {
      return null;
    }
  }
}

export class RegisterPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/register', { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillName(name: string) {
    // Find name input - it's a text input
    const inputs = await this.page.locator('input[type="text"]');
    const count = await inputs.count();
    if (count > 0) {
      await inputs.first().fill(name);
    } else {
      await this.page.fill('input[placeholder*="name"], input[placeholder*="Name"]', name);
    }
  }

  async fillEmail(email: string) {
    await this.page.waitForSelector('input[type="email"]', { timeout: 5000 });
    await this.page.fill('input[type="email"]', email);
  }

  async fillPassword(password: string) {
    await this.page.waitForSelector('input[type="password"]', { timeout: 5000 });
    await this.page.fill('input[type="password"]', password);
  }

  async clickRegisterButton() {
    await this.page.waitForSelector('button:has-text("Register")', { timeout: 5000 });
    await this.page.click('button:has-text("Register")');
  }

  async register(name: string, email: string, password: string) {
    await this.fillName(name);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickRegisterButton();
  }

  async waitForRegistrationSuccess() {
    // Wait for navigation to login or groups page
    await this.page.waitForURL(/.*login|.*groups|.*home/, { timeout: 10000 });
  }
}

export class GroupsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/groups', { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickCreateGroupButton() {
    // First wait for button to exist
    await this.page.waitForSelector('button', { timeout: 5000 });
    // Find button that contains "Create Group" text or similar
    const buttons = await this.page.locator('button');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const text = await buttons.nth(i).textContent();
      if (text && (text.includes('Create') || text.includes('Group'))) {
        await buttons.nth(i).click();
        return;
      }
    }
    // Fallback
    await this.page.click('button:has-text("Create Group")');
  }

  async fillGroupName(name: string) {
    await this.page.waitForSelector('input', { timeout: 5000 });
    const inputs = await this.page.locator('input');
    if (await inputs.count() > 0) {
      await inputs.first().fill(name);
    } else {
      await this.page.fill('input[placeholder*="Group"], input[placeholder*="name"]', name);
    }
  }

  async clickCreateButtonInModal() {
    const buttons = await this.page.locator('button');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const text = await buttons.nth(i).textContent();
      if (text && text.trim() === 'Create') {
        await buttons.nth(i).click();
        return;
      }
    }
    // Fallback
    await this.page.click('button:has-text("Create")');
  }

  async createGroup(name: string) {
    await this.clickCreateGroupButton();
    await this.fillGroupName(name);
    await this.clickCreateButtonInModal();
  }

  async clickGroup(groupName: string) {
    await this.page.click(`text=${groupName}`);
  }

  async getGroupNames() {
    return await this.page.locator('h3, h2').allTextContents();
  }

  async waitForGroupsLoaded() {
    await this.page.waitForLoadState('networkidle');
  }
}

export class GroupDetailPage {
  constructor(private page: Page) {}

  async clickAddMemberButton() {
    // First wait for button to exist
    await this.page.waitForSelector('button', { timeout: 5000 });
    // Find button that contains "Add Member" or similar
    const buttons = await this.page.locator('button');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const text = await buttons.nth(i).textContent();
      if (text && (text.includes('Add') || text.includes('Member'))) {
        await buttons.nth(i).click();
        return;
      }
    }
    // Fallback
    await this.page.click('button:has-text("Add Member")');
  }

  async fillMemberEmail(email: string) {
    const inputs = await this.page.locator('input');
    if (await inputs.count() > 0) {
      await inputs.first().fill(email);
    } else {
      await this.page.fill('input[placeholder*="email"], input[placeholder*="Email"]', email);
    }
  }

  async clickAddMemberSubmit() {
    const buttons = await this.page.locator('button');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const text = await buttons.nth(i).textContent();
      if (text && text.trim() === 'Add') {
        await buttons.nth(i).click();
        return;
      }
    }
    // Fallback
    await this.page.click('button:has-text("Add")');
  }

  async addMember(email: string) {
    await this.clickAddMemberButton();
    await this.fillMemberEmail(email);
    await this.clickAddMemberSubmit();
  }

  async clickAddExpenseButton() {
    const buttons = await this.page.locator('button');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const text = await buttons.nth(i).textContent();
      if (text && text.includes('Expense')) {
        await buttons.nth(i).click();
        return;
      }
    }
    // Fallback
    await this.page.click('button:has-text("Add Expense")');
  }

  async fillExpenseDescription(description: string) {
    const inputs = await this.page.locator('input');
    if (await inputs.count() > 0) {
      await inputs.first().fill(description);
    } else {
      await this.page.fill('input[placeholder*="Description"]', description);
    }
  }

  async fillExpenseAmount(amount: string) {
    const inputs = await this.page.locator('input[type="number"]');
    if (await inputs.count() > 0) {
      await inputs.first().fill(amount);
    } else {
      await this.page.fill('input[placeholder*="Amount"]', amount);
    }
  }

  async selectPaidBy(name: string) {
    await this.page.click('select, [role="combobox"]');
    await this.page.click(`text=${name}`);
  }

  async selectMembers(names: string[]) {
    for (const name of names) {
      const checkbox = this.page.locator(`input[value="${name}"], label:has-text("${name}") input`);
      await checkbox.check();
    }
  }

  async clickAddExpenseSubmit() {
    await this.page.click('button:has-text("Add Expense")');
  }

  async addExpense(description: string, amount: string, paidBy: string, members: string[]) {
    await this.clickAddExpenseButton();
    await this.fillExpenseDescription(description);
    await this.fillExpenseAmount(amount);
    await this.selectPaidBy(paidBy);
    await this.selectMembers(members);
    await this.clickAddExpenseSubmit();
  }

  async getExpenseList() {
    return await this.page.locator('[data-testid="expense-item"]').allTextContents();
  }

  async getSettlementInfo() {
    return await this.page.locator('[data-testid="settlement"]').allTextContents();
  }

  async waitForExpensesLoaded() {
    await this.page.waitForLoadState('networkidle');
  }
}
