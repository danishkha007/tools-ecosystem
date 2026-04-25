import '@angular/compiler';
import { AngularAppEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';
import { existsSync, readdirSync } from 'node:fs';
// Initialize the server
const app = express();
let angularApp;
async function initializeServer() {
    // Get the dist folder path - handle both local and Vercel environments
    const importMetaUrl = import.meta.url;
    const currentDir = dirname(fileURLToPath(importMetaUrl));
    const projectRoot = dirname(dirname(currentDir)); // Go up from api/server to project root
    let distFolder;
    let browserDistFolder;
    if (process.env['VERCEL']) {
        // Vercel environment - dist is at the root of /var/task
        distFolder = resolve('/var/task', 'dist/tools-ecosystem');
        browserDistFolder = resolve(distFolder, 'browser');
        console.log('[Vercel] Dist folder:', distFolder);
        console.log('[Vercel] Browser folder:', browserDistFolder);
        // List what's actually in dist for debugging
        try {
            const distContents = readdirSync(resolve('/var/task', 'dist'));
            console.log('[Vercel] Contents of /var/task/dist:', distContents);
        }
        catch (e) {
            console.error('[Vercel] Could not read dist directory:', e);
        }
    }
    else {
        // Local environment - use the project root to find dist
        distFolder = resolve(projectRoot, 'dist/tools-ecosystem');
        browserDistFolder = resolve(distFolder, 'browser');
        console.log('[Local] Project root:', projectRoot);
        console.log('[Local] Dist folder:', distFolder);
        console.log('[Local] Browser folder:', browserDistFolder);
    }
    // Load and set the manifest globally before creating AngularAppEngine
    try {
        const manifestPath = resolve(distFolder, 'server', 'angular-app-engine-manifest.mjs');
        console.log('Manifest path:', manifestPath);
        if (existsSync(manifestPath)) {
            console.log('Manifest file found, importing...');
            // Import the manifest dynamically
            const manifestModule = await import(pathToFileURL(manifestPath).href);
            globalThis.__ANGULAR_APP_ENGINE_MANIFEST = manifestModule.default;
            console.log('✓ Manifest loaded successfully');
        }
        else {
            console.error('✗ Manifest file not found at:', manifestPath);
            // List server directory contents for debugging
            const serverDir = resolve(distFolder, 'server');
            if (existsSync(serverDir)) {
                const serverContents = readdirSync(serverDir);
                console.error('Server directory contents:', serverContents);
            }
        }
    }
    catch (e) {
        console.error('✗ Error loading manifest:', e instanceof Error ? e.message : String(e));
        throw e;
    }
    // Set up Angular SSR
    try {
        angularApp = new AngularAppEngine();
        console.log('✓ AngularAppEngine initialized');
    }
    catch (e) {
        console.error('✗ Failed to initialize AngularAppEngine:', e instanceof Error ? e.message : String(e));
        throw e;
    }
    // Serve static assets from /browser
    console.log('Setting up static file serving from:', browserDistFolder);
    // Check if browser folder exists
    try {
        if (existsSync(browserDistFolder)) {
            console.log('✓ Serving static files from:', browserDistFolder);
            app.use(express.static(browserDistFolder, {
                maxAge: '1y',
                index: false,
                etag: false,
            }));
        }
        else {
            console.error('✗ Browser dist folder does not exist:', browserDistFolder);
            // List dist directory for debugging
            if (existsSync(distFolder)) {
                const distContents = readdirSync(distFolder);
                console.error('Dist directory contents:', distContents);
            }
        }
    }
    catch (e) {
        console.error('✗ Could not serve static files:', e instanceof Error ? e.message : String(e));
    }
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
        const isVercel = process.env['VERCEL'] === '1';
        const vercelUrl = process.env['VERCEL_URL'];
        let baseUrl;
        if (isVercel && vercelUrl) {
            baseUrl = `https://${vercelUrl}`;
        }
        else if (isVercel) {
            // Fallback for Vercel when VERCEL_URL is not set
            baseUrl = `https://${req.headers.host || 'localhost'}`;
        }
        else {
            // Local environment
            baseUrl = `http://${req.headers.host || 'localhost:4200'}`;
        }
        const requestUrl = `${baseUrl}${req.url}`;
        if (process.env['DEBUG']) {
            console.log(`[${isVercel ? 'Vercel' : 'Local'}] Processing ${req.method} ${requestUrl}`);
        }
        const response = await angularApp.handle(new Request(requestUrl, {
            headers: requestHeaders,
            method: req.method,
        }));
        if (!response) {
            console.warn(`No response for: ${req.url}`);
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
    }
    catch (err) {
        console.error('SSR Error:', err instanceof Error ? err.message : String(err));
        console.error('Stack:', err instanceof Error ? err.stack : 'No stack trace');
        res.status(500).json({
            error: 'Internal Server Error',
            message: err instanceof Error ? err.message : String(err),
            ...(process.env['DEBUG'] && { stack: err instanceof Error ? err.stack : undefined })
        });
        return;
    }
});
// Initialize on module load
initializeServer().catch((err) => {
    console.error('Failed to initialize server:', err);
    process.exit(1);
});
// Export the handler for Vercel Serverless Functions
export default app;
export const config = {
    maxDuration: 10,
    type: 'module',
};
