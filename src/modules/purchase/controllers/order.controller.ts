import { Controller, Get, HttpStatus, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Order } from '../models/order.model';
import { GetCurrentUserId } from 'src/modules/common/decorators';
import { PaginateDto } from '../../common/dto/paginate.dto';
import { PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination';
import { AtGuard } from 'src/modules/common/guards';

@ApiTags('order')
@UseGuards(AtGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Create order',
        type: Order,
    })
    @Post()
    async createOrder(
        @GetCurrentUserId() userId: number,
    ): Promise<Order> {
        return this.orderService.createOrder(userId);
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get order list',
        type: Order,
        isArray: true,
    })
    @Get()
    async getOrderList(
        @GetCurrentUserId() userId: number,
        pageDto: PaginateDto,
    ): Promise<PaginatorTypes.PaginatedResult<Order[]>> {
        return this.orderService.orderList(userId,pageDto);
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get order detail',
        type: Order,
    })
    @Get(':orderId')
    async getOrderDetail(
        @GetCurrentUserId() userId: number,
        @Param('orderId', new ParseIntPipe()) orderId: number,
    ): Promise<Order> {
        return this.orderService.orderDetail(orderId, userId);
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Pay order',
        type: Order,
    })
    @Post(':orderId/pay')
    async payOrder(
        @Param('orderId', new ParseIntPipe()) orderId: number,
    ): Promise<Order> {
        return this.orderService.payOrder(orderId);
    }
}