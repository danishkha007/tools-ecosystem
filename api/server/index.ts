import '@angular/compiler';
import { AngularAppEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';
import { existsSync, readdirSync } from 'node:fs';

// Initialize the server
const app = express();
let angularApp: AngularAppEngine;

// Determine paths based on environment
function getDistPaths() {
  if (process.env['VERCEL']) {
    // Vercel: dist is at /var/task relative to the function
    const distFolder = resolve('/var/task', 'dist/tools-ecosystem');
    const browserDistFolder = resolve(distFolder, 'browser');
    return { distFolder, browserDistFolder };
  } else {
    // Local: dist is relative to project root
    const importMetaUrl = import.meta.url;
    const currentDir = dirname(fileURLToPath(importMetaUrl));
    const projectRoot = dirname(dirname(currentDir));
    const distFolder = resolve(projectRoot, 'dist/tools-ecosystem');
    const browserDistFolder = resolve(distFolder, 'browser');
    return { distFolder, browserDistFolder };
  }
}

// Lazy initialization - run only when needed
async function ensureInitialized() {
  if (angularApp) {
    return angularApp;
  }

  const { distFolder, browserDistFolder } = getDistPaths();

  console.log('[Server] Dist folder:', distFolder);
  console.log('[Server] Browser folder:', browserDistFolder);

  // Serve static assets FIRST (before SSR) - this is critical for Vercel
  if (existsSync(browserDistFolder)) {
    console.log('[Server] Serving static files from:', browserDistFolder);
    app.use(
      express.static(browserDistFolder, {
        maxAge: '1y',
        index: false,
        etag: false,
      }),
    );
  }

  // Load the manifest
  try {
    const manifestPath = resolve(distFolder, 'server', 'angular-app-engine-manifest.mjs');
    console.log('[Server] Manifest path:', manifestPath);

    if (existsSync(manifestPath)) {
      const manifestModule = await import(pathToFileURL(manifestPath).href);
      (globalThis as any).__ANGULAR_APP_ENGINE_MANIFEST = manifestModule.default;
      console.log('[Server] ✓ Manifest loaded successfully');
    } else {
      console.error('[Server] ✗ Manifest file not found at:', manifestPath);
    }
  } catch (e) {
    console.error('[Server] Error loading manifest:', e);
  }

  // Initialize Angular SSR engine
  angularApp = new AngularAppEngine();
  console.log('[Server] ✓ AngularAppEngine initialized');

  return angularApp;
}

// SSR handler - processes all unmatched routes
async function ssrHandler(req: express.Request, res: express.Response) {
  const requestHeaders = new Headers();
  Object.entries(req.headers).forEach(([key, value]) => {
    if (value) {
      const headerValue = Array.isArray(value) ? value.join(', ') : value;
      requestHeaders.set(key, headerValue);
    }
  });

  const isVercel = process.env['VERCEL'] === '1';
  const vercelUrl = process.env['VERCEL_URL'];

  let baseUrl: string;
  if (isVercel && vercelUrl) {
    baseUrl = `https://${vercelUrl}`;
  } else if (isVercel) {
    baseUrl = `https://${req.headers.host || 'localhost'}`;
  } else {
    baseUrl = `http://${req.headers.host || 'localhost:4200'}`;
  }

  const requestUrl = `${baseUrl}${req.url}`;

  console.log(`[Server] SSR for: ${req.method} ${requestUrl}`);

  try {
    const engine = await ensureInitialized();
    const response = await engine.handle(new Request(requestUrl, {
      headers: requestHeaders,
      method: req.method,
    }));

    if (!response) {
      console.warn(`[Server] No response for: ${req.url}`);
      return res.status(404).send('Not Found');
    }

    const status = response.status;
    const headers = response.headers;

    res.status(status);
    headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const body = await response.text();
    return res.send(body);
  } catch (err) {
    console.error('[Server] SSR Error:', err instanceof Error ? err.message : String(err));
    console.error('[Server] Stack:', err instanceof Error ? err.stack : 'No stack trace');
    res.status(500).json({
      error: 'Internal Server Error',
      message: err instanceof Error ? err.message : String(err),
    });
  }
}

// All routes - static files are served first, then SSR
app.all('*', ssrHandler);

// Export for Vercel
export default app;
export const config = {
  maxDuration: 10,
  type: 'module',
};
