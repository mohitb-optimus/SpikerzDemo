FROM mcr.microsoft.com/playwright:v1.47.2-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN mkdir -p test-results allure-results playwright-report allure-report

RUN npx playwright install --with-deps

# Install Allure CLI globally
RUN npm install -g allure-commandline
