import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { $Enums, Order as OrderClient, OrderProduct } from '@prisma/client';

export class Order implements OrderClient {
  @ApiProperty() id: number;
  @ApiProperty() userId: number;
  @ApiProperty() total: number;
  @ApiProperty({ enum: $Enums.Status }) 
  status: $Enums.Status;
  @ApiPropertyOptional() products?: OrderProduct[];
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
  @ApiPropertyOptional() paymentUrl?: string | null;
}