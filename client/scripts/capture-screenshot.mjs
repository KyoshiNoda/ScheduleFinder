import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const DEFAULT_URL = process.env.PLAYWRIGHT_URL || 'http://127.0.0.1:5173';
const DEFAULT_OUTPUT = process.env.PLAYWRIGHT_OUTPUT || 'playwright-artifacts/latest.png';
const DEFAULT_WIDTH = Number(process.env.PLAYWRIGHT_WIDTH || '1440');
const DEFAULT_HEIGHT = Number(process.env.PLAYWRIGHT_HEIGHT || '1024');
const DEFAULT_WAIT_MS = Number(process.env.PLAYWRIGHT_WAIT_MS || '1200');

const args = process.argv.slice(2);

const getArgValue = (flag) => {
  const index = args.indexOf(flag);
  return index === -1 ? undefined : args[index + 1];
};

const hasFlag = (flag) => args.includes(flag);

const requireValue = (flag, value) => {
  if (value === undefined || value.startsWith('--')) {
    throw new Error(`Missing value for ${flag}`);
  }

  return value;
};

const url = requireValue('--url', getArgValue('--url') ?? DEFAULT_URL);
const outputPath = requireValue('--out', getArgValue('--out') ?? DEFAULT_OUTPUT);
const selector = getArgValue('--selector');
const waitForUrl = getArgValue('--wait-for-url');
const width = Number(getArgValue('--width') ?? DEFAULT_WIDTH);
const height = Number(getArgValue('--height') ?? DEFAULT_HEIGHT);
const waitMs = Number(getArgValue('--wait-ms') ?? DEFAULT_WAIT_MS);
const fullPage = hasFlag('--full-page');

if ([width, height, waitMs].some(Number.isNaN)) {
  throw new Error('Width, height, and wait time must be numbers.');
}

await fs.mkdir(path.dirname(outputPath), { recursive: true });

const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({
    viewport: {
      width,
      height,
    },
  });

  await page.goto(url, { waitUntil: 'networkidle' });

  if (waitForUrl) {
    await page.waitForURL(`**${waitForUrl}**`);
  }

  if (selector) {
    await page.waitForSelector(selector, { state: 'visible' });
  } else if (waitMs > 0) {
    await page.waitForTimeout(waitMs);
  }

  await page.screenshot({
    path: outputPath,
    fullPage,
  });

  console.log(`Saved screenshot to ${path.resolve(outputPath)}`);
} finally {
  await browser.close();
}
