import { BrowserManager } from './browserManager';
import { LoginPage } from '../pages/loginPage';
import * as path from 'path';

export class AuthSessionManager {
  private sessionFile: string;

  constructor(private browserManager: BrowserManager, sessionFileName = 'auth.json') {
    this.sessionFile = path.resolve(sessionFileName);
  }

  async loginAndSaveSession(url: string, username: string, password: string): Promise<LoginPage> {
    const context = await this.browserManager.newContextWithAuth(username, password);
    const page = await context.newPage();
    await page.goto(url);
    await context.storageState({ path: this.sessionFile });
    return new LoginPage(this.browserManager.browser, context, page);
  }

  async useSavedSession(url: string): Promise<LoginPage> {
    const context = await this.browserManager.newContextFromStorage(this.sessionFile);
    const page = await context.newPage();
    await page.goto(url);
    return new LoginPage(this.browserManager.browser, context, page);
  }
}
