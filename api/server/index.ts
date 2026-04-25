import { AngularAppEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';

// Get the dist folder path
const distFolder = resolve(fileURLToPath(import.meta.url), '../../../dist/tools-ecosystem');

// Create Express app
const app = express();

// Set up Angular SSR
const angularApp = new AngularAppEngine();

// Serve static assets from /browser
const browserDistFolder = join(distFolder, 'browser');
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
  }),
);

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

    const request = new Request(`http://localhost${req.url}`, {
      headers: requestHeaders,
      method: req.method,
    });

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