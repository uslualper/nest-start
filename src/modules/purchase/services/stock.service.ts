import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager'; 
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { PurchaseConfig } from 'src/config';
import { TimeHelper } from '../../common/helpers/utils/time.helper';
import { Product } from 'src/modules/product/product.model';
import { Stock } from '../constants/stock.constant';

@Injectable()
export class StockService {

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        private readonly timeHelper: TimeHelper
    ) {}

    async haveStock(product: Product, quantity: number): Promise<boolean> {

        const purchaseConfig = this.configService.get<PurchaseConfig>('purchase');

        const cachedQuantity = await this.cacheManager.get<number>(`${Stock.cachePrefix}:${product.id}`);

        const pendingQuantity = cachedQuantity || (await this.prisma.orderProduct.aggregate({
            _sum: {
                quantity: true 
            },
            where: {
                productId: product.id,
                order: {
                    status: 'PENDING',
                    createdAt: {
                        gte: new Date(Date.now() - this.timeHelper.secondsToMilliseconds(purchaseConfig.lockStockTtl))
                    }
                }
            }
        }))._sum.quantity;

        if (pendingQuantity === 0) {
            await this.cacheManager.set(`${Stock.cachePrefix}:${product.id}`, pendingQuantity);
        }

        if (pendingQuantity + quantity > product.stock) {
            return false;
        }

        return true;

    }

    async haveStockByProductId(productId: number, quantity: number): Promise<boolean> {

        const product = await this.prisma.product.findUnique({
            where: {
                id: productId
            }
        });

        if (!product) {
            return false;
        }

        return this.haveStock(product, quantity);
        
    }

    async decreaseStock(productId: number, quantity: number): Promise<void> {
       const updated = await this.prisma.product.update({
            where: {
                id: productId,
                stock: {
                    gte: quantity
                }
            },
            data: {
                stock: {
                    decrement: quantity
                }
            }
        });
    
        if (!updated) {
            throw new Error('Not enough stock');
        }
    }
}


