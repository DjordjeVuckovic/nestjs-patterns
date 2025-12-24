import { Module } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
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
  imports: [StoreModule],
})
export class CategoryModule {}
