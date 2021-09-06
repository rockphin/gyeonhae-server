import HttpException from '@src/exceptions/HttpException';
import BarcodeService, { BarcodeResult } from '@src/services/Barcode';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import Container from 'typedi';

const route = Router();

const recognize = (app: Router) => {
  app.use('/recognize', route);

  route.get<{ code: number }, BarcodeResult[], never>(
    '/barcode/:code',
    celebrate({
      params: {
        code: Joi.number(),
      },
    }),
    expressAsyncHandler(async (req, res) => {
      const { code } = req.params;
      const barcodeService = Container.get(BarcodeService);
      const result = await barcodeService.getBarcodeInfo(code);
      res.json(result);
    }),
  );
};

export default recognize;
