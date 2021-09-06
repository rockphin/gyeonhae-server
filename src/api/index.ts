import { Router } from 'express';
import recognize from './routers/recognize';

const api = () => {
  const router = Router();
  recognize(router);
  return router;
};

export default api;
