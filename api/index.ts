import { createServer } from 'http';
import {reqHandler} from '../src/server';

export default async (req, res) => {
  const server = createServer(reqHandler);
  server.emit('request', req, res);
};