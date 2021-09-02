import api from '@src/api';
import morgan from '@src/api/middleware/morgan';
import HttpException from '@src/exceptions/HttpException';
import { errors } from 'celebrate';
import express, { Request, Response, NextFunction } from 'express';
import logger from './logger';

const expressLoader = ({ app }: { app: express.Application }) => {
  app
    .route('/status')
    .get((req, res) => res.sendStatus(204))
    .head((req, res) => res.sendStatus(204));
  app.use(morgan);
  app.use(express.json());
  app.use(api());
  app.use(errors());
  app.use(() => {
    throw new HttpException(404);
  });
  app.use(
    (err: HttpException, req: Request, res: Response, next: NextFunction) => {
      const statusCode = err.status ?? 500;
      res.status(statusCode).json({
        message: err.message,
      });
      if (statusCode === 500) logger.error(err.stack);
    },
  );
};

export default expressLoader;
