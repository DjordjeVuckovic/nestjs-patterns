import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRepository } from './category.repository';
import { Category } from './category.entity';
import { ICategoryRepositoryToken } from './abstractions/category.repository';
import { StoreModule } from '../store/store.module';

@Module({
  controllers: [],
  providers: [
    {
      provide: ICategoryRepositoryToken,
      useClass: CategoryRepository,
    },
  ],
  imports: [
    TypeOrmModule.forFeature([Category]),
    StoreModule,
  ],
  exports: [ICategoryRepositoryToken],
})
export class CategoryModule {}
