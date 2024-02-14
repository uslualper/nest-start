import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginateDto {
    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    page: number;
    perPage = 10;
}