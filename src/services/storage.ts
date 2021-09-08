import { Storage } from '@google-cloud/storage';
import config from '@src/config';

const storage = new Storage();

const sceneBucket = storage.bucket(config.sceneBucketName);

export { sceneBucket };
