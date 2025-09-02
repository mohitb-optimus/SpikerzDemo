# Spikerz Demo Assessment with Playwright and Typescript

This project is a Playwright + TypeScript test automation framework with session management and Allure reporting.

## Features

- Playwright test runner with TypeScript
- Session authentication using storage state (`auth.json`)
- Allure reporting integration
- Modular page object structure
- Environment variable support via `.env`

## Overview of Architectural Choices

✅ Playwright + TypeScript test runner: modern, fast E2E with type safety. Your config is centralized in playwright.config.ts.
✅ Session authentication via storage state: login state is persisted in auth.json, reducing repeated UI logins and speeding up suites.
✅ Modular Page Object Model (POM): page objects live under tests/pages/, with shared core utilities under tests/core/ for reuse and maintainability.
✅ Environment-driven configuration: .env variables (exposed through tests/utils/env.ts) allow easy switching across environments without code edits.
✅ Dual reporting: Playwright’s built-in HTML report for quick local debugging, plus Allure for rich, shareable, historical reporting.
✅ HTTP Basic Auth login management
✅ Reusable helpers (safeClick, safeFill, safeType, safeGoto, safeWaitForSelector, safeWaitForResponse)
✅ Dockerized test execution
✅ CI/CD via GitHub Actions
✅ Automatic report hosting on GitHub Pages

## Prerequisites

- Node.js 18+ (for local development)
- A valid Google/YouTube account
- Access to the Spikerz platform
- Docker

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

## Setup Instructions

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

## 🐳 Running with Docker

1️⃣ Build Docker Image

From project root:

```sh
docker build -t spikerzdemo .
```

2️⃣ Run Tests in Docker

Run all Playwright tests:

```sh
docker run --rm spikerzdemo
```

3️⃣ Save Reports to Host

To persist reports (playwright-report/, allure-report/):

```sh
docker run --rm \
  -v $(pwd)/test-results:/app/test-results \
  -v $(pwd)/allure-results:/app/allure-results \
  -v $(pwd)/allure-report:/app/allure-report \
  -v $(pwd)/playwright-report:/app/playwright-report \
  spikerzdemo
```

4️⃣ View Reports Locally

Playwright HTML report:

```sh
./playwright-report/index.html
```

Allure report:

```sh
./allure-report/index.html
```

## ⚡ CI/CD with GitHub Actions

GitHub Actions workflow (.github/workflows/tests.yml) will:

1. Build Docker image
2. Run Playwright tests inside container
3. Generate static Playwright + Allure reports
4. Upload reports as artifacts
5. Deploy reports to GitHub Pages

## 🌐 GitHub Pages Reports

After each CI/CD run, reports are available online:

- Playwright Report →
https://<`your-username`>.github.io/<`your-repo`>/playwright-report/

- Allure Report →
https://<`your-username`>.github.io/<`your-repo`>/allure-report/

Enable Pages:

- Repo → Settings → Pages → Source = gh-pages branch.

## Troubleshooting

- If the automation fails, check the API response for detailed error messages
- Verify that your environment variables are correctly set
- Ensure your Google account doesn't have 2FA enabled, or use an app password
