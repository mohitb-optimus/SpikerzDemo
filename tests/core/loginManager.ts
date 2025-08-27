import { Browser, BrowserContext } from '@playwright/test';

export class LoginManager {
  private context?: BrowserContext;

  constructor(private browser: Browser) {}

  /**
   * Creates a new authenticated browser context using HTTP basic auth credentials.
   * @param username - login username
   * @param password - login password
   */
  async createContextWithCredentials(username: string, password: string): Promise<BrowserContext> {
    if (this.context) {
      await this.context.close();
    }
    this.context = await this.browser.newContext({
      httpCredentials: {
        username,
        password,
      },
    });
    return this.context;
  }

  async closeContext() {
    if (this.context) {
      await this.context.close();
      this.context = undefined;
    }
  }
}
