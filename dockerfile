FROM mcr.microsoft.com/playwright:v1.47.2-focal

WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm install

COPY . .

# Install all browsers
RUN npx playwright install --with-deps

# Default command (headless by default, can be overridden in CI)
CMD ["npx", "playwright", "test", "--reporter=line,allure-playwright,html"]