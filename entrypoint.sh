#!/bin/bash
set -e

# Run Playwright tests with Allure + HTML reporting
npx playwright test --reporter=line,allure-playwright,html

# Generate static Playwright HTML report (no server, just files)
npx playwright show-report --output=playwright-report

# Generate static Allure report (no server, just files)
npx allure generate allure-results --clean -o allure-report
