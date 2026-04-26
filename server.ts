import { AngularAppEngine } from '@angular/ssr';
import express from 'express';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverModulePath = fileURLToPath(import.meta.url);
const currentDir = dirname(serverModulePath);
// Navigate from out-tsc/server (where server.ts is compiled) to dist/tools-ecosystem/browser
const browserDistFolder = resolve(currentDir, '..', '..', 'dist', 'tools-ecosystem', 'browser');

const app = express();
const port = process.env['PORT'] || 4000;

// Serve static assets from /browser
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
  }),
);

// Set up Angular SSR
const angularApp = new AngularAppEngine();

app.use('**', async (req, res, next) => {
  try {
    const requestHeaders = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value) {
        const headerValue = Array.isArray(value) ? value.join(', ') : value;
        requestHeaders.set(key, headerValue);
      }
    });

    const request = new Request(`http://localhost:${port}${req.url}`, {
      headers: requestHeaders,
      method: req.method,
    });

    const response = await angularApp.handle(request);

    if (!response) {
      return next();
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
    next(err);
  }
});

if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export default app;