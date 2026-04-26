import { createServer } from 'http';
import app from '../dist/tools-ecosystem/server/server.mjs';

export default async (req, res) => {
  const server = createServer(app);
  server.emit('request', req, res);
};