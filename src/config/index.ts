import dotenv from 'dotenv';

dotenv.config();
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const config = {
  port: process.env.PORT || 5000,
  foodApiKey: process.env.FOOD_API_KEY,
};

if (!config.foodApiKey) throw new Error('FOOD_API_KEY is not provided');

export default config;
