import 'reflect-metadata';
import express from 'express';
import config from './config';
import logger from './loaders/logger';
import loaders from './loaders';

async function startServer() {
  const app = express();
  loaders({ expressApp: app });
  app.listen(config.port, () =>
    logger.info(`server listening on port: ${config.port}`),
  );
}

startServer();
