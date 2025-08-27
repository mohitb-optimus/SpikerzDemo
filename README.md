# Spikerz Demo Assessment with Playwright and Typescript

This project is a Playwright + TypeScript test automation framework with session management and Allure reporting.

## Features

- Playwright test runner with TypeScript
- Session authentication using storage state (`auth.json`)
- Allure reporting integration
- Modular page object structure
- Environment variable support via `.env`

## Project Structure

- `tests/` - Test specs, page objects, core utilities
- `playwright.config.ts` - Playwright configuration
- `auth.json` - Storage state for authentication/session
- `allure-report/` & `allure-results/` - Allure reporting output
- `playwright-report/` - Playwright HTML report output

## Scripts

| Command         | Description                              |
|-----------------|------------------------------------------|
| `npm test`      | Run all Playwright tests                 |
| `npm run test:headed` | Run tests in headed mode           |
| `npm run test:ui`     | Launch Playwright test UI          |
| `npm run build` | Compile TypeScript                      |
| `npm run clean` | Remove test and report output folders    |

## Setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Configure environment variables in `.env` (optional).

3. Run tests:

   ```sh
   npm test
   ```

## Reporting

- Allure results are generated in `allure-results/`:

1. Generate Allure Report

    ```sh
   npx allure generate ./allure-results --clean -o ./allure-report
   ```

2. Open Allure Report

   ```sh
   npx allure open ./allure-report
   ```

- HTML reports are in `playwright-report/`.

## Customization

- Update test credentials and URLs in [`tests/utils/env.ts`](tests/utils/env.ts).
- Add new page objects in [`tests/pages/`](tests/pages/).
- Extend session management in [`tests/core/`](tests/core/).

## Environment Variables

Create a .env.local file with the following variables:

DEMO_URL=<https://demo.spikerz.com>
DEMO_USERNAME=your_site_username
DEMO_PASSWORD=your_site_password
GMAIL_USER=your_google_email
GMAIL_PASSWORD=your_google_password
