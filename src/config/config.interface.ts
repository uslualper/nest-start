import e from "express";

export interface Config {
  nest: NestConfig;
  mongo: MongoConfig;
  redis: RedisConfig;
  cors: CorsConfig;
  security: SecurityConfig;
  purchase: PurchaseConfig;
}

export interface NestConfig {
  host: string;
  port: number;
}

export interface MongoConfig {
  url: string;
}

export interface RedisConfig {
  host: string;
  port: number;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface SecurityConfig {
  accessSecret: string;
  accessExpiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
  bcryptSaltOrRound: string | number;
}

export interface PurchaseConfig {
  lockStockTtl: number;
}