import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderPendingEvent } from '../events/order-pending.event';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager'; 
import { Stock } from '../constants/stock.constant';

@Injectable()
export class OrderPendingListener {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    @OnEvent('order.pending')
    handleOrderPendingEvent(event: OrderPendingEvent) {
        event.productIds.forEach(async (productId) => {
            await this.cacheManager.del(`${Stock.cachePrefix}:${productId}`);
        });
    }
}