import { ApiProperty } from '@nestjs/swagger';
import { Product as ProductClient } from '@prisma/client';

export class Product implements ProductClient {
  @ApiProperty() id: number;
  @ApiProperty() name: string;
  @ApiProperty() stock: number;
  @ApiProperty() price: number;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}
