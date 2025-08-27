import { Browser, BrowserContext, Page } from '@playwright/test';

export abstract class BasePage {
  protected browser: Browser;
  protected context: BrowserContext;
  protected page: Page;

  constructor(browser: Browser, context: BrowserContext, page: Page) {
    this.browser = browser;
    this.context = context;
    this.page = page;
  }
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  // Optionally: helper to close context or browser if needed
  async closeContext(): Promise<void> {
    await this.context.close();
  }

  async closeBrowser(): Promise<void> {
    await this.browser.close();
  }
}
