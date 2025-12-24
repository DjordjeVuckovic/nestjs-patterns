import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  type IProductRepository,
  IProductRepositoryToken,
} from './abstractions/product.repository';
import { FindProducts } from './dtos/product-read.dto';
import { Product } from './product.entity';
import {
  type ITransactionManager,
  ITransactionManagerToken,
} from '../store/tx.manager';
import { CreateProduct } from './dtos/product-write.dto';
import {
  type ICategoryRepository,
  ICategoryRepositoryToken,
} from '../categories/abstractions/category.repository';
import {
  createCursorResponse,
  CursorResponse,
} from '../shared/cursor-pagination';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    @Inject(ITransactionManagerToken)
    private readonly txManager: ITransactionManager,
    @Inject(IProductRepositoryToken)
    private readonly productRepository: IProductRepository,
    @Inject(ICategoryRepositoryToken)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async create(product: CreateProduct): Promise<string> {
    const id = await this.txManager.tx(async (tx) => {
      const { categoryIds, ...rest } = product;

      const categories = !categoryIds
        ? []
        : await this.categoryRepository.findByIds(categoryIds, tx);

      if (categoryIds && categories.length !== categoryIds.length) {
        this.logger.warn(
          `Some categories not found for ids: ${categoryIds.join(', ')}`,
        );
        throw new BadRequestException('Some categories not found');
      }

      const newProduct = new Product(rest, categories);

      return this.productRepository.create(newProduct, tx);
    });
    this.logger.log(`Product created with id: ${id}`, { id });
    return id;
  }

  async find(params: FindProducts): Promise<CursorResponse<Product>> {
    const [products, total] = await this.productRepository.find(params);
    this.logger.debug(`Found ${products.length} products`, { params });
    return createCursorResponse(products, total);
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      this.logger.error(`Product with id: ${id} not found`, { id });
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async updateProduct(id: string, updateData: Partial<Product>): Promise<void> {
    await this.txManager.tx(async (tx) => {
      const existingProduct = await this.productRepository.findById(id, tx);

      if (!existingProduct) {
        this.logger.error(`Product with id: ${id} not found for update`, {
          id,
        });
        throw new NotFoundException('Product not found');
      }

      const updatedProduct = { ...existingProduct, ...updateData };

      await this.productRepository.update(updatedProduct, tx);
      this.logger.log(`Product with id: ${id} updated successfully`, { id});
    });
  }

  async update(id: string, body: Partial<CreateProduct>) : Promise<void> {
    await this.updateProduct(id, body);
  }
}
