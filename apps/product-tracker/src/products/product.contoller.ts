import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Version,
} from '@nestjs/common';
import { CreateProduct } from './dtos/product-write.dto';
import { ProductService } from './product.service';
import { FindProducts } from './dtos/product-read.dto';

@Controller({
  path: '/api/categories',
})
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Version('1')
  @Post()
  async create(@Body() body: CreateProduct) {
    return await this.productService.create(body);
  }

  @Version('1')
  @Get()
  async find(params: FindProducts) {
    return await this.productService.find(params);
  }

  @Version('1')
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.productService.findById(id);
  }
  
  @Version('1')
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<CreateProduct>) {
    return this.productService.update(id, body);
  }
}