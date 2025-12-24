import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ITransactionManager } from '../store/tx.manager';
import { ICategoryRepository } from '../categories/abstractions/category.repository';
import { IProductRepository } from './abstractions/product.repository';

describe('ProductService', () => {
  let service: ProductService;
  let txManagerMock: ITransactionManager;
  let categoryRepositoryMock: ICategoryRepository;
  let productRepositoryMock: IProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);

    // Create mocks for dependencies
    txManagerMock = {
      tx: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
    } as unknown as ITransactionManager;

    categoryRepositoryMock = {
      findByIds: jest.fn(),
    } as unknown as ICategoryRepository;

    productRepositoryMock = {
      create: jest.fn(),
    } as unknown as IProductRepository;

    // Inject mocks into the service
    (service as any).txManager = txManagerMock;
    (service as any).categoryRepository = categoryRepositoryMock;
    (service as any).productRepository = productRepositoryMock;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('wires up dependencies correctly', () => {
    expect((service as any).txManager).toBe(txManagerMock);
    expect((service as any).categoryRepository).toBe(categoryRepositoryMock);
    expect((service as any).productRepository).toBe(productRepositoryMock);
  })

  it('should create a product', async () => {
  })
});
