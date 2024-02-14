import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginatorTypes, paginator } from '@nodeteam/nestjs-prisma-pagination';
import { Product } from './product.model';
import { PaginateDto } from '../common/dto/paginate.dto';
import { SearchDto } from '../common/dto/search.dto';

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class ProductService {

    constructor(private readonly prisma: PrismaService) {}

    async findAll(
        pageDto: PaginateDto,
        searchDto: SearchDto,
    ): Promise<PaginatorTypes.PaginatedResult<Product>> {
        return paginate(
            this.prisma.product,
            {
                where: {
                    name: {
                        contains: searchDto.search
                    }
                }
            },
            {
                page: pageDto.page,
                perPage: pageDto.perPage,
            }
        );
    }

    async findOne(id: number): Promise<Product> {
        return this.prisma.product.findUnique({
            where: {
                id
            },
        });
    }
}
