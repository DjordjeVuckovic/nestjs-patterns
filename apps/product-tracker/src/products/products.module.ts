import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.contoller';
import { IProductRepositoryToken } from './abstractions/product.repository';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { Product } from './product.entity';
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
  imports: [
    TypeOrmModule.forFeature([Product]),
    StoreModule,
    CategoryModule,
  ],
})
export class ProductsModule {}
