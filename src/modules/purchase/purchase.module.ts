import { Module } from '@nestjs/common';
import { BasketService } from './services/basket.service';
import { BasketController } from './controllers/basket.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SellOrderSchema } from './schemas/sell-order.schema';
import { StockService } from './services/stock.service';
import { TimeHelper } from '../common/helpers/utils/time.helper';
import { OrderCreatedListener } from './listeners/order-created.listener';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'SellOrder', schema: SellOrderSchema }]),
    BullModule.registerQueue({
      name: 'order'
    })
  ],
  controllers: [
    BasketController,
    OrderController
  ],
  providers: [
    PrismaService,
    BasketService,
    OrderService,
    StockService,
    TimeHelper,
    OrderCreatedListener
  ],
})
export class PurchaseModule {}
