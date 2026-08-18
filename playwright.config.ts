import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './e2e',
  webServer: [
    { command: 'npm run dev', port: 5173, timeout: 30000, env: { VITE_AD_MOCK_TIMEOUT: '200' } },
    { command: 'npm run dev', port: 3000, cwd: 'server', timeout: 30000, env: { TEST_MODE: 'true' } }
  ],
  use: { baseURL: 'http://localhost:5173' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ]
});
