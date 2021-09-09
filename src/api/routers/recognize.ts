import HttpException from '@src/exceptions/HttpException';
import { imageMulter } from '@src/loaders/multer';
import BarcodeService, { BarcodeResult } from '@src/services/barcode';
import BrailleService from '@src/services/braille';
import SceneService from '@src/services/scene';
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

  route.post<never, string[] | null>(
    '/scene',
    imageMulter.single('image'),
    expressAsyncHandler(async (req, res) => {
      if (!req.file) throw new HttpException(400);
      const sceneService = Container.get(SceneService);
      const result = await sceneService.labelDetection(req.file);
      if (!result) throw new HttpException(404);
      res.json(result);
    }),
  );

  route.post<never, { result: string }, { content: string }>(
    '/scene',
    celebrate({
      body: {
        content: Joi.string(),
      },
    }),
    expressAsyncHandler(async (req, res) => {
      const brailleService = Container.get(BrailleService);
      res.json({ result: brailleService.toAscii(req.body.content) });
    }),
  );
};

export default recognize;
