import HttpException from '@src/exceptions/HttpException';
import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';

const route = Router();

const recognize = (app: Router) => {
  app.use('/recognize', route);

  route.get(
    '/barcode',
    expressAsyncHandler((req, res) => {
      throw new HttpException(501);
    }),
  );
};

export default recognize;
