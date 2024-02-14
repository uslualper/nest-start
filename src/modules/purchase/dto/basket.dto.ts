import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AddProductToBasketDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  productId: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  quantity: number;
}

export class RemoveProductFromBasketDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  productId: number;
}
