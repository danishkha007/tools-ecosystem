import { AngularAppEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join, resolve, dirname } from 'node:path';
import { readFileSync } from 'node:fs';

// Get the dist folder path - handle both local and Vercel environments
const importMetaUrl = import.meta.url;
const currentDir = dirname(fileURLToPath(importMetaUrl));
const projectRoot = resolve(currentDir, '..');

// Try to find the dist folder
let distFolder: string;
if (process.env.VERCEL) {
  // Vercel environment - use the output directory structure
  distFolder = resolve(projectRoot, 'dist/tools-ecosystem');
} else {
  // Local environment
  distFolder = resolve(projectRoot, 'dist/tools-ecosystem');
}

console.log('Dist folder path:', distFolder);

// Create Express app
const app = express();

// Set up Angular SSR
const angularApp = new AngularAppEngine();

// Serve static assets from /browser
const browserDistFolder = join(distFolder, 'browser');
console.log('Browser dist folder:', browserDistFolder);

// Check if browser folder exists
try {
  if (require('fs').existsSync(browserDistFolder)) {
    console.log('Serving static files from:', browserDistFolder);
    app.use(
      express.static(browserDistFolder, {
        maxAge: '1y',
        index: false,
      }),
    );
  } else {
    console.warn('Browser dist folder does not exist:', browserDistFolder);
  }
} catch (e) {
  console.warn('Could not serve static files:', e);
}

// Server-side rendering handler - adapted for Vercel
app.all('*', async (req, res) => {
  try {
    const requestHeaders = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value) {
        const headerValue = Array.isArray(value) ? value.join(', ') : value;
        requestHeaders.set(key, headerValue);
      }
    });

    const isVercel = process.env.VERCEL === '1';
    const baseUrl = isVercel ? `https://${req.headers.host}` : `http://localhost`;
    const requestUrl = `${baseUrl}${req.url}`;

    const request = new Request(requestUrl, {
      headers: requestHeaders,
      method: req.method,
    });

    console.log('Processing request:', request.url);

    const response = await angularApp.handle(request);

    if (!response) {
      return res.status(404).send('Not Found');
    }

    const status = response.status;
    const headers = response.headers;

    res.status(status);
    headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const body = await response.text();
    res.send(body);
  } catch (err) {
    console.error('SSR Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Export the handler for Vercel Serverless Functions
export default app;
export const config = {
  maxDuration: 10,
  type: 'module',
};