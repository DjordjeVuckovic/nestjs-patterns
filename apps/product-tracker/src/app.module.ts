import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoreModule } from './store/store.module';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './categories/category.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [StoreModule, ProductsModule, CategoryModule],
})
export class AppModule {}
