import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SearchDto {
    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => String)
    search: string;
}