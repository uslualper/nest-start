import { Controller, Get, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators';
import { PaginateDto } from '../common/dto/paginate.dto';
import { SearchDto } from '../common/dto/search.dto';
import { PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Products list',
    type: Product,
    isArray: true,
  })
  @Public()
  @Get()
  async findAll(
    pageDto: PaginateDto,
    searchDto: SearchDto,
  ): Promise<PaginatorTypes.PaginatedResult<Product>>{
    return this.productService.findAll(pageDto, searchDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product Detail',
    type: Product,
  })
  @Public()
  @Get(':id')
  async findOne(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Product> {
    return this.productService.findOne(id);
  }
}
