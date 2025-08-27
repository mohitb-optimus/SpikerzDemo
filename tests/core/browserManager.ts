import { chromium, Browser, BrowserContext } from 'playwright';
import * as fs from 'fs';

export class BrowserManager {
  public browser!: Browser;

  async launch(headless = false) {
    this.browser = await chromium.launch({ headless });
  }

  async newContextWithAuth(username: string, password: string): Promise<BrowserContext> {
    return this.browser.newContext({
      httpCredentials: { username, password }
    });
  }

  async newContextFromStorage(path: string): Promise<BrowserContext> {
    return this.browser.newContext({
      storageState: fs.existsSync(path) ? path : undefined
    });
  }

  async close() {
    await this.browser.close();
  }
}