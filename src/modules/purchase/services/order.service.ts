import { Injectable, NotAcceptableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestConfig } from 'src/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { Order } from '../models/order.model';
import { PaginatorTypes, paginator } from '@nodeteam/nestjs-prisma-pagination';
import { PaginateDto } from '../../common/dto/paginate.dto';
import { BasketService } from './basket.service';
import { StockService } from './stock.service';
import { OrderCreatedEvent } from '../events/order-created.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderPendingEvent } from '../events/order-pending.event';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { $Enums } from '@prisma/client';

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class OrderService {

    constructor(
        @InjectQueue('order') private readonly orderQueue: Queue,
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        private readonly basketService: BasketService,
        private readonly stockService: StockService,
        private eventEmitter: EventEmitter2,
    ) {}

    async createOrder(userId: number): Promise<Order> {
        const basket = await this.prisma.basket.findMany({
            where: {
                userId
            },
            include: {
                product: true
            }
        });

        if (!basket || basket.length === 0) {
            throw new NotAcceptableException('Basket not found');
        }

        for (const item of basket) {
            if (!await this.stockService.haveStock(item.product, item.quantity)) {
                throw new NotAcceptableException('Not enough stock');
            }
        }

        const order = await this.prisma.$transaction(async (prisma) => {

            const order = await prisma.order.create({
                data: {
                    user: {
                        connect: {
                            id: userId
                        }
                    },
                    status: 'PENDING',
                    total: basket.reduce((acc, item) => {
                        return acc + item.product.price * item.quantity;
                    }, 0),
                    products: {
                        createMany: {
                            data: basket.map(item => {
                                return {
                                    productId: item.productId,
                                    quantity: item.quantity
                                }
                            })
                        }
                    }
                }
            });

            return order;
        });

        await this.basketService.clearBasket(userId);

        const orderPendingEvent = new OrderPendingEvent();
        orderPendingEvent.productIds = basket.map(item => item.productId);
        this.eventEmitter.emit('order.pending', orderPendingEvent);

        const nestConfig = this.configService.get<NestConfig>('security');

        return {
            ...order,
            paymentUrl: nestConfig.host + '/api/order/' + order.id + '/pay'
        };
    }
    
    async payOrder(orderId: number): Promise<Order> {
        const order = await this.prisma.order.findUnique({
            where: {
                id: orderId
            },
            include: {
                products: true
            }
        });

        if (!order) {
            throw new NotAcceptableException('Order not found');
        }

        if (order.status !== 'PENDING') {
            throw new NotAcceptableException('Order already paid');
        }

        const updatedOrder = await this.prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                status: 'CREATED'
            },
            include: {
                products: true
            }
        });
        
        this.orderQueue.add('success-job', {
            orderId
        });
        
        const orderCreatedEvent = new OrderCreatedEvent();
        orderCreatedEvent.orderId = order.id
        orderCreatedEvent.total = order.total;
        this.eventEmitter.emit('order.created', orderCreatedEvent);

        return updatedOrder;
    }

    async orderList(
        userId: number,
        paginateDto: PaginateDto,
    ): Promise<PaginatorTypes.PaginatedResult<Order[]>> {
        return paginate(
            this.prisma.order,
            {
                where: {
                    userId
                },
                orderBy: {
                    createdAt: 'desc'
                }
            },
            {
                page: paginateDto.page,
                perPage: paginateDto.perPage,
            }
        );
    }

    async orderDetail(orderId: number,userId?: number): Promise<Order> {
        return this.prisma.order.findFirst({
            where: {
                id: orderId,
                userId
            },
            include: {
                products: true
            }
        });
    }

    async addOrderHistory(orderId: number, status: $Enums.Status): Promise<void> {
        await this.prisma.orderHistory.create({
            data: {
                orderId,
                status
            }
        });
    }

}