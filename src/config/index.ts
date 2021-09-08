import dotenv from 'dotenv';

dotenv.config();
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const config = {
  port: process.env.PORT || 5000,
  foodApiKey: process.env.FOOD_API_KEY ?? '',
  sceneBucketName: process.env.SCENE_BUCKET_NAME ?? '',
};

if (!config.foodApiKey) throw new Error('FOOD_API_KEY is not provided');
if (!config.sceneBucketName)
  throw new Error('SCENE_BUCKET_NAME is not provided');

export default config;
