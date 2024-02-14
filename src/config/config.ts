import { Config } from './config.interface';

const config: Config = {
  nest: {
    host: process.env.APP_HOST || 'localhost',
    port: Number(process.env.APP_PORT),
  },
  cors: {
    enabled: true,
  },
  mongo: {
    url: process.env.MONGODB_URL || '',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT),
  },
  security: {
    accessSecret: process.env.ACCESS_TOKEN_SECRET || 'a',
    accessExpiresIn: '900s',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET || 'b',
    refreshExpiresIn: '48h',
    bcryptSaltOrRound: 10,
  },
  purchase: {
    lockStockTtl: 60,
  },
};

export default (): Config => config;
