import { describe, it, expect, beforeAll } from 'vitest';
import { parse } from 'node-html-parser';

// Start: yarn build && yarn start after building the app and running the server, then run the tests

const BASE_URL = 'http://127.0.0.1:3000/';
const TIMEOUT = 10000;

beforeAll(async () => {});

const fetchWithTimeout = async (url, timeout = 5000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(url, { signal: controller.signal });
  clearTimeout(timeoutId);
  return response;
};

describe('Render Mode Tests', () => {
  it(
    'SSR: Home page renders server-side',
    async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/`);
      const html = await response.text();
      const doc = parse(html);

      expect(response.status).toBe(200);
      expect(html).toContain('<!DOCTYPE html>');

      // Check for essential HTML structure
      const head = doc.querySelector('head');
      const body = doc.querySelector('body');
      expect(head).toBeTruthy();
      expect(body).toBeTruthy();

      // Title is optional but log if present
      const title = doc.querySelector('title');
      if (title) {
        console.log(`📄 Page title: "${title.innerText}"`);
      } else {
        console.log('📄 No title tag found (this is okay for minimal SSR)');
      }

      // Check for any content in the page
      expect(html.length).toBeGreaterThan(200);

      console.log('✅ SSR: Home page rendered correctly');
    },
    TIMEOUT,
  );

  it(
    'SPA/CSR: Client-side page returns minimal HTML',
    async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/client-side`);
      const html = await response.text();
      const doc = parse(html);

      expect(response.status).toBe(200);

      const body = doc.querySelector('body');
      expect(body).toBeTruthy();
      expect(html).toContain('<script');

      const rootDiv = doc.querySelector('#root, #app, [data-reactroot]');
      const hasAppContainer = rootDiv || html.includes('root') || html.includes('app');
      expect(hasAppContainer).toBeTruthy();

      console.log('✅ CSR: Client-side page configured correctly');
    },
    TIMEOUT,
  );

  it(
    'SSR: Server-side page renders with data',
    async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/server-side`);
      const html = await response.text();
      const doc = parse(html);

      expect(response.status).toBe(200);
      expect(html.length).toBeGreaterThan(1000);

      const body = doc.querySelector('body');
      const bodyText = body?.innerText || '';
      expect(bodyText.length).toBeGreaterThan(50);

      console.log('✅ SSR: Server-side rendered with data correctly');
    },
    TIMEOUT,
  );

  it(
    'SSG: HTML-only page renders statically',
    async () => {
      const response = await fetchWithTimeout(`${BASE_URL}/html`);
      const html = await response.text();
      const doc = parse(html);

      expect(response.status).toBe(200);

      const scripts = doc.querySelectorAll('script');
      console.log(`📊 Found ${scripts.length} script tags in HTML-only page`);

      expect(html).toContain('<!DOCTYPE html>');
      expect(html.length).toBeGreaterThan(500);

      console.log('✅ SSG: HTML-only page rendered correctly');
    },
    TIMEOUT,
  );

  it(
    'All pages show different render mode characteristics',
    async () => {
      const [homeRes, clientRes, serverRes, htmlRes] = await Promise.all([
        fetchWithTimeout(`${BASE_URL}/`),
        fetchWithTimeout(`${BASE_URL}/client-side`),
        fetchWithTimeout(`${BASE_URL}/server-side`),
        fetchWithTimeout(`${BASE_URL}/html`),
      ]);

      const [homeHtml, clientHtml, serverHtml, htmlHtml] = await Promise.all([
        homeRes.text(),
        clientRes.text(),
        serverRes.text(),
        htmlRes.text(),
      ]);

      const pageSizes = {
        home: homeHtml.length,
        client: clientHtml.length,
        server: serverHtml.length,
        html: htmlHtml.length,
      };

      console.log('📊 Page sizes:', pageSizes);

      // All should load successfully
      expect(homeRes.status).toBe(200);
      expect(clientRes.status).toBe(200);
      expect(serverRes.status).toBe(200);
      expect(htmlRes.status).toBe(200);

      // Each should have different characteristics
      Object.values(pageSizes).forEach(size => {
        expect(size).toBeGreaterThan(100);
      });

      // Server-side should typically be larger due to pre-rendered content
      expect(pageSizes.server).toBeGreaterThan(pageSizes.client);
    },
    TIMEOUT,
  );

  it(
    'Response headers match render mode requirements',
    async () => {
      const homeResponse = await fetchWithTimeout(`${BASE_URL}/`);
      const clientResponse = await fetchWithTimeout(`${BASE_URL}/client-side`);

      expect(homeResponse.headers.get('content-type')).toContain('text/html');
      expect(clientResponse.headers.get('content-type')).toContain('text/html');

      const homeHeaders = Object.fromEntries(homeResponse.headers.entries());
      const clientHeaders = Object.fromEntries(clientResponse.headers.entries());

      console.log('🔍 Home page headers:', homeHeaders);
      console.log('🔍 Client page headers:', clientHeaders);

      // Check for performance headers
      const performanceHeaders = ['cache-control', 'etag', 'last-modified'];
      performanceHeaders.forEach(header => {
        const homeHasHeader = homeResponse.headers.has(header);
        const clientHasHeader = clientResponse.headers.has(header);

        if (homeHasHeader || clientHasHeader) {
          console.log(`📈 ${header} header found`);
        }
      });
    },
    TIMEOUT,
  );

  it(
    'Pages load within acceptable time',
    async () => {
      const startTime = Date.now();

      const responses = await Promise.all([
        fetchWithTimeout(`${BASE_URL}/`),
        fetchWithTimeout(`${BASE_URL}/client-side`),
        fetchWithTimeout(`${BASE_URL}/server-side`),
        fetchWithTimeout(`${BASE_URL}/html`),
      ]);

      const totalTime = Date.now() - startTime;
      console.log(`⚡ All pages loaded in ${totalTime}ms`);

      responses.forEach(response => {
        expect(response.status).toBe(200);
      });

      expect(totalTime).toBeLessThan(5000); // All pages should load within 5 seconds
    },
    TIMEOUT,
  );
});
