import { Browser, BrowserContext } from '@playwright/test';

export class LoginManager {

  private context?: BrowserContext;
  private currentUser?: string;
  private currentPassword?: string;

  constructor(private browser: Browser) {}

  /**
   * Creates a new authenticated browser context using HTTP basic auth credentials.
   * @param username - login username
   * @param password - login password
   */
  async createContextWithCredentials(username: string, password: string): Promise<BrowserContext> {
    if (this.context && this.currentUser === username && this.currentPassword === password) {
      return this.context;
    }

    if (this.context) {
      await this.context.close();
    }

    this.context = await this.browser.newContext({
      httpCredentials: {
        username,
        password,
      },
    });

    this.currentUser = username;
    this.currentPassword = password;

    return this.context;
  }

  /**
   * Get the active context, if any.
   */
  getContext(): BrowserContext | undefined {
    return this.context;
  }

  /**
  * Check if an active context exists.
  */
  hasActiveContext(): boolean {
    return this.context !== undefined;
  }

  /**
   * Close the active context.
   */
  async closeContext() {
    if (this.context) {
      await this.context.close();
      this.context = undefined;
      this.currentUser = undefined;
      this.currentPassword = undefined;
    }
  }
}



