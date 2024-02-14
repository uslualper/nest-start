import { Body, Controller, Delete, Get, HttpStatus, Post, Put, UseGuards } from '@nestjs/common';
import { BasketService } from '../services/basket.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Basket } from '../models/basket.model';
import { AddProductToBasketDto } from '../dto/basket.dto';
import { GetCurrentUserId } from 'src/modules/common/decorators';
import { AtGuard } from 'src/modules/common/guards';

@ApiTags('basket')
@UseGuards(AtGuard)
@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Add product to basket',
    type: Basket,
  })
  @Post()
  async addProductToBasket(
    @GetCurrentUserId() userId: number,
    @Body() addProductToBasketDto: AddProductToBasketDto,
  ): Promise<Basket> {
    return this.basketService.addProductToBasket(
      userId,
      addProductToBasketDto,
    );
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update product in basket',
    type: Basket,
  })
  @Put()
  async updateProductInBasket(
    @GetCurrentUserId() userId: number,
    @Body() addProductToBasketDto: AddProductToBasketDto,
  ): Promise<Basket> {
    return this.basketService.updateProductInBasket(
      userId,
      addProductToBasketDto,
    );
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Removed product from basket',
    type: Basket,
  })
  @Delete(':productId')
  async removeProductFromBasket(
    @GetCurrentUserId() userId: number,
    @Body() productId: number,
  ): Promise<Basket> {
    return this.basketService.removeProductFromBasket(userId, productId);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Clear basket',
  })
  @Delete()
  async emptyBasket(@GetCurrentUserId() userId: number): Promise<void> {
    return this.basketService.clearBasket(userId);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get basket',
    type: Basket,
    isArray: true,
  })
  @Get()
  async getBasket(@GetCurrentUserId() userId: number): Promise<Basket[]> {
    return this.basketService.getBasket(userId);
  }

}
