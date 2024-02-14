import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from '../events/order-created.event';
import { SellOrderInterface } from '../interfaces/sell-order.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderService } from '../services/order.service';

@Injectable()
export class OrderCreatedListener {
    
    constructor(
        @InjectModel('SellOrder') 
        private readonly sellOrderModel: Model<SellOrderInterface>,
        private readonly orderService: OrderService
    ) {}
    
    @OnEvent('order.created')
    handleOrderCreatedEvent(event: OrderCreatedEvent) {
        this.sellOrderModel.create({
            event
        });

        this.orderService.addOrderHistory(event.orderId, 'CREATED');
    }
}