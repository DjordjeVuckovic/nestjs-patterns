import { Module } from '@nestjs/common';
import { ProductController } from './product.contoller';
import { IProductRepositoryToken } from './abstractions/product.repository';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { StoreModule } from '../store/store.module';
import { CategoryModule } from '../categories/category.module';

@Module({
  controllers: [ProductController],
  providers: [
    {
      provide: IProductRepositoryToken,
      useClass: ProductRepository
    },
    ProductService,
  ],
  imports: [StoreModule, CategoryModule]
})
export class ProductsModule {}
