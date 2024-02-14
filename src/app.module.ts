import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoConfig, RedisConfig } from './config';
import { ProductModule } from './modules/product/product.module';
import { PurchaseModule } from './modules/purchase/purchase.module';
import config from './config/config';
import { CacheModule } from '@nestjs/cache-manager';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    CacheModule.register({isGlobal: true}),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<RedisConfig>('redis').host,
          port: configService.get<RedisConfig>('redis').port,
        },
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<MongoConfig>('mongo').url,
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [config],
    }),
    ProductModule,
    PurchaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
