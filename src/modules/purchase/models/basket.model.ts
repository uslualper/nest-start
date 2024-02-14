import { ApiProperty } from '@nestjs/swagger';
import { Basket as BasketClient } from '@prisma/client';

export class Basket implements BasketClient {
  @ApiProperty() productId: number;
  @ApiProperty() userId: number;
  @ApiProperty() quantity: number;
}