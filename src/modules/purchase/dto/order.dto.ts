import { IsNotEmpty, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrder {
    @ApiPropertyOptional()
    @IsNotEmpty()
    @IsString()
    comment: string;
}