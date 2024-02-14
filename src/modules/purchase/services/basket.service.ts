import { Injectable, NotAcceptableException } from '@nestjs/common';
import { Basket } from '../models/basket.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddProductToBasketDto } from '../dto/basket.dto';
import { StockService } from './stock.service';

@Injectable()
export class BasketService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly stockService: StockService
    ) {}

    async addProductToBasket(userId: number, data: AddProductToBasketDto): Promise<Basket> {

        if (!await this.stockService.haveStockByProductId(data.productId, data.quantity)) {
            throw new NotAcceptableException('Not enough stock');
        }
        
        const basket = await this.prisma.basket.findFirst({
            where: {
                userId,
                productId: data.productId
            }
        });

        if (basket) {
            return this.prisma.basket.update({
                where: {
                    userId_productId: {
                        userId,
                        productId: data.productId
                    }
                },
                data: {
                    quantity: basket.quantity + data.quantity
                }
            });
        }

        return this.prisma.basket.create({
            data: {
                userId,
                productId: data.productId,
                quantity: data.quantity
            }
        });
    }

    async updateProductInBasket(userId: number, data: AddProductToBasketDto): Promise<Basket> {

        if (data.quantity <= 0) {
            return this.removeProductFromBasket(userId, data.productId);
        }

        if (!await this.stockService.haveStockByProductId(data.productId, data.quantity)) {
            throw new NotAcceptableException('Not enough stock');
        }

        return this.prisma.basket.update({
            where: {
                userId_productId: {
                    userId,
                    productId: data.productId
                }
            },
            data: {
                quantity: data.quantity
            }
        });
    }

    async clearBasket(userId: number): Promise<void> {
        await this.prisma.basket.deleteMany({
            where: {
                userId
            }
        });
    }

    async getBasket(userId: number): Promise<Basket[]> {
        return this.prisma.basket.findMany({
            where: {
                userId
            },
            include: {
                product: true
            }
        });
    }

    async removeProductFromBasket(userId: number, productId: number): Promise<Basket> {
        return this.prisma.basket.delete({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            }
        });
    }
    
}
