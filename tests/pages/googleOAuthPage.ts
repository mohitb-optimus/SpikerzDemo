import { BasePage } from '../core/basePage';

export class GoogleOAuthPage extends BasePage {
  async login(email: string, password: string) {
    await this.page.fill('input[type="email"]', email);
    await this.page.click('button:has-text("Next")');
    await this.page.waitForSelector('input[type="password"]', { state: 'visible' });
    await this.page.fill('input[type="password"]', password);
    await this.page.click('button:has-text("Next")');
  }

  async acceptPermissions() {
    await this.page.waitForURL(/signin\/oauth\/v2\/consentsummary/, { timeout: 10000 });
    await this.page.getByRole('checkbox', { name: 'Select all' }).check();
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }
}
