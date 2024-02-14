import { Process, Processor } from '@nestjs/bull';
import { StockService } from '../services/stock.service';
import { OrderService } from '../services/order.service';
import { Job } from 'bull';

@Processor('order')
export class OrderProcessor {

    constructor(
        private orderService: OrderService,
       private stockService: StockService,
    ) {}

    @Process('success-job')
    async handleSuccess(job: Job) {
        const order = await this.orderService.orderDetail(job.data.orderId);

        if (order.status !== 'CREATED') {
            // TODO: log 
            return;
        }

        const stockUpdatePromises = order.products.map(async (product) =>
            this.stockService.decreaseStock(product.productId, product.quantity)
        );

        const settlementResult = await Promise.allSettled(stockUpdatePromises);

        const errors = settlementResult.filter(result => result.status === 'rejected');

        if (errors.length > 0) {
            console.error('One or more stock updates failed:', errors);
        } 
    }
}