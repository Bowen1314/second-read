// Local: serves app/ on 127.0.0.1:8962. Live smoke: BASE_URL=https://bowen1314.github.io/second-read/ npx playwright test --grep @smoke
import { defineConfig } from '@playwright/test';
const live = process.env.BASE_URL;
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30000,
  workers: 1,
  reporter: [['list']],
  use: { baseURL: live || 'http://127.0.0.1:8962/', browserName: 'chromium', viewport: { width: 1280, height: 800 } },
  webServer: live ? undefined : { command: 'python3 -m http.server 8962 --bind 127.0.0.1 --directory app', url: 'http://127.0.0.1:8962/', reuseExistingServer: true, stdout: 'ignore', stderr: 'ignore' },
});
